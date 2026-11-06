import type {Request, Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { createOrderRequestHash } from '../utils/idempotency.js';
import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../config/database.js';
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from '../validators/order.validator.js';

const orderInclude = {
  customer: true,
  items: true,
} satisfies Prisma.OrderInclude;

function formatOrder(
  order: Prisma.OrderGetPayload<{ include: typeof orderInclude }>,
) {
  return {
    id: order.id,
    customerName: order.customer.name,
    customerEmail: order.customer.email,
    items: order.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice.toNumber(),
    })),
    total: order.total.toNumber(),
    status: order.status,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}

async function withSerializableRetry<T>(
  operation: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await prisma.$transaction(operation, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      });
    } catch (error) {
      const isSerializationConflict =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2034';

      if (!isSerializationConflict || attempt === maxAttempts) {
        throw error;
      }

      // Short exponential backoff before retrying.
      await new Promise((resolve) =>
        setTimeout(resolve, 100 * 2 ** (attempt - 1)),
      );
    }
  }

  throw new Error('Transaction retry limit exceeded.');
}

export async function getOrders(_req: Request, res: Response) {
  const orders = await prisma.order.findMany({
    include: orderInclude,
    orderBy: { createdAt: 'desc' },
  });

  return res.json(orders.map(formatOrder));
}

export async function getOrderById(req: Request, res: Response) {
  const id = req.params.id;

  if (typeof id !== 'string' || !id.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Invalid order ID.',
    });
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: orderInclude,
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found.',
    });
  }

  return res.json(formatOrder(order));
}

export async function createOrder(
  req: AuthenticatedRequest,
  res: Response,
) {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.',
    });
  }

  const idempotencyKey = req.get('Idempotency-Key')?.trim();

  if (
    !idempotencyKey ||
    idempotencyKey.length < 16 ||
    idempotencyKey.length > 255
  ) {
    return res.status(400).json({
      success: false,
      message: 'A valid Idempotency-Key header is required.',
    });
  }

  const result = createOrderSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: 'Invalid order data.',
      errors: result.error.flatten(),
    });
  }

  const { customer, items } = result.data;

  const quantities = new Map<string, number>();

  for (const item of items) {
    quantities.set(
      item.productId,
      (quantities.get(item.productId) ?? 0) + item.quantity,
    );
  }

  const requestHash = createOrderRequestHash({
    customer,
    items,
  });

  try {
    const order = await withSerializableRetry(async (tx) => {
      const existingRecord = await tx.idempotencyRecord.findUnique({
        where: {
          key_userId: {
            key: idempotencyKey,
            userId,
          },
        },
      });

      if (existingRecord) {
        if (existingRecord.requestHash !== requestHash) {
          throw new Error('IDEMPOTENCY_KEY_REUSED');
        }

        const existingOrder = await tx.order.findUnique({
          where: { id: existingRecord.orderId },
          include: orderInclude,
        });

        if (!existingOrder) {
          throw new Error('IDEMPOTENCY_ORDER_NOT_FOUND');
        }

        return existingOrder;
      }

      const customerRecord = await tx.customer.upsert({
        where: { email: customer.email },
        update: { name: customer.name },
        create: {
          name: customer.name,
          email: customer.email,
        },
      });

      const orderItems: {
        productId: string;
        productName: string;
        quantity: number;
        unitPrice: Prisma.Decimal;
      }[] = [];

      let total = new Prisma.Decimal(0);

      for (const [productId, quantity] of quantities) {
        const product = await tx.product.findUnique({
          where: { id: productId },
        });

        if (!product) {
          throw new Error(`PRODUCT_NOT_FOUND:${productId}`);
        }

        if (product.status !== 'active') {
          throw new Error(`PRODUCT_NOT_ACTIVE:${productId}`);
        }

        const stockUpdate = await tx.product.updateMany({
          where: {
            id: productId,
            stock: { gte: quantity },
            status: 'active',
          },
          data: {
            stock: { decrement: quantity },
          },
        });

        if (stockUpdate.count !== 1) {
          throw new Error(`INSUFFICIENT_STOCK:${productId}`);
        }

        const lineTotal = product.price.mul(quantity);
        total = total.add(lineTotal);

        orderItems.push({
          productId: product.id,
          productName: product.name,
          quantity,
          unitPrice: product.price,
        });
      }

      const createdOrder = await tx.order.create({
        data: {
          customerId: customerRecord.id,
          total,
          items: {
            create: orderItems,
          },
        },
        include: orderInclude,
      });

      await tx.idempotencyRecord.create({
        data: {
          key: idempotencyKey,
          userId,
          requestHash,
          orderId: createdOrder.id,
        },
      });

      return createdOrder;
    });

    return res.status(201).json(formatOrder(order));
  } catch (error) {
        // Recover safely when another concurrent request
    // has already created the record with this key.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      const existingRecord = await prisma.idempotencyRecord.findUnique({
        where: {
          key_userId: {
            key: idempotencyKey,
            userId,
          },
        },
      });

      if (existingRecord) {
        if (existingRecord.requestHash !== requestHash) {
          return res.status(409).json({
            success: false,
            message:
              'This Idempotency-Key has already been used with different order data.',
          });
        }

        const existingOrder = await prisma.order.findUnique({
          where: { id: existingRecord.orderId },
          include: orderInclude,
        });

        if (!existingOrder) {
          return res.status(409).json({
            success: false,
            message: 'The original order for this request could not be found.',
          });
        }

        return res.status(200).json(formatOrder(existingOrder));
      }
    }
    
    if (
      error instanceof Error &&
      error.message === 'IDEMPOTENCY_KEY_REUSED'
    ) {
      return res.status(409).json({
        success: false,
        message: 'This Idempotency-Key has already been used with different order data.',
      });
    }

    if (
      error instanceof Error &&
      error.message === 'IDEMPOTENCY_ORDER_NOT_FOUND'
    ) {
      return res.status(409).json({
        success: false,
        message: 'The original order for this request could not be found.',
      });
    }

    throw error;
  }
}

type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

const allowedOrderTransitions: Record<OrderStatus, OrderStatus[]> = {
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

export async function updateOrderStatus(req: Request, res: Response) {
  const id = req.params.id;

  if (typeof id !== 'string' || !id.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Invalid order ID.',
    });
  }

  const result = updateOrderStatusSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: 'Invalid order status.',
      errors: result.error.flatten(),
    });
  }

  const { status } = result.data;

  try {
   const updatedOrder = await withSerializableRetry(async (tx) => {
        const order = await tx.order.findUnique({
          where: { id },
          include: { items: true },
        });

        if (!order) {
          return null;
        }

        if (order.status === status) {
          return tx.order.findUnique({
            where: { id },
            include: orderInclude,
          });
        }

        const allowedNextStatuses = allowedOrderTransitions[order.status];

if (!allowedNextStatuses.includes(status)) {
  throw new Error(
    `ORDER_STATUS_TRANSITION_NOT_ALLOWED:${order.status}:${status}`,
  );
}

        // Only one concurrent request can change this order
        // from its previously observed status.
        const claimedOrder = await tx.order.updateMany({
          where: {
            id,
            status: order.status,
          },
          data: { status },
        });

        if (claimedOrder.count !== 1) {
          throw new Error('ORDER_STATUS_CONFLICT');
        }

        if (status === 'cancelled') {
          for (const item of order.items) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                stock: { increment: item.quantity },
              },
            });
          }
        }

        return tx.order.findUnique({
          where: { id },
          include: orderInclude,
        });
        });

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    return res.json(formatOrder(updatedOrder));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'ORDER_STATUS_CONFLICT'
    ) {
      return res.status(409).json({
        success: false,
        message: 'The order was updated by another request. Please refresh and try again.',
      });
    }

    if (
      error instanceof Error &&
      error.message.startsWith('ORDER_STATUS_TRANSITION_NOT_ALLOWED:')
    ) {
      return res.status(409).json({
        success: false,
        message: 'This order status transition is not allowed.',
      });
    }

    throw error;
  }
}

