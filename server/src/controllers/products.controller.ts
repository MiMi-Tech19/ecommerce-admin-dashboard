
import type { Request, Response } from 'express';
import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../config/database.js';
import {
  createProductSchema,
  updateProductSchema,
} from '../validators/product.validator.js';

function getProductId(req: Request): string | null {
  const id = req.params.id;

  if (typeof id !== 'string' || !id.trim()) {
    return null;
  }

  return id;
}

function formatProduct(product: {
  id: string;
  name: string;
  description: string;
  category: string;
  price: Prisma.Decimal;
  stock: number;
  status: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...product,
    price: product.price.toNumber(),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export async function getProducts(_req: Request, res: Response) {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.json(products.map(formatProduct));
}

export async function getProductById(req: Request, res: Response) {
  const id = getProductId(req);

  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Invalid product ID.',
    });
  }

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found.',
    });
  }

  return res.json(formatProduct(product));
}

export async function createProduct(req: Request, res: Response) {
  const result = createProductSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: 'Invalid product data.',
      errors: result.error.flatten(),
    });
  }

  const product = await prisma.product.create({
    data: result.data,
  });

  return res.status(201).json(formatProduct(product));
}

export async function updateProduct(req: Request, res: Response) {
const id = getProductId(req);

if (!id) {
  return res.status(400).json({
    success: false,
    message: 'Invalid product ID.',
  });
}

  const result = updateProductSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: 'Invalid product data.',
      errors: result.error.flatten(),
    });
  }

  const existingProduct = await prisma.product.findUnique({
    where: {
      id: id,
    },
  });

  if (!existingProduct) {
    return res.status(404).json({
      success: false,
      message: 'Product not found.',
    });
  }

  const product = await prisma.product.update({
    where: {
      id: id,
    },
    data: result.data,
  });

  return res.json(formatProduct(product));
}

export async function deleteProduct(req: Request, res: Response) {
  const id = getProductId(req);

  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Invalid product ID.',
    });
  }
  
    const existingProduct = await prisma.product.findUnique({
    where: {
      id: id,
    },
  });

  if (!existingProduct) {
    return res.status(404).json({
      success: false,
      message: 'Product not found.',
    });
  }

  try {
    await prisma.product.delete({
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully.',
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      return res.status(409).json({
        success: false,
        message: 'This product is associated with existing orders and cannot be deleted.',
      });
    }

    throw error;
  }
}
