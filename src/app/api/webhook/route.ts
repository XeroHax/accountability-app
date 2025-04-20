import { NextResponse } from "next/server";
import Stripe from "stripe";
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin if not already initialized
let db;
try {
  if (getApps().length === 0) {
    // In Firebase environment, it can use default credentials
    // or we can specify the project ID from the environment
    initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || "accountability-place-bkdz2b",
    });
    console.log("Firebase Admin initialized successfully");
  }
  db = getFirestore();
} catch (error) {
  console.error("Error initializing Firebase Admin:", error);
  console.log("Continuing without Firebase Admin initialization");
  // Don't throw an error here to allow the build to continue
}

// Initialize Stripe only if the secret key is available
// This prevents build errors when environment variables aren't set
let stripe: Stripe | undefined;
try {
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-03-31.basil",
    });
    console.log("Stripe initialized successfully");
  } else {
    console.log(
      "Stripe secret key not available, Stripe initialization skipped"
    );
  }
} catch (error) {
  console.error("Error initializing Stripe:", error);
}

// Use the webhook secret from the Stripe CLI for local testing
// Make sure this matches the secret shown when you run 'stripe listen'
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  console.log("Webhook endpoint called");
  try {
    // Check if Stripe is initialized
    if (!stripe) {
      console.error("Stripe is not initialized");
      return NextResponse.json(
        { error: "Stripe is not initialized" },
        { status: 500 }
      );
    }

    const body = await request.text();
    console.log("Request body received");

    const signature = request.headers.get("stripe-signature") || "";
    console.log("Stripe signature:", signature ? "Present" : "Missing");

    if (!webhookSecret) {
      console.error("Webhook secret is missing in environment variables");
      return NextResponse.json(
        { error: "Missing webhook secret" },
        { status: 400 }
      );
    }

    console.log("Constructing Stripe event");
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
    console.log("Event constructed successfully:", event.type);

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("Checkout completed event received");

        // Get the user ID from the session
        let userId = session.client_reference_id;
        console.log("User ID from session:", userId || "Missing");

        // For testing with Stripe CLI, use a specific user ID if missing
        if (!userId) {
          userId = "7dZt9edIHsWwaVstdQpSvJKwUuG2"; // Specific user ID for testing
          console.log("Using specific user ID for testing:", userId);
        }

        if (userId) {
          // Get subscription details from the session
          let subscriptionId = session.subscription as string;

          // For testing with Stripe CLI, use a dummy subscription ID if missing
          if (!subscriptionId) {
            subscriptionId = "sub_test_" + Date.now();
            console.log(
              "No subscription found in session, using dummy ID for testing:",
              subscriptionId
            );

            // Create dummy subscription data for testing
            const subscriptionData = {
              stripeSubscriptionId: subscriptionId,
              currentPeriodStart: new Date(),
              currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
              status: "active",
              pricePerDay: session.metadata?.pricePerDay || "3",
              timezone: session.metadata?.timezone || "UTC",
              createdAt: new Date(),
              discountProcessed: false,
            };

            console.log("Subscription data prepared:", subscriptionData);

            // Add subscription to Firestore
            console.log("Adding subscription to Firestore");
            try {
              await db
                .collection("subscriptions")
                .doc(userId)
                .set(subscriptionData);
              console.log(
                `Added test subscription ${subscriptionId} for user ${userId} successfully`
              );
            } catch (firestoreError) {
              console.error(
                "Error adding subscription to Firestore:",
                firestoreError
              );
            }
          } else {
            console.log("Subscription ID from session:", subscriptionId);

            try {
              console.log("Retrieving subscription details from Stripe");
              const subscriptionDetails = await stripe.subscriptions.retrieve(
                subscriptionId
              );
              console.log("Subscription details retrieved successfully");

              // Update subscription to bill at 11:00 PM in user's timezone
              const userTimezone = session.metadata?.timezone || "UTC";
              console.log(
                "Setting billing cycle to 11:00 PM in timezone:",
                userTimezone
              );

              try {
                // For now, we'll use a simpler approach by just updating the metadata
                // to include the preferred billing time
                await stripe.subscriptions.update(subscriptionId, {
                  metadata: {
                    ...subscriptionDetails.metadata,
                    preferred_billing_time: "23:00", // 11:00 PM
                    timezone: userTimezone,
                  },
                });
                console.log("Updated subscription with preferred billing time");
              } catch (billingError) {
                console.error(
                  "Error updating subscription billing info:",
                  billingError
                );
              }

              // Prepare subscription data
              const subscriptionData = {
                stripeSubscriptionId: subscriptionId,
                currentPeriodStart: new Date(
                  (subscriptionDetails as any).current_period_start * 1000
                ),
                currentPeriodEnd: new Date(
                  (subscriptionDetails as any).current_period_end * 1000
                ),
                status: subscriptionDetails.status,
                pricePerDay: session.metadata?.pricePerDay,
                timezone: session.metadata?.timezone || "UTC",
                preferredBillingTime: "23:00", // 11:00 PM
                createdAt: new Date(),
                discountProcessed: false,
              };
              console.log("Subscription data prepared:", subscriptionData);

              // Add subscription to Firestore
              console.log("Adding subscription to Firestore");
              try {
                await db
                  .collection("subscriptions")
                  .doc(userId)
                  .set(subscriptionData);
                console.log(
                  `Added subscription ${subscriptionId} for user ${userId} successfully`
                );
              } catch (firestoreError) {
                console.error(
                  "Error adding subscription to Firestore:",
                  firestoreError
                );
              }
            } catch (stripeError) {
              console.error(
                "Error retrieving subscription from Stripe:",
                stripeError
              );
            }
          }
        } else {
          console.log("No user ID found in session client_reference_id");
        }
        break;

      case "customer.subscription.updated":
        const updatedSubscription = event.data.object as Stripe.Subscription;
        console.log("Subscription updated:", updatedSubscription);

        // If userId is in metadata, update the subscription record
        if (updatedSubscription.metadata.userId) {
          await db
            .collection("subscriptions")
            .doc(updatedSubscription.metadata.userId)
            .update({
              currentPeriodEnd: new Date(
                (updatedSubscription as any).current_period_end * 1000
              ),
              discountProcessed: false,
              stripeSubscriptionId: updatedSubscription.id,
            });

          console.log(
            `Updated subscription data for user ${updatedSubscription.metadata.userId}`
          );
        }
        break;

      // We can add other event handlers as needed
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 }
    );
  }
}
