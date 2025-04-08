import {load} from '@cashfreepayments/cashfree-js';
import { createAsyncThunk } from "@reduxjs/toolkit";

let cashFree = null;
export const initializeSDK= async function () {          
    if (!cashFree) {
      cashFree = await load({
        mode: "sandbox",
      });
      console.info("CF SDK initialized")
      return cashFree
    }
};

export const getCashFree = () => {
  return cashFree;
}

export const startCheckout = createAsyncThunk('payment/checkout', async () => {
    // const res = await fetch("/api/payment/create-session", {
    //     method: "POST", 
    //     body: JSON.stringify({})
    // });

    // const {session_id: sessionId} = await res.json();
    const cashFree = getCashFree();
    console.info("CF SDK accessed: ", cashFree)

    if(!cashFree) throw new Error("CashFree SDK is not initialized");

    cashFree.checkout({
      paymentSessionId: sessionId,
      returnUrl: window.location.href,
    });
})