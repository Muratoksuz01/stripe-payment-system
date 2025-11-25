import { useEffect, useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { store } from "../lib/store";
import CartProduct from "../ui/CartProduct";
import CheckoutBtn from "../ui/CheckoutBtn";
import Container from "../ui/Container";
import FormattedPrice from "../ui/FormattedPrice";
import Product from "./Product";
import CheckoutForm1 from "../CheckoutForm1";


import { loadStripe } from "@stripe/stripe-js";
const Cart = () => {
  const { addToCart, decreaseQuantity, removeFromCart } = store()
  const [totalAmt, setTotalAmt] = useState({ regular: 0, discounted: 0 });
  const { cartProduct, currentUser } = store();
  const shippingAmt = 25;
  const taxAmt = 15;

  useEffect(() => {
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



  return (
    <div className="space-y-4">
      {cartProduct.map((product) => (
        <div
          key={product._id}
          className="bg-white border rounded-lg p-4 flex gap-4 shadow-sm"
        >
          <img
            src={product.images[0]}
            className="w-24 h-24 object-cover rounded"
          />

          <div className="flex flex-col justify-between flex-1">
            <div className="font-semibold">{product.name}</div>
            <div className="flex justify-between">

              <div className="flex items-center gap-3">
                <button className="px-3 py-1 border rounded" onClick={() => decreaseQuantity(product._id)}>-</button>
                <span>{product.quantity}</span>
                <button className="px-3 py-1 border rounded" onClick={() => addToCart(product)}>+</button>
                <button className="px-3 py-1 border rounded text-red-600" onClick={() => removeFromCart(product._id)}>🗑️</button>
              </div>

              <div className="flex items-center gap-2">
              <span className="text-gray-500 line-through">
                {product.regularPrice*product.quantity} TL
              </span>
              <span className="text-lg font-bold text-orange-600">
                {product.discountedPrice*product.quantity} TL
              </span>
            </div>
            </div>
          </div>
        </div>
      ))}
    </div>


  )


}
export default Cart;
