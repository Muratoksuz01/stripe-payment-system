import React, { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Toaster } from "react-hot-toast";
import { store } from "../lib/store";
import { Outlet, ScrollRestoration } from "react-router-dom";

const Layout = () => {
  const {getUserInfo} =store()
  useEffect(()=>{
    console.log("layout useeffect")
    getUserInfo()
  },[])
  return (
    <>
      {/* <ScrollRestoration /> */}
      <Header />
      <Outlet />
      {/* <Footer /> */}
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        toastOptions={{
          style: {
            backgroundColor: "black",
            color: "white",
          },
        }}
      />
    </>
  );
};

export default Layout;
