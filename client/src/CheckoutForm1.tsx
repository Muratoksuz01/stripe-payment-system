import { useState } from "react";
import { Elements, CardElement, useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Form komponenti artık sadece Elements içinde çalışacak
const CheckoutFormInner = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("first")
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: card!,
    });

    if (error) {
      console.log(error.message);
      return;
    }

    // Backend'e gönder
    const res = await fetch("http://localhost:8000/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentMethodId: paymentMethod.id }),
    });

    const data = await res.json();
    console.log(data);
     // redirect başlat
  const { error: confirmError } = await stripe.confirmCardPayment(
    data.client_secret
  );

  if (confirmError) console.log(confirmError);
  };
    const handleSubmit1 = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("first")
    if (!stripe || !elements) return;

    const cardNumberElement = elements.getElement(CardNumberElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumberElement!,
    });

    if (error) {
      console.log(error.message);
      return;
    }

    // Backend'e gönder
    const res = await fetch("http://localhost:8000/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentMethodId: paymentMethod.id }),
    });

    const data = await res.json();
    console.log(data);


  };
  const baseStyle = {
    base: {
      color: "#424770",
      fontSize: "16px",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      letterSpacing: "0.025em",
      "::placeholder": {
        color: "#a0aec0",
      },
      padding: "10px 12px",
    },
    invalid: {
      color: "#f56565",
      iconColor: "#f56565",
    },
  };

  return (

<form onSubmit={handleSubmit1} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg space-y-4">
  <div>
    <label className="block text-gray-700 font-semibold mb-1">Card number</label>
    <div className="border border-gray-300 rounded-md p-3">
      <CardNumberElement options={{ style: baseStyle }} />
    </div>
  </div>

  <div>
    <label className="block text-gray-700 font-semibold mb-1">Expiry date</label>
    <div className="border border-gray-300 rounded-md p-3">
      <CardExpiryElement options={{ style: baseStyle }} />
    </div>
  </div>

  <div>
    <label className="block text-gray-700 font-semibold mb-1">CVC</label>
    <div className="border border-gray-300 rounded-md p-3">
      <CardCvcElement options={{ style: baseStyle }} />
    </div>
  </div>

  <button
    type="submit"
    disabled={!stripe}
    className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  >
    Pay
  </button>
</form>


  );
};

// Ana komponent
const CheckoutForm1 = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutFormInner />
    </Elements>
  );
};

export default CheckoutForm1;
