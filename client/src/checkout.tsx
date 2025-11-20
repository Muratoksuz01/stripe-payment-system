import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

export default function CustomPaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handlePay = async () => {
    if (!stripe || !elements) return;

    const { error } = await stripe.confirmPayment({
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
    <div className="space-y-4">

      {/* ÜSTTE SEKME YAPISI */}
      <div className="flex gap-3">
        <button className="px-4 py-2 border rounded">Kart</button>
        <button className="px-4 py-2 border rounded">Cash App Pay</button>
        <button className="px-4 py-2 border rounded">Amazon Pay</button>
      </div>

      {/* KART NUMARASI */}
      <div>
        <label className="block text-sm mb-1">Kart Numarası</label>
        <div className="border p-3 rounded">
          <CardNumberElement className="w-full" />
        </div>
      </div>

      {/* TARİH - CVC */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm mb-1">Son Kullanma</label>
          <div className="border p-3 rounded">
            <CardExpiryElement className="w-full" />
          </div>
        </div>

        <div className="w-40">
          <label className="block text-sm mb-1">CVC</label>
          <div className="border p-3 rounded">
            <CardCvcElement className="w-full" />
          </div>
        </div>
      </div>

      {/* ÜLKE */}
      <div>
        <label className="block text-sm mb-1">Ülke</label>
        <select className="border p-3 w-full rounded">
          <option>Türkiye</option>
          <option>ABD</option>
          <option>Almanya</option>
        </select>
      </div>

      {/* BUTON */}
      <button
        onClick={handlePay}
        className="w-full bg-black text-white p-3 rounded mt-4"
      >
        Öde
      </button>

    </div>
  );
}
