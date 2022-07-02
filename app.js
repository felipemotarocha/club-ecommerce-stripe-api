require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_API_KEY);
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PAYMENT_CONFIRMATION_URL = `${process.env.FRONT_END_URL}/payment-confirmation`;

app.post("/create-checkout-session", async (req, res) => {
  console.log(req.body);
  const items = req.body.products.map((product) => ({
    price_data: {
      currency: "brl",
      product_data: {
        name: product.name,
      },
      unit_amount: parseInt(`${product.price}00`),
    },
    quantity: product.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    line_items: items,
    mode: "payment",
    success_url: `${PAYMENT_CONFIRMATION_URL}?success=true`,
    cancel_url: `${PAYMENT_CONFIRMATION_URL}?canceled=true`,
  });

  res.send({ url: session.url });
});

app.listen(5000, () => console.log("Running on port 5050"));
