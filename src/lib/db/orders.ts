import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export interface CreateOrderInput {
  stripeSessionId: string;
  customerEmail: string;
  customerName?: string;
  total: number;
  subtotal: number;
  shipping?: number;
  currency: string;
  status: string;
  items: any[];
  shippingAddress?: any;
  billingAddress?: any;
  paymentIntentId?: string;
  paymentStatus?: string;
}

/**
 * Create a new order in the database
 */
export async function createOrder(data: CreateOrderInput) {
  return prisma.order.create({
    data: {
      stripeSessionId: data.stripeSessionId,
      customerEmail: data.customerEmail,
      customerName: data.customerName,
      total: data.total,
      subtotal: data.subtotal,
      shipping: data.shipping || 0,
      currency: data.currency,
      status: data.status as any,
      items: data.items,
      shippingAddress: data.shippingAddress,
      billingAddress: data.billingAddress,
      paymentIntentId: data.paymentIntentId,
      paymentStatus: data.paymentStatus,
    },
  });
}

/**
 * Find order by Stripe session ID
 */
export async function findOrderBySessionId(sessionId: string) {
  return prisma.order.findUnique({
    where: { stripeSessionId: sessionId },
  });
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  sessionId: string,
  status: string,
  paymentIntentId?: string
) {
  return prisma.order.update({
    where: { stripeSessionId: sessionId },
    data: {
      status: status as any,
      paymentIntentId,
      updatedAt: new Date(),
    },
  });
}

/**
 * Get all orders (for admin)
 */
export async function getAllOrders(options?: {
  limit?: number;
  offset?: number;
  status?: string;
}) {
  const { limit = 50, offset = 0, status } = options || {};

  const where: Prisma.OrderWhereInput = {};
  if (status) {
    where.status = status as any;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, total };
}

/**
 * Get orders by customer email
 */
export async function getOrdersByEmail(email: string) {
  return prisma.order.findMany({
    where: { customerEmail: email },
    orderBy: { createdAt: "desc" },
  });
}
