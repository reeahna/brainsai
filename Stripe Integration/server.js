import express from "express";
import bodyParser from "body-parser";
import paymentsRoute from "./routes/payments.js";
import subscriptionsRoute from "./routes/subscriptions.js";
import webhooksRoute from "./routes/webhooks.js";

const app = express();

// JSON parser for normal routes
app.use(bodyParser.json());

// Routes
app.use("/api/payments", paymentsRoute);
app.use("/api/subscriptions", subscriptionsRoute);

// Webhooks (raw body required!)
app.use("/webhook", webhooksRoute);

// Static files for frontend
app.use(express.static("public"));

app.listen(4242, () => console.log("🚀 Server running on http://localhost:4242"));
