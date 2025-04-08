
'use client'

import React, { useState } from "react";
import CustomerInfo from "../CustomerInfo";
import PaymentInfo from "../PaymentInfo";
import OrderSubmittedInfo from "../OrderSubmittedInfo";
import {
  useAddReservationFromWebMutation,
  useGetReservationJsonLikeEzeeWebBookingMutation,
  billingAction,
  reservationInfoActions,
} from "@/store/store";
import { useDispatch, useSelector } from "react-redux"
import toast from "react-hot-toast";
import { startCheckout } from "@/features/payment/CashFree.mjs"
import { ERROR_MESSAGES } from "@/data/error-messages";
import { useFormik } from "formik"
import * as yup from "yup";

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [ addReservationFromWebMutation ] = useAddReservationFromWebMutation()
  const [ getReservationJsonLikeEzeeWebbooking, options ] = useGetReservationJsonLikeEzeeWebBookingMutation() 
  const reservationInfo = useSelector(state => state.reservationInfo)
  const reservationsInfo = useSelector(state => state.billing?.reservationInfo)
  const billingInfo = useSelector(state => state.billing)
  const dispatch = useDispatch()
  const formik = useFormik({
    initialValues: {
      Salutation: "",
      FirstName: "",
      LastName: "",
      Email: "",
      Mobile: "",
      Address: "",
      City: "",
      State: "",
      Zipcode: "",
      Country: "",
      Comment: "",
    },
    onSubmit: (values) => {
      dispatch(reservationInfoActions.setGuestDetails(values))

      // NOTE: .unwrap() is mandatory to catch errors
      toast
        .promise(
          getReservationJsonLikeEzeeWebbooking(reservationInfo).unwrap(),
          {
            loading: "Loading...",
            success: "Your information is saved successfully.",
            error: ERROR_MESSAGES.API_FAILED_RESERVATIONS_LIKE_WEB_BOOKING,
          }
        )
        .then(() => {
          if ( currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
            dispatch(startCheckout())
          }
        });

    },
    validationSchema: yup.object().shape({
      // Salutation: yup.string().required("Salutation is required"),
      FirstName: yup.string().required("First Name is required"),
      LastName: yup.string().required("Last Name is required"),
      // Gender: yup.string().required("Gender is required"),
      // DateOfBirth: yup.string().required("Date of Birth is required"),
      // SpouseDateOfBirth: yup.string().required("Spouse Date of Birth is required"),
      // WeddingAnniversary: yup.string().required("Wedding Anniversary is required"),
      // Password: yup.string().required("Password is required"),
      // Address: yup.string().required("Address is required"),
      // City: yup.string().required("City is required"),
      // State: yup.string().required("State is required"),
      // Country: yup.string().required("Country is required"),
      // Nationality: yup.string().required("Nationality is required"),
      // Zipcode: yup.string().required("Zipcode is required"),
      // Phone: yup.string().required("Phone is required"),
      // Mobile: yup.string().required("Mobile is required"),
      // Fax: yup.string().required("Fax is required"),
      // Email: yup.string().email().required("Email is required"),
      // PromoCode: yup.string().required("Promo Code is required"),
      // Comment: yup.string().required("Comment is required"),
      // companyID: yup.string().required("Company ID is required"),
    }),
  });

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
      content: <CustomerInfo controller={formik}/>,
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

    dispatch(startCheckout())

    if (billingInfo?.hasError === false) {
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
        {currentStep !== 1 ? null : (
          <div className="col-auto">
            <button
              className="button h-60 px-24 -blue-1 bg-light-2"
              disabled={currentStep === 0}
              onClick={previousStep}
            >
              Previous
            </button>
          </div>
        )}
        {/* End prvious btn */}

        <div className="col-auto">
          <button
            className="button h-60 px-24 -dark-1 bg-blue-1 text-white"
            disabled={currentStep === steps.length - 1}
            onClick={formik.handleSubmit}
            type="submit"
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
