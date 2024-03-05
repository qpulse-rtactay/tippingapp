
const app = express();
const port = 3000; //add your port here
const PUBLISHABLE_KEY = "pk_test_51OoKzjDj87CK5zv2OgMrO14g9w6JsXLPpR4sCrdHGOWgxVV1sOPhWopmwl7KGdqpNnnIZtS8ckzsiJbmTN6jghh500cYGTuQmW";
const SECRET_KEY = "sk_test_51OoKzjDj87CK5zv2NROK3hDHq1j6QgyMRrPI05p6K9SnydzuO2FkZXBscVeJnkfZP3kMZ2n69s4odrV3rep5DM1v00vvktraSp";
import express from "express";
import Stripe from "stripe";

// Confirm the API version from your stripe dashboard
const stripe = Stripe(SECRET_KEY, { apiVersion: "2020-08-27" });

app.use(express.json()); // Add this line to enable JSON parsing

app.post("/create-payment-intent", async (req, res) => {
  try {
    const { name, email, amount, fees, origamount } = req.body; // Destructure amount from req.body

    // Create a customer using the provided email
    const customer = await stripe.customers.create({ name, email });
    console.log(customer)
    console.log(req.body);

    const params = {
      amount: amount * 100,
      currency: "usd",
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
      application_fee_amount: fees * 100, // Transaction Fee $1.23
      transfer_data: {
        // amount: origamount * 100,
        destination: 'acct_1OoMPQD3jMQtP9xD', // Replace with your actual connected account ID
      },
    };

    try {
      // Create a PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create(params);
      return res.send({clientSecret: paymentIntent.client_secret,});

    } catch (error) {
      console.error(error);
      return res.status(500).send({error: error.raw ? error.raw.message : "Internal Server Error",});
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
