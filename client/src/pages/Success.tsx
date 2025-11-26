
import { Link, useLocation, useNavigate } from "react-router-dom";
import { store } from "../lib/store";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Container from "../ui/Container";
import Loading from "../ui/Loading";
import axios from "axios";

const Success = () => {
  const { currentUser, cartProduct, resetCart } = store();
  const location = useLocation();
  const pi = new URLSearchParams(location.search).get("payment_intent");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!pi) {
      navigate("/");
    } else if (cartProduct.length > 0) {
      const saveOrder = async () => {
        try {
          setLoading(true);
        
          let items = cartProduct.map(item => ({
            _id:item._id,
            images:item.images,
            productName: item.name,
            quantity: item.quantity,
            unitPrice: item.discountedPrice ?? item.regularPrice,
            total: (item.quantity * (item.discountedPrice ?? item.regularPrice))
          }));

          await axios.post("http://localhost:8000/create-invoice", {

            "userName": `${currentUser?.firstName} ${currentUser?.lastName}`,
            "userEmail": `${currentUser?.email}`,
            "userAddress": "fake adresss",
            "invoiceNo": "fake INV-20251234",
            "items": items,
            paymentMethod: "stripe",
             paymentId: pi,
          }
          )

          toast.success("Payment accepted successfully & order saved!");
          resetCart();
        } catch (error) {
          console.log(error)
          toast.error("Error saving order data");
        } finally {
          setLoading(false);
          }
      };
      saveOrder();
    }
  }, [pi, navigate, currentUser, cartProduct]);

  return (
    <Container>
      {loading && <Loading />}
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-y-5">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          {loading
            ? "Your order payment is processing"
            : "Your Payment Accepted by supergear.com"}
        </h2>
        <p>
          {loading ? "Once done" : "Now"} you can view your Orders or continue
          Shopping with us
        </p>
        <div className="flex items-center gap-x-5">
          <Link to={"/orders"}>
            <button className="bg-black text-slate-100 w-52 h-12 rounded-full text-base font-semibold hover:bg-primeColor duration-300">
              View Orders
            </button>
          </Link>
          <Link to={"/"}>
            <button className="bg-black text-slate-100 w-52 h-12 rounded-full text-base font-semibold hover:bg-primeColor duration-300">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default Success;
/**
 *   useEffect(() => {
    if (!sessionId) {
      navigate("/");
    } else if (cartProduct.length > 0) {
      const saveOrder = async () => {
        try {
          setLoading(true);
          const orderRef = doc(db, "orders", currentUser?.email!);
          const docSnap = await getDoc(orderRef);
          if (docSnap.exists()) {
            // Document exists, update the orderItems array
            await updateDoc(orderRef, {
              orders: arrayUnion({
                userEmail: currentUser?.email,
                paymentId: sessionId,
                orderItems: cartProduct,
                paymentMethod: "stripe",
                userId: currentUser?.id,
              }),
            });
          } else {
            // Document doesn't exist, create a new one
            await setDoc(orderRef, {
              orders: [
                {
                  userEmail: currentUser?.email,
                  paymentId: sessionId,
                  orderItems: cartProduct,
                  paymentMethod: "stripe",
                },
              ],
            });
          }
          toast.success("Payment accepted successfully & order saved!");
          resetCart();
        } catch (error) {
          toast.error("Error saving order data");
        } finally {
          setLoading(false);
        }
      };
      saveOrder();
    }
  }, [sessionId, navigate, currentUser, cartProduct]);

 */