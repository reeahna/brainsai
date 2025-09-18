project-root/
│
├── server.js                 # Main entry point (starts Express app)
│
├── config/
│   └── stripe.js             # Stripe client initialization
│
├── routes/
│   ├── payments.js           # One-time payment routes (PaymentIntent)
│   ├── subscriptions.js      # Subscription routes (Customer + Subscription)
│   └── webhooks.js           # Webhook endpoint (handles Stripe events)
│
├── public/
│   ├── checkout.html         # Frontend: one-time checkout page
│   └── subscription.html     # Frontend: subscription page
│
└── package.json
