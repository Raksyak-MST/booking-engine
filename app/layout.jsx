"use client";

import Aos from "aos";
import { useEffect } from "react";
import SrollTop from "../components/common/ScrollTop";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "swiper/css/effect-cards";
import "aos/dist/aos.css";
import "../styles/index.scss";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { Toaster } from 'react-hot-toast'
import { initializeSDK } from "@/features/payment/CashFree.mjs"

if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
}

export default function RootLayout({ children }) {
  useEffect(() => {
    initializeSDK()
  }, [])
  useEffect(() => {
    Aos.init({
      duration: 1200,
      once: true,
    });
  }, []);
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="./favicon.ico" />
        <script src="https://sdk.cashfree.com/js/v3/cashfree.js" crossOrigin="anonymous"></script>
      </head>
      <body>
        <main>
          <Provider store={store}>
            {children}
            <SrollTop />
            <Toaster />
          </Provider>
        </main>
      </body>
    </html>
  );
}
