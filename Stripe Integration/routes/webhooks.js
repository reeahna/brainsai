import express from "express";
import stripe from "../config/stripe.js";
import bodyParser from "body-parser";

const router = express.Router();

// Webhook endpoint
router.post(
  "/",
  bodyParser.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET // ✅ use .env, not hardcoded
      );
    } catch (err) {
      console.error("⚠️ Webhook signature verification failed:", err.message);
      return res.sendStatus(400);
    }

    // ✅ Handle events
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        console.log("✅ One-time payment succeeded:", paymentIntent.id);
        // 👉 Update your order in DB as paid
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        console.log("✅ Subscription payment succeeded:", invoice.id);

        // 👉 Example: Mark subscription active in your DB
        // const subscriptionId = invoice.subscription;
        // updateUserSubscription(subscriptionId, "active");

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        console.log("❌ Subscription payment failed:", invoice.id);

        // 👉 Example: Flag subscription in DB for retry or notify user
        // const subscriptionId = invoice.subscription;
        // updateUserSubscription(subscriptionId, "past_due");

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        console.log("🛑 Subscription canceled:", subscription.id);

        // 👉 Example: Mark subscription inactive in DB
        // updateUserSubscription(subscription.id, "canceled");

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  }
);

export default router;
