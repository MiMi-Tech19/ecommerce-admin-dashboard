import type { Order } from '../../types';

export const orders: Order[] = [
  {
    id: 'ORD-1001',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah@example.com',
    items: [
      {
        productId: 'prod-001',
        productName: 'Wireless Headphones',
        quantity: 1,
        unitPrice: 129.99,
      },
    ],
    total: 129.99,
    status: 'delivered',
    createdAt: '2026-09-30T10:30:00Z',
    updatedAt: '2026-09-30T14:20:00Z',
  },
  {
    id: 'ORD-1002',
    customerName: 'Michael Brown',
    customerEmail: 'michael@example.com',
    items: [
      {
        productId: 'prod-002',
        productName: 'Running Shoes',
        quantity: 2,
        unitPrice: 89.99,
      },
    ],
    total: 179.98,
    status: 'processing',
    createdAt: '2026-09-30T09:15:00Z',
    updatedAt: '2026-09-30T09:45:00Z',
  },
  {
    id: 'ORD-1003',
    customerName: 'Emily Davis',
    customerEmail: 'emily@example.com',
    items: [
      {
        productId: 'prod-003',
        productName: 'Smart Watch',
        quantity: 1,
        unitPrice: 199.99,
      },
    ],
    total: 199.99,
    status: 'shipped',
    createdAt: '2026-09-29T16:40:00Z',
    updatedAt: '2026-09-30T08:10:00Z',
  },
  {
    id: 'ORD-1004',
    customerName: 'David Wilson',
    customerEmail: 'david@example.com',
    items: [
      {
        productId: 'prod-004',
        productName: 'Coffee Maker',
        quantity: 1,
        unitPrice: 64.99,
      },
    ],
    total: 64.99,
    status: 'pending',
    createdAt: '2026-09-29T13:25:00Z',
    updatedAt: '2026-09-29T13:25:00Z',
  },
  {
    id: 'ORD-1005',
    customerName: 'Jessica Taylor',
    customerEmail: 'jessica@example.com',
    items: [
      {
        productId: 'prod-001',
        productName: 'Wireless Headphones',
        quantity: 2,
        unitPrice: 129.99,
      },
    ],
    total: 259.98,
    status: 'delivered',
    createdAt: '2026-09-28T11:50:00Z',
    updatedAt: '2026-09-29T15:30:00Z',
  },
];