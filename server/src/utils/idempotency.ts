import { createHash } from 'node:crypto';

interface OrderRequestData {
  customer: {
    name: string;
    email: string;
  };
  items: {
    productId: string;
    quantity: number;
  }[];
}

export function createOrderRequestHash(
  data: OrderRequestData,
): string {
  const normalizedData = {
    customer: {
      name: data.customer.name,
      email: data.customer.email,
    },
    items: [...data.items]
      .sort((a, b) => a.productId.localeCompare(b.productId))
      .map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
  };

  return createHash('sha256')
    .update(JSON.stringify(normalizedData))
    .digest('hex');
}