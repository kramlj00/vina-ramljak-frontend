import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

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
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Webhook signature verification failed: ${errorMessage}`);
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
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
  } catch (error) {
    console.error(`Error processing webhook: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

  // TODO: Save order to database
  // Items array contains only {wineId, quantity}
  // You can fetch full wine details from your database/API using wineId
  // await saveOrderToDatabase({
  //   orderId,
  //   customerEmail,
  //   customerName,
  //   amount,
  //   currency,
  //   status: 'completed',
  //   items, // [{wineId: "rose", quantity: 2}, ...]
  //   shippingAddress,
  //   createdAt: new Date(),
  // });

  // TODO: Send confirmation email
  // Fetch full wine details before sending email:
  // const fullItems = await Promise.all(
  //   items.map(async (item) => ({
  //     ...await getWineById(item.wineId),
  //     quantity: item.quantity,
  //   }))
  // );
  // await sendOrderConfirmationEmail({
  //   to: customerEmail,
  //   orderId,
  //   items: fullItems,
  //   amount,
  //   currency,
  // });

  // TODO: Update inventory
  // await updateInventory(items);

  console.log(
    `Order ${orderId} processed successfully with ${items.length} items`
  );
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

  // TODO: Update order status if needed
  // await updateOrderPaymentStatus(paymentIntent.id, 'succeeded');
}

// Handle failed payment intent
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.error("❌ Payment failed:", paymentIntent.id);

  const failureMessage = paymentIntent.last_payment_error?.message;

  console.error("Failure details:", {
    paymentId: paymentIntent.id,
    failureMessage,
  });

  // TODO: Send payment failure notification
  // await sendPaymentFailureEmail({
  //   to: paymentIntent.receipt_email,
  //   paymentId: paymentIntent.id,
  //   reason: failureMessage,
  // });

  // TODO: Update order status
  // await updateOrderPaymentStatus(paymentIntent.id, 'failed');
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
