import express from "express";
import stripe from "../config/stripe.js";
import bodyParser from "body-parser";

const router = express.Router();

// Raw body required for webhook signature verification
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
        "whsec_12345" // Replace with your webhook secret
      );
    } catch (err) {
      console.error("⚠️ Webhook signature verification failed:", err.message);
      return res.sendStatus(400);
    }

    switch (event.type) {
      case "payment_intent.succeeded":
        console.log("✅ One-time payment succeeded");
        break;

      case "invoice.payment_succeeded":
        console.log("✅ Subscription payment succeeded");
        break;

      case "invoice.payment_failed":
        console.log("❌ Subscription payment failed");
        break;

      case "customer.subscription.deleted":
        console.log("🛑 Subscription canceled");
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  }
);

export default router;
