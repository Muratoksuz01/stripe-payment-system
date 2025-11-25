
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./ui/Layout";
import Product from "./pages/Product";
import Category from "./pages/Category";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Favorite from "./pages/Favorite";
import Orders from "./pages/Orders";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";
import Landing from "./pages/Landing/Landing";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="product" element={<Product />} />
          <Route path="product/:id" element={<Product />} />
          <Route path="category/:id" element={<Category />} />
          <Route path="profile" element={<Profile />} />
          <Route path="cart" element={<Checkout />} />
          <Route path="favorite" element={<Favorite />} />
          <Route path="orders" element={<Orders />} />
          <Route path="success" element={<Success />} />
          <Route path="cancel" element={<Cancel />} />
          <Route path="*" element={<NotFound />} />
        
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
