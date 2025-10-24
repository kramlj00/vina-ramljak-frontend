import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

interface CartItem {
  id: string;
  name: string;
  type: string;
  price: number;
  quantity: number;
  imageSrc: string;
}

interface CheckoutRequestBody {
  items: CartItem[];
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CheckoutRequestBody;
    const { items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    // Convert cart items to Stripe line items
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          description: item.type,
          images: item.imageSrc
            ? [`${process.env.NEXT_PUBLIC_APP_URL}${item.imageSrc}`]
            : [],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Calculate totals
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Store minimal order data in metadata (under 500 char limit)
    // Format: "id:quantity,id:quantity,..."
    const orderSummary = items
      .map((item) => `${item.id}:${item.quantity}`)
      .join(",");

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      shipping_address_collection: {
        allowed_countries: ["HR", "SI", "BA", "RS", "ME", "MK", "AL"],
      },
      billing_address_collection: "required",
      // Store minimal order data in metadata (Stripe limit: 500 chars per field)
      metadata: {
        orderSummary, // e.g., "rose:2,merlot:1,crno:3"
        subtotal: subtotal.toFixed(2),
        itemCount: items.length.toString(),
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    console.error("Error creating checkout session:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
