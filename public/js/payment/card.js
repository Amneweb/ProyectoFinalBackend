document.addEventListener("DOMContentLoaded", async () => {
  const url = new URL(window.location);
  const ticketCode = url.searchParams.get("ticket_code");
  console.log("dentro de cards");
  // Load the publishable key from the server. The publishable key
  // is set in your .env file.
  const { publishableKey } = await fetch("/api/purchase/config").then((r) =>
    r.json()
  );

  if (!publishableKey) {
    addMessage(
      "No publishable key returned from the server. Please check `.env` and try again"
    );
    alert("Please set your Stripe publishable API key in the .env file");
  }

  const stripe = Stripe(publishableKey, {
    apiVersion: "2020-08-27",
  });

  const elements = stripe.elements();
  const card = elements.create("card");
  card.mount("#card-element");

  // When the form is submitted...
  const form = document.getElementById("payment-form");
  let submitted = false;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Disable double submission of the form
    if (submitted) {
      return;
    }
    submitted = true;
    form.querySelector("button").disabled = true;

    // Make a call to the server to create a new
    // payment intent and store its client_secret.
    const { error: backendError, clientSecret } = await fetch(
      `/api/purchase/create-payment-intent/${ticketCode} `,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currency: "usd",
          paymentMethodType: "card",
        }),
      }
    ).then((r) => r.json());

    if (backendError) {
      addMessage(backendError.message);

      // reenable the form.
      submitted = false;
      form.querySelector("button").disabled = false;
      return;
    }

    addMessage(`Client secret returned.`);

    const nameInput = document.querySelector("#name");

    // Confirm the card payment given the clientSecret
    // from the payment intent that was just created on
    // the server.
    const { error: stripeError, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: nameInput.value,
          },
        },
      });

    if (stripeError) {
      addMessage(stripeError.message);

      // reenable the form.
      submitted = false;
      form.querySelector("button").disabled = false;
      await Swal.fire({
        title: "Oops",
        text: `No se pudo procesar tu pago: ${stripeError.message}`,
      });
      return;
    }

    addMessage(`Payment ${paymentIntent.status}: ${paymentIntent.id}`);
    if (localStorage.getItem("windwardCart"))
      localStorage.removeItem("windwardCart");
    const fetchfinSesion = await fetch("/api/purchase/comprafinalizada");
    const finSesion = await fetchfinSesion.json();
    if (!finSesion) {
      console.log("no se cerró la sesión de compra");
    }
    await Swal.fire({
      title: "Gracias",
      text: `Tu pago ha sido recibido con éxito. El código del mismo es ${paymentIntent.id}.`,
    }).then((result) => {
      form.innerHTML =
        "<p>Gracias por tu compra. En breve te llegará un correo con la confirmación.</p>";
    });
  });
});
