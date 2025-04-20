import { NextResponse } from "next/server";
import Stripe from "stripe";

// Using latest API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil' // Use the correct API version
});

export async function POST(request: Request) {
  console.log("Create checkout session endpoint called");
  try {
    const { pricePerDay, userId, timezone } = await request.json();
    console.log("Request data:", { pricePerDay, userId, timezone });

    if (!userId) {
      console.error("User ID is missing in request");
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Calculate monthly price
    const monthlyPrice = (pricePerDay * (365 / 12)).toFixed(2);
    console.log("Calculated monthly price:", monthlyPrice);

    // Create a new price object in Stripe
    console.log("Creating price object in Stripe");
    const price = await stripe.prices.create({
      unit_amount: Math.round(parseFloat(monthlyPrice) * 100), // Convert to cents
      currency: "usd",
      recurring: {
        interval: "month",
      },
      product_data: {
        name: "Accountability Subscription",
      },
    });
    console.log("Price created:", price.id);

    // Create a checkout session
    console.log("Creating checkout session with client_reference_id:", userId);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
      client_reference_id: userId, // Add user ID as client reference
      metadata: {
        pricePerDay: pricePerDay.toString(),
        userId: userId, // Also add to metadata for redundancy
        timezone: timezone || "UTC", // Store timezone, default to UTC if not provided
      },
    });
    console.log("Checkout session created:", {
      id: session.id,
      client_reference_id: session.client_reference_id,
      metadata: session.metadata,
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 }
    );
  }
}
