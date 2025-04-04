
'use client'

import React, { useState } from "react";
import CustomerInfo from "../CustomerInfo";
import PaymentInfo from "../PaymentInfo";
import OrderSubmittedInfo from "../OrderSubmittedInfo";
import { useAddReservationFromWebMutation, useGetReservationJsonLikeEzeeWebBookingMutation } from "@/store/store"
import { useDispatch, useSelector } from "react-redux"
import { billingAction } from "@/store/store"
import toast from "react-hot-toast";
import { ERROR_MESSAGES } from "@/data/error-messages";


const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [ addReservationFromWebMutation ] = useAddReservationFromWebMutation()
  const [ getReservationJsonLikeEzeeWebbooking, options ] = useGetReservationJsonLikeEzeeWebBookingMutation() 
  const reservationInfo = useSelector(state => state.reservationInfo)
  const reservationsInfo = useSelector(state => state.billing?.reservationInfo)
  const billingInfo = useSelector(state => state.billing)
  const dispatch = useDispatch()

  const steps = [
    {
      title: "Personal Details",
      stepNo: "1",
      stepBar: (
        <>
          <div className="col d-none d-sm-block">
            <div className="w-full h-1 bg-border"></div>
          </div>
        </>
      ),
      content: <CustomerInfo />,
    },
    {
      title: "Payment Details",
      stepNo: "2",
      stepBar: (
        <>
          <div className="col d-none d-sm-block">
            <div className="w-full h-1 bg-border"></div>
          </div>
        </>
      ),
      content: <PaymentInfo />,
    },
    {
      title: "Final Step",
      stepNo: "3",
      stepBar: "",
      content: <OrderSubmittedInfo />,
    },
  ];

  const renderStep = () => {
    const { content } = steps[currentStep];
    return <>{content}</>;
  };

  const nextStep = async () => {
    dispatch(billingAction.validateForm());

    if (billingInfo?.hasError) {
      toast.error("Please fill in all the required fields.");
      return;
    }

    if (billingInfo?.hasError === false) {
      toast
        .promise(getReservationJsonLikeEzeeWebbooking(reservationInfo), {
          loading: "Loading...",
          success: "Your information is saved successfully.",
          error: ERROR_MESSAGES.API_FAILED_RESERVATIONS_LIKE_WEB_BOOKING,
        })
        .then(() => {
          if (
            currentStep < steps.length - 1 &&
            billingInfo?.hasError == false
          ) {
            setCurrentStep(currentStep + 1);
          }
        });
    }

    // FIXME: This is a temporary to test the creation of the reservation
    if (currentStep === 1) {
      await addReservationFromWebMutation(reservationsInfo);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <>
      <div className="row x-gap-40 y-gap-30 items-center">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="col-auto">
              <div
                className="d-flex items-center cursor-pointer transition"
                onClick={() => setCurrentStep(index)}
              >
                <div
                  className={
                    currentStep === index
                      ? "active size-40 rounded-full flex-center bg-blue-1"
                      : "size-40 rounded-full flex-center bg-blue-1-05 text-blue-1 fw-500"
                  }
                >
                  {currentStep === index ? (
                    <>
                      <i className="icon-check text-16 text-white"></i>
                    </>
                  ) : (
                    <>
                      <span>{step.stepNo}</span>
                    </>
                  )}
                </div>

                <div className="text-18 fw-500 ml-10"> {step.title}</div>
              </div>
            </div>
            {/* End .col */}

            {step.stepBar}
          </React.Fragment>
        ))}
      </div>
      {/* End stepper header part */}

      <div className="row">{renderStep()}</div>
      {/* End main content */}

      <div className="row x-gap-20 y-gap-20 pt-20">
        <div className="col-auto">
          <button
            className="button h-60 px-24 -blue-1 bg-light-2"
            disabled={currentStep === 0}
            onClick={previousStep}
          >
            Previous
          </button>
        </div>
        {/* End prvious btn */}

        <div className="col-auto">
          <button
            className="button h-60 px-24 -dark-1 bg-blue-1 text-white"
            disabled={currentStep === steps.length - 1}
            onClick={nextStep}
          >
            Next <div className="icon-arrow-top-right ml-15" />
          </button>
        </div>
        {/* End next btn */}
      </div>
      {/* End stepper button */}
    </>
  );
};

export default Index;
