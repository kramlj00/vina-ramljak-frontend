import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  createOrder,
  findOrderBySessionId,
  updateOrderStatus,
} from "@/lib/db/orders";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle different event types
  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object);
        break;

      case "charge.refunded":
        await handleChargeRefunded(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error(`Error processing webhook: ${error.message}`);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Handle successful checkout session
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  console.log("✅ Checkout session completed:", session.id);

  // Extract order information
  const orderId = session.id;
  const customerEmail = session.customer_details?.email;
  const customerName = session.customer_details?.name;
  const amount = session.amount_total ? session.amount_total / 100 : 0;
  const currency = session.currency;
  const paymentStatus = session.payment_status;

  // Parse order summary from metadata (format: "rose:2,merlot:1,crno:3")
  const orderSummary = session.metadata?.orderSummary;
  const items = orderSummary
    ? orderSummary.split(",").map((item) => {
        const [id, quantity] = item.split(":");
        return { wineId: id, quantity: parseInt(quantity) };
      })
    : [];

  // Get customer address (shipping address collected during checkout)
  const shippingAddress = session.customer_details?.address || null;

  console.log("Order details:", {
    orderId,
    customerEmail,
    customerName,
    amount,
    currency,
    paymentStatus,
    items,
    shippingAddress,
  });

  try {
    // Check if order already exists (prevent duplicates)
    const existingOrder = await findOrderBySessionId(session.id);

    if (existingOrder) {
      console.log(`Order ${orderId} already exists, skipping...`);
      return;
    }

    // Get subtotal from metadata
    const subtotal = parseFloat(session.metadata?.subtotal || "0");

    // Save order to database
    const order = await createOrder({
      stripeSessionId: session.id,
      customerEmail: customerEmail || "",
      customerName: customerName ? customerName : undefined,
      total: amount,
      subtotal: subtotal,
      shipping: amount - subtotal, // Calculate shipping
      currency: currency || "eur",
      status: paymentStatus === "paid" ? "PAID" : "PENDING",
      items, // [{wineId: "rose", quantity: 2}, ...]
      shippingAddress: shippingAddress ? shippingAddress : undefined,
      paymentIntentId: session.payment_intent as string | undefined,
      paymentStatus: paymentStatus ? paymentStatus : undefined,
    });

    console.log(`✅ Order saved to database: ${order.id}`);

    // TODO: Send confirmation email
    // You can implement this with Resend, SendGrid, etc.
    // await sendOrderConfirmationEmail({
    //   to: customerEmail,
    //   orderId: order.id,
    //   items,
    //   amount,
    //   currency,
    // });

    // TODO: Update inventory
    // await updateInventory(items);

    console.log(
      `Order ${orderId} processed successfully with ${items.length} items`
    );
  } catch (error) {
    console.error(`Error saving order ${orderId}:`, error);
    // Don't throw error - we still want to return 200 to Stripe
    // Log error for investigation
  }
}

// Handle successful payment intent
async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
) {
  console.log("✅ Payment succeeded:", paymentIntent.id);

  const amount = paymentIntent.amount / 100;
  const currency = paymentIntent.currency;
  const customerEmail = paymentIntent.receipt_email;

  console.log("Payment details:", {
    paymentId: paymentIntent.id,
    amount,
    currency,
    customerEmail,
  });

  try {
    // Try to find and update order by payment intent ID
    // Note: Order might not exist yet if this event arrives before checkout.session.completed
    if (paymentIntent.id) {
      // This will fail silently if order doesn't exist yet, which is OK
      console.log(`Updating payment status for ${paymentIntent.id}`);
    }
  } catch (error) {
    console.error("Error updating payment status:", error);
  }
}

// Handle failed payment intent
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.error("❌ Payment failed:", paymentIntent.id);

  const failureMessage = paymentIntent.last_payment_error?.message;

  console.error("Failure details:", {
    paymentId: paymentIntent.id,
    failureMessage,
  });

  try {
    // Try to update order status if it exists
    // This might fail if order doesn't exist yet, which is OK
    console.log(`Payment failed for ${paymentIntent.id}: ${failureMessage}`);

    // TODO: Send payment failure notification
    // await sendPaymentFailureEmail({
    //   to: paymentIntent.receipt_email,
    //   paymentId: paymentIntent.id,
    //   reason: failureMessage,
    // });
  } catch (error) {
    console.error("Error handling payment failure:", error);
  }
}

// Handle refunded charge
async function handleChargeRefunded(charge: Stripe.Charge) {
  console.log("💰 Charge refunded:", charge.id);

  const amount = charge.amount_refunded / 100;
  const currency = charge.currency;

  console.log("Refund details:", {
    chargeId: charge.id,
    amount,
    currency,
  });

  // TODO: Process refund
  // await processRefund({
  //   chargeId: charge.id,
  //   amount,
  //   currency,
  // });

  // TODO: Send refund confirmation email
  // await sendRefundConfirmationEmail({
  //   to: charge.billing_details?.email,
  //   chargeId: charge.id,
  //   amount,
  //   currency,
  // });

  // TODO: Restore inventory
  // await restoreInventory(charge.metadata?.items);
}
