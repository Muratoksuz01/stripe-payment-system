
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import type { Appearance } from "@stripe/stripe-js";


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutPage({ products }:any) {
    const appearance: Appearance = {
  theme: "stripe",
};
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/1create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: products }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [products]);


  return (
    <div className="flex gap-10 p-10">
      {/* Sol taraf tamamen senin tasarımın */}
      <div className="w-1/2">
        <h1>Sepetin</h1>
        {products.map((p:any) => (
          <div key={p.id}>
            <p>{p.name}</p>
            <p>{p.discountedPrice} USD</p>
          </div>
        ))}
      </div>

      {/* Sağ taraf Stripe formu */}
      <div className="w-1/2">
        {clientSecret && (
          <Elements options={{ clientSecret, appearance }} stripe={stripePromise}>
            <PaymentForm />
          </Elements>
        )}
      </div>
    </div>
  );
}

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handlePay = async () => {
      if (!stripe || !elements) return;

    const { error } = await stripe!.confirmPayment({
      elements,
      
      confirmParams: {
        return_url: "http://localhost:5173/success",
      },
    });

    if (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <PaymentElement />
      <button onClick={handlePay} className="mt-4 bg-black text-white p-3 rounded">
        Öde
      </button>
    </>
  );
}
