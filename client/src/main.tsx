import ReactDOM from "react-dom/client";
import {
  Outlet,
  RouterProvider,
  ScrollRestoration,
  createBrowserRouter,
} from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import Cancel from "./pages/Cancel.tsx";
import Cart from "./pages/Cart.tsx";
import Category from "./pages/Category.tsx";
import Favorite from "./pages/Favorite.tsx";
import NotFound from "./pages/NotFound.tsx";
import Orders from "./pages/Orders.tsx";
import Product from "./pages/Product.tsx";
import Profile from "./pages/Profile.tsx";
import Success from "./pages/Success.tsx";
import Layout from "./ui/Layout.tsx";

const RouterLayout = () => {
  return (
    <Layout>
      <ScrollRestoration />
      <Outlet />
    </Layout>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RouterLayout />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/product",
        element: <Product />,
      },
      {
        path: "/product/:id",
        element: <Product />,
      },
      {
        path: "/category",
        element: <Category />,
      },
      {
        path: "/category/:id",
        element: <Category />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/favorite",
        element: <Favorite />,
      },
      {
        path: "/orders",
        element: <Orders />,
      },
      {
        path: "/success",
        element: <Success />,
      },
      {
        path: "/cancel",
        element: <Cancel />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
/**
 * lib/firebase.ts add this code to there
  // Import the functions you need from the SDKs you need
 import { initializeApp } from "firebase/app";
 import { getAuth } from "firebase/auth";
 import { getFirestore } from "firebase/firestore";
 import { getStorage } from "firebase/storage";
 import { getAnalytics } from "firebase/analytics";
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries
 
 // Your web app's Firebase configuration
 const firebaseConfig = {
   apiKey: "AIzaS8AOzA1Q",
   authDomain: "paymenseapp.com",
   projectId: "paym08b9",
   storageBucket: "paymasestorage.app",
   messagingSenderId: "174992",
   appId: "1:17e446d",
   measurementId: "GKL"
 };
 // Initialize Firebase
 const app = initializeApp(firebaseConfig)
 export const auth = getAuth();
 const analytics = getAnalytics(app);
 export const db = getFirestore();
 export const storage = getStorage();
 
 */