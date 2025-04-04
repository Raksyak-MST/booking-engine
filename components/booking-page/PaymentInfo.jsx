
'use client'

import { useState } from "react";
import PricingSummary from "./sidebar/PricingSummary";
import PaymentSchedule from "./sidebar/PaymentSchedule";
import PromoCode from "./sidebar/PromoCode";
import RatingInfo from "./RatingInfo";
import { billingAction } from "@/store/store"
import { useSelector, useDispatch } from 'react-redux'

const PaymentInfo = () => {
  const [itemsTabs, setItemsTabs] = useState(1);
  const dispatch = useDispatch();
  const personalInfo = useSelector((state) => state.billing.personalInfo);
  const cardTabs = [
    { id: 1, name: "Credit/Debit Card" },
    // { id: 2, name: "Digital Payment" },
  ];

  const handleChange = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    dispatch(billingAction.setPersonalInfo({ ...personalInfo, [fieldName]: fieldValue}));
  }

  console.log(personalInfo)

  return (
    <>
      <div className="col-xl-7 col-lg-8">
        <RatingInfo />
        <div className="mt-40">
          <h3 className="text-22 fw-500 mb-20">How do you want to pay?</h3>
          <div className="row x-gap-20 y-gap-20 pt-20">
            <div className="col-12">
              <div className="form-input ">
                <input
                  type="text"
                  name="CCType"
                  required
                  value={personalInfo?.CCType}
                  onChange={handleChange}
                />
                <label className="lh-1 text-16 text-light-1">Card Type *</label>
              </div>
            </div>
            {/* End col */}

            <div className="col-md-6">
              <div className="form-input ">
                <input
                  type="text"
                  name="CardHoldersName"
                  required
                  value={personalInfo?.CardHoldersName}
                  onChange={handleChange}
                />
                <label className="lh-1 text-16 text-light-1">
                  Card holder name *
                </label>
              </div>

              <div className="form-input mt-20">
                <input
                  type="text"
                  name="CCNo"
                  required
                  value={personalInfo?.CCNo}
                  onChange={handleChange}
                />
                <label className="lh-1 text-16 text-light-1">
                  Credit/debit card number *
                </label>
              </div>

              <div className="row x-gap-20 y-gap-20 pt-20">
                <div className="col-md-6">
                  <div className="form-input ">
                    <input
                      type="text"
                      name="CCExpiryDate"
                      required
                      value={personalInfo?.CCExpiryDate}
                      onChange={handleChange}
                    />
                    <label className="lh-1 text-16 text-light-1">
                      Expiry date *
                    </label>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-input ">
                    <input
                      type="text"
                      name="CVC"
                      value={personalInfo?.CVC}
                      required
                      onChange={handleChange}
                    />
                    <label className="lh-1 text-16 text-light-1">
                      CVC/CVV *
                    </label>
                  </div>
                </div>
              </div>
              {/* End .row */}
            </div>
            {/* End col */}
            <div className="col-md-6">
              <img
                src="/img/booking-pages/card.png"
                alt="image"
                className="h-full"
              />
            </div>
            {/* End col */}
          </div>
        </div>
        {/* End mt-40 */}
        <div className="w-full h-1 bg-border mt-40 mb-40" />
        {/* End terms and conditons */}
      </div>
      {/* End payment details */}

      <div className="col-xl-5 col-lg-4">
        <div className="booking-sidebar">
          <PricingSummary />
          <PaymentSchedule />
          <PromoCode />
        </div>
      </div>
      {/* payment sidebar info */}
    </>
  );
};

export default PaymentInfo;
