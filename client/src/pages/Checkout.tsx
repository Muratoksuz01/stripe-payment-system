import React, { useEffect, useState } from 'react'
import { store } from '../lib/store';
import Cart from './Cart';
import { Link } from 'react-router-dom';

function Checkout() {
  const { cartProduct, currentUser } = store();
  const [totalAmt, setTotalAmt] = useState({ regular: 0, discounted: 0 });
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
    <div className="grid grid-cols-3 gap-6 w-full p-4">

      {/* Sol taraf - Sepet */}
      <div className="col-span-2 space-y-6">
        <Cart />
      </div>

      {/* Sağ taraf - Sipariş Özeti + Ödeme */}
      <div className="col-span-1">

        {/* Özet kartı */}
        <div className="bg-white border rounded-lg p-4 shadow-sm sticky top-4 space-y-4">

          <div className="text-xl font-bold">Seçilen Ürünler ({cartProduct.length})</div>

          <div className="flex justify-between text-lg font-bold">
            <span>Toplam:</span>
            <span>{totalAmt.discounted} TL</span>
          </div>

          <div className="text-sm text-green-600">
            {totalAmt.regular - totalAmt.discounted} TL kazancın var
          </div>

        </div>
        <Link
          to="/odeme"
          className="block mt-6 w-full text-center bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          Alışverişi Tamamla
        </Link>
      </div>
    </div>

  )
}

export default Checkout