import { Router } from "express";
import { environmentConfig } from "../config/environment.config.js";
import TicketManager from "../services/tickets.service.js";
import Stripe from "stripe";
const router = Router();
const ticketService = new TicketManager();
const stripe = new Stripe(environmentConfig.SERVER.STRIPE.SECRET_KEY);
router.get("/comprainiciada", (req, res) => {
  res
    .cookie(
      "WWcompraIniciada",
      { status: "ok", tiempo: new Date() },
      {
        maxAge: 120000, //milliseconds
        httpOnly: true,
        signed: true,
      }
    )
    .send({ status: "ok", message: "la cookie fue creada" });
});

router.get("/comprafinalizada", (req, res) => {
  if (!req.signedCookies["WWcompraIniciada"]) {
    return res.status(500).send({
      error: "Error interno",
      message: "La compra no se pudo concretar",
    });
  }
  return res.clearCookie("WWcompraIniciada").status(201).send({
    status: "success",
    message: "La compra finalizó correctamente",
  });
});
router.get("/config", (req, res) => {
  res.send({
    publishableKey: environmentConfig.SERVER.STRIPE.PUBLIC_KEY,
  });
});

router.post("/create-payment-intent/:tid", async (req, res) => {
  let ticketCode = req.params.tid;

  let params = {};
  let currency = "usd";

  try {
    const tickets = await ticketService.getTicketByCode(ticketCode);
    const ticket = tickets[0];
    console.log(ticket);
    params = {
      payment_method_types: ["card"],
      amount: ticket.amount,
      currency: currency,
      metadata: { emailComprador: ticket.purchaser },
    };
    const paymentIntent = await stripe.paymentIntents.create(params);

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
      nextAction: paymentIntent.next_action,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});

router.get("/payment/next", async (req, res) => {
  const intent = await stripe.paymentIntents.retrieve(
    req.query.payment_intent,
    {
      expand: ["payment_method"],
    }
  );

  res.redirect(`/success?payment_intent_client_secret=${intent.client_secret}`);
});

router.get("/success", async (req, res) => {
  res.render("success", { style: "admin.css" });
});

export default router;
