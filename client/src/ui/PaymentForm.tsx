import { Elements, CardElement, useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import axios from "axios";

import React from 'react'
import { useNavigate } from "react-router-dom";

function PaymentForm({ totalAmt }: { totalAmt: any }) {
  const navigate = useNavigate()
  const stripe = useStripe();
  const elements = useElements();
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("first")
    if (!stripe || !elements) return;

    const card = elements.getElement(CardNumberElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: card!,
    });
    console.log("first")
    if (error) {
      console.log(error.message);
      return;
    }

    // Backend'e gönder
    const res = await axios.post("http://localhost:8000/create-payment-intent", { paymentMethodId: paymentMethod.id, totalAmt: totalAmt.discounted },)
    let data = res.data
    console.log(data);
    // redirect başlat
    const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
      data.client_secret,
    );

    console.log("odeme sonrasi paymentInstance", paymentIntent)
    if (paymentIntent && paymentIntent.status === "succeeded") {
      window.location.href = `/success?payment_intent=${paymentIntent.id}`;
    };
    if (confirmError) console.log(confirmError);
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 border rounded-lg p-4 space-y-4 shadow-sm"
    >
      <div className="text-lg font-semibold">Ödeme Bilgileri</div>

      <div className="space-y-2">
        <label className="text-sm text-gray-700">Kart Numarası
          <span onClick={() => { navigator.clipboard.writeText("4242424242424242"); }}>4242424242424242</span>
        </label>
        <div className="border rounded-md p-3 bg-white shadow-inner">
          <CardNumberElement options={{ style: baseStyle }} />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 space-y-2">
          <label className="text-sm text-gray-700">Son Kullanma</label>
          <div className="border rounded-md p-3 bg-white shadow-inner">
            <CardExpiryElement options={{ style: baseStyle }} />
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <label className="text-sm text-gray-700">CVC</label>
          <div className="border rounded-md p-3 bg-white shadow-inner">
            <CardCvcElement options={{ style: baseStyle }} />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe}
        className="w-full bg-orange-600 text-white py-3 rounded-md font-semibold hover:bg-orange-700 transition disabled:opacity-50"
      >
        Alışverişi Tamamla
      </button>
    </form>

  )
}

export default PaymentForm