import Stripe from "stripe";

const stripe = new Stripe("sk_test_12345", {
  apiVersion: "2023-10-16",
});

export default stripe;
