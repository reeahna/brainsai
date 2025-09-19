import express from "express";
import stripe from "../config/stripe.js";

const router = express.Router();

// Create subscription (Payment Element version)
router.post("/create-subscription", async (req, res) => {
  try {
    const { email, priceId } = req.body;

    // 1. Create customer
    const customer = await stripe.customers.create({ email });

    // 2. Create subscription with default_incomplete so user can confirm payment
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete", // 👈 important for Payment Element
      payment_settings: {
        save_default_payment_method: "on_subscription",
      },
      expand: ["latest_invoice.payment_intent"],
    });

    // 3. Return clientSecret for Payment Element
    res.send({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  } catch (error) {
    console.error("❌ Subscription error:", error);
    res.status(400).send({ error: error.message });
  }
});

export default router;
