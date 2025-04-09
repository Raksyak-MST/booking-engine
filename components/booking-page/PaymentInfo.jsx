
'use client'

import { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import PricingSummary from "./sidebar/PricingSummary";
import PaymentSchedule from "./sidebar/PaymentSchedule";
import RatingInfo from "./RatingInfo";
import { reservationInfoActions } from "@/store/store"
import { useSelector, useDispatch } from 'react-redux'
import { startCheckout } from "@/features/payment/CashFree.mjs"

const PaymentInfo = () => {
  const [itemsTabs, setItemsTabs] = useState(1);
  const dispatch = useDispatch();
  const cardTabs = [
    { id: 1, name: "Credit/Debit Card" },
    // { id: 2, name: "Digital Payment" },
  ];

  // useEffect(() => {
  //   dispatch(startCheckout());
  // }, []);

  const handleChange = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    dispatch(reservationInfoActions.setGuestDetails({[fieldName]: fieldValue}));
  }

  return (
    <>
      <div className="col-xl-7 col-lg-8">
        {/* <RatingInfo /> */}
        <div className="mt-40">
          <h3 className="text-22 fw-500 mb-20">How do you want to pay?</h3>
        </div>
        {/* End mt-40 */}
        <div className="w-full h-1 bg-border mt-40 mb-40" />
        {/* End terms and conditons */}
      </div>
      {/* End payment details */}

      <div className="col-xl-5 col-lg-4">
        <div className="booking-sidebar">
          <PricingSummary />
          {/* <PaymentSchedule /> */}
        </div>
      </div>
      {/* payment sidebar info */}
    </>
  );
};

export default PaymentInfo;
