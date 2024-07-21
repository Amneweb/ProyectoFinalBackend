import { Router } from "express";
import environmentConfig from "../config/environment.config.js";
const router = new Router();
router.get("/config", (req, res) => {
  res.send({
    publishableKey: environmentConfig.STRIPE_PUBLISHABLE_KEY,
  });
});

router.post("/create-payment-intent", async (req, res) => {
  let orderAmount = 1400;
  let params = {};
  let currency = "usd";

  params = {
    payment_method_types: paymentMethodType === "card",
    amount: orderAmount,
    currency: currency,
  };
});
export default router;
