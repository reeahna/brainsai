import express from "express";
import paymentsRoute from "./routes/payments.js";
import subscriptionsRoute from "./routes/subscriptions.js";
import webhooksRoute from "./routes/webhooks.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// JSON parser
app.use(express.json());

// Routes
app.use("/api/payments", paymentsRoute);
app.use("/api/subscriptions", subscriptionsRoute);

// Webhooks (raw body required!)
app.use("/webhook", webhooksRoute);

// Static files for frontend
app.use(express.static("public"));

// Endpoint to get Stripe publishable key
app.get("/config", (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});


app.listen(process.env.PORT || 4242, () => 
  console.log("🚀 Server running on http://localhost:4242")
);