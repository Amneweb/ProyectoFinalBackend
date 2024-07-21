const stripe = Stripe(environmentConfig);

const appearance = {
  /* appearance */
};
const options = {
  layout: {
    type: "tabs",
    defaultCollapsed: false,
  },
};
const elements = stripe.elements({ clientSecret, appearance });
const paymentElement = elements.create("payment", options);
paymentElement.mount("#payment-element");
