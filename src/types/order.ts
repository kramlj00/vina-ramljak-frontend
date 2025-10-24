import { Wine } from "@/features/home/utils/wine.utils";

export interface OrderItem {
  id: string;
  name: string;
  type: string;
  price: number;
  quantity: number;
  imageSrc: string;
}

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
}

export interface Order {
  id: string; // Stripe session ID
  customerEmail: string;
  customerName?: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  shippingAddress?: ShippingAddress;
  billingAddress?: ShippingAddress;
  createdAt: Date;
  updatedAt: Date;
  stripeSessionId: string;
  stripePaymentIntentId?: string;
}

export interface OrderCreateInput {
  sessionId: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  currency: string;
  paymentStatus: Order["paymentStatus"];
  shippingAddress?: ShippingAddress;
}

// Helper function to convert cart items to order items
export function cartItemsToOrderItems(
  cartItems: Array<Wine & { quantity: number }>
): OrderItem[] {
  return cartItems.map((item) => ({
    id: item.id,
    name: item.name,
    type: item.type,
    price: item.price,
    quantity: item.quantity,
    imageSrc: item.imageSrc,
  }));
}
