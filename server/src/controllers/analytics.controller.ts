
import type { Request, Response } from 'express';
import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../config/database.js';

const allowedPeriods = [7, 30, 90] as const;

export async function getDashboardAnalytics(
  req: Request,
  res: Response,
) {
  const requestedPeriod = Number(req.query.period ?? 7);

  if (
    !allowedPeriods.includes(
      requestedPeriod as (typeof allowedPeriods)[number],
    )
  ) {
    return res.status(400).json({
      success: false,
      message: 'Period must be 7, 30, or 90 days.',
    });
  }

  const period = requestedPeriod as (typeof allowedPeriods)[number];

  // Include today and the preceding days in the selected period.
  const today = new Date();
  const endDate = new Date(
    Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
    ),
  );

  const startDate = new Date(endDate);
  startDate.setUTCDate(startDate.getUTCDate() - (period - 1));

  const [
    revenueResult,
    totalOrders,
    totalProducts,
    salesOrders,
    categoryItems,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: { status: 'delivered' },
      _sum: { total: true },
    }),

    prisma.order.count({
      where: { status: { not: 'cancelled' } },
    }),

    prisma.product.count(),

    prisma.order.findMany({
      where: {
        status: 'delivered',
        createdAt: { gte: startDate },
      },
      select: {
        id: true,
        total: true,
        createdAt: true,
      },
    }),

    prisma.orderItem.findMany({
      where: {
        order: { status: 'delivered' },
      },
      select: {
        orderId: true,
        quantity: true,
        unitPrice: true,
        product: {
          select: { category: true },
        },
      },
    }),
  ]);

  // Prepare every date in the selected period, including dates with no sales.
  const dailySales = new Map<
    string,
    { revenue: Prisma.Decimal; orders: number }
  >();

  for (let index = 0; index < period; index++) {
    const date = new Date(startDate);
    date.setUTCDate(date.getUTCDate() + index);

    const dateKey = date.toISOString().slice(0, 10);

    dailySales.set(dateKey, {
      revenue: new Prisma.Decimal(0),
      orders: 0,
    });
  }

  for (const order of salesOrders) {
    const dateKey = order.createdAt.toISOString().slice(0, 10);
    const dailyRecord = dailySales.get(dateKey);

    if (dailyRecord) {
      dailyRecord.revenue = dailyRecord.revenue.add(order.total);
      dailyRecord.orders += 1;
    }
  }

  const salesOverTime = Array.from(
    dailySales.entries(),
    ([date, values]) => ({
      date,
      revenue: values.revenue.toNumber(),
      orders: values.orders,
    }),
  );

  // Calculate delivered revenue and distinct order counts by category.
  const categoryTotals = new Map<
    string,
    { revenue: Prisma.Decimal; orderIds: Set<string> }
  >();

  for (const item of categoryItems) {
    const category = item.product.category;

    let record = categoryTotals.get(category);

    if (!record) {
      record = {
        revenue: new Prisma.Decimal(0),
        orderIds: new Set<string>(),
      };

      categoryTotals.set(category, record);
    }

    record.revenue = record.revenue.add(
      item.unitPrice.mul(item.quantity),
    );

    record.orderIds.add(item.orderId);
  }

  const salesByCategory = Array.from(
    categoryTotals.entries(),
    ([category, values]) => ({
      category,
      revenue: values.revenue.toNumber(),
      orders: values.orderIds.size,
    }),
  ).sort((a, b) => b.revenue - a.revenue);

  return res.status(200).json({
    totalRevenue: (revenueResult._sum.total ?? new Prisma.Decimal(0)).toNumber(),
    totalOrders,
    totalProducts,
    conversionRate: null,
    salesOverTime,
    salesByCategory,
  });
}
