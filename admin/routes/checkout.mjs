import { Router } from "express";
import Stripe from "stripe";

const router = Router();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
//bizi odeme sayfasına yonlediryor 
router.post("/checkout", async (req, res) => {
  console.log("burada",stripeSecretKey)
  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2024-06-20",
  });
  try {
    const { items, email } = await req.body;

    const extractingItems = await items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "try",
        unit_amount: item.discountedPrice * 100,
        product_data: {
          name: item.name,
          description: item.description,
          images: item.images,
        },
      },
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: extractingItems,
      mode: "payment",
      success_url:
        "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/cancel",
      metadata: {
      //  email,  // hicbir sey degişmedi 
      },
      payment_method_options:{
        card:{
          restrictions:{
             brands_blocked:['american_express']
          }
        }
      }
    });

    res.json({
      message: "Server is connected",
      success: true,
      id: session.id,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
//odeme sayfası bizim ama onların elementlerini kullanıyoruz tam mudahale yetkimiz yok 
router.post("/1create-payment-intent", async (req, res) => {
  try {
    const { items } = req.body;

    // Ürünlerin toplam fiyatını hesapla
    const amount = items.reduce((total, item) => {
      return total + item.discountedPrice * item.quantity * 100;
    }, 0);

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "try", // istersen "try"
      automatic_payment_methods: { enabled: true },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/create-payment-intent", async (req, res) => {
  const { paymentMethodId,totalAmt } = req.body;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
    });
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmt*100,//kurus cınsıne cevirmek gerek
    currency: "try",
    payment_method: paymentMethodId,
    confirm: false, // otomatik onay   
  });

  res.json(paymentIntent);
});
export default router;
