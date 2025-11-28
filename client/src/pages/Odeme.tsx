import React, { useEffect, useState } from "react";
import { store } from "../lib/store";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { API_PATH } from "../lib/API_PATH";
import Loading from "../ui/Loading";


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function Odeme() {
    const [CardError, setCardError] = useState("")
    const [totalAmt, setTotalAmt] = useState({ regular: 0, discounted: 0 });
    const [cartnumber, setCartnumber] = useState(false)
    const [csv, setCsv] = useState(false)
    const [loading, setLoading] = useState(false)
    const [cartDate, setCartDate] = useState(false)
    let cargoPrice = totalAmt.discounted > 1000 ? 0 : 50
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    // store içindeki doğru key hangisiyse onu kullan
    const { cartProduct } = store();

    useEffect(() => {
        if (!cartProduct || cartProduct.length === 0) {
            navigate("/cart");
            return
        }
        const totals = cartProduct.reduce(
            (sum, product) => {
                sum.regular += product?.regularPrice * product?.quantity;
                sum.discounted += product?.discountedPrice * product?.quantity;
                return sum;
            },
            { regular: 0, discounted: 0 }
        );
        setTotalAmt(totals);
    }, [cartProduct]);

   
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
        // console.log("tıklandı ")
        e.preventDefault();
        console.log("first")
        if (!stripe || !elements) return;
        setLoading(true)
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
        const res = await axios.post(API_PATH.createPaymentIntent, 
            { paymentMethodId: paymentMethod.id, totalAmt: totalAmt.discounted },)
        let data = res.data
        console.log(data);
        // redirect başlat
        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
            data.client_secret,
        );

        console.log("odeme sonrasi paymentInstance", paymentIntent)
        if (paymentIntent && paymentIntent.status === "succeeded") {
            setLoading(false)
            window.location.href = `/success?payment_intent=${paymentIntent.id}`;
        };
        if (confirmError) console.log(confirmError);
        setLoading(false)
    }
    return (
        
        <div className="w-full flex justify-center py-10">
            <div className="w-full max-w-6xl px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* SOL TARAF: Adres + Kart Bilgileri */}
                <div className="lg:col-span-2 flex flex-col gap-8">

                    {/* Adres bilgileri */}
                    <div className="border border-gray-300 rounded-md p-6 min-h-[200px]">
                        <h2 className="text-xl font-semibold mb-4">Adres Bilgileri</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Ad</label>
                                <input
                                    type="text"
                                    placeholder="Adınız"
                                    className="w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Soyad</label>
                                <input
                                    type="text"
                                    placeholder="Soyadınız"
                                    className="w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Şehir</label>
                                <input
                                    type="text"
                                    placeholder="Şehir"
                                    className="w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">İlçe</label>
                                <input
                                    type="text"
                                    placeholder="İlçe"
                                    className="w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1">Adres</label>
                                <textarea
                                    placeholder="Sokak, Mahalle, Cadde..."
                                    className="w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                        </div>
                    </div>


                    {/* Kart bilgileri */}
                    <div className="border border-red-700 rounded-md p-6 min-h-[250px]">
                        <h2 className="text-xl font-semibold mb-4">Kart Bilgileri</h2>
                        {CardError && <p className="text-red-600">{CardError}</p>}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-700">Kart Numarası
                                <span className="cursor-pointer" onClick={() => { navigator.clipboard.writeText("4242424242424242"); }}>4242424242424242</span>
                            </label>
                            <div className="border rounded-md p-3 bg-white shadow-inner">
                                <CardNumberElement
                                    onChange={(e: any) => {
                                        setCartnumber(e.complete);
                                        setCardError(e.error ? e.error.message : null);
                                    }}
                                    options={{ style: baseStyle }} />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                                <label className="text-sm text-gray-700">Son Kullanma</label>
                                <div className="border rounded-md p-3 bg-white shadow-inner">
                                    <CardExpiryElement
                                        onChange={(e: any) => {
                                            setCartDate(e.complete);
                                            setCardError(e.error ? e.error.message : null);
                                        }}
                                        options={{ style: baseStyle }} />
                                </div>
                            </div>

                            <div className="flex-1 space-y-2">
                                <label className="text-sm text-gray-700">CVC</label>
                                <div className="border rounded-md p-3 bg-white shadow-inner">
                                    <CardCvcElement
                                        onChange={(e: any) => {
                                            setCsv(e.complete);
                                            setCardError(e.error ? e.error.message : null);
                                        }}
                                        options={{ style: baseStyle }} />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* SAG TARAF: Ödeme özeti */}
                <div className="border border-red-700 rounded-md p-6 h-fit">
                    <h2 className="text-xl font-semibold mb-4">Ödeme Özeti</h2>

                    {/* ödeme bilgiler */}
                    <div className="mb-6 space-y-2">
                        <p>Ürün toplam: {totalAmt.discounted}</p>
                        <p>Kargo: {cargoPrice}</p>
                        <p className="font-semibold">Genel toplam: {totalAmt.discounted + cargoPrice}</p>
                    </div>

                    {/* ödeme btn */}
                    <button
                        disabled={!(cartnumber && csv && cartDate)}
                        onClick={handleSubmit}
                        className="w-full py-3 rounded-md text-lg 
                            bg-red-600 text-white 
                            hover:bg-red-700 
                            disabled:bg-red-300 disabled:cursor-not-allowed disabled:hover:bg-red-300
                            transition"
                    >
                        Ödeme Yap
                    </button>

                </div>

            </div>
            {loading && <Loading />}
        </div>

    );
}


function OdemeWrapper() {
    return (
        <Elements stripe={stripePromise}>
            <Odeme />
        </Elements>
    );
}
export default OdemeWrapper