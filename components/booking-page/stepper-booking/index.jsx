
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
  cashFreeApiActions,
} from "@/store/store";
import { useDispatch, useSelector } from "react-redux"
import toast from "react-hot-toast";
import { ERROR_MESSAGES } from "@/data/error-messages";
import { useFormik } from "formik"
import * as yup from "yup";

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [ addReservationFromWebMutation ] = useAddReservationFromWebMutation()
  const [ getReservationJsonLikeEzeeWebbooking, options ] = useGetReservationJsonLikeEzeeWebBookingMutation() 
  const reservationInfo = useSelector(state => state.reservationInfo)
  const billingReservationInfo = useSelector(state => state.billing?.reservationInfo)
  const billingInfo = useSelector(state => state.billing)
  const [ CFCreateOrder ] = cashFreeApiActions.useCreateOrderMutation()
  const dispatch = useDispatch()
  const formik = useFormik({
    initialValues: {
      Salutation: "Mr",
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
      PromoCode: "",
    },
    onSubmit: (values) => {
      dispatch(reservationInfoActions.setGuestDetails(values));

      switch (currentStep) {
        case 0:
          toast
            .promise(
              // NOTE: .unwrap() is mandatory to catch errors in toast otherwise it will not work
              // cannot update state in async function because it will cause a race condition
              getReservationJsonLikeEzeeWebbooking({
                ...reservationInfo,
                guestDetails: { ...values },
              }).unwrap(),
              {
                loading: "Loading...",
                success: "Your information is saved successfully.",
                error: ERROR_MESSAGES.API_FAILED_RESERVATIONS_LIKE_WEB_BOOKING,
              }
            )
            .then(() => {
              if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1);
              }
            });
          break;
        case 1:
          try {
            addReservationFromWebMutation(billingReservationInfo);
          } catch (error) {
            toast.error("Failed to book reservation. Please try again later.");
          }
      }
    },
    validationSchema: yup.object().shape({
      Salutation: yup.string().required("Salutation is required"),
      FirstName: yup.string().required("First Name is required"),
      LastName: yup.string().required("Last Name is required"),
      Email: yup.string().email("Invalid email").required("Email is required"),
      Mobile: yup.string().required("Mobile is required"),
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

    if (billingInfo?.hasError === false) {
    }

    // FIXME: This is a temporary to test the creation of the reservation
    if (currentStep === 1) {
      await addReservationFromWebMutation(billingReservationInfo);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <>
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
            onClick={(e) => {
              formik.handleSubmit(e);
            }}
            type="submit"
          >
            Save
          </button>
        </div>
        <div className="col-auto">
          <button
            className="button h-60 px-24 -dark-1 bg-blue-1 text-white"
            disabled={currentStep === steps.length - 1}
            onClick={(e) => {
              if (formik.isValid) {
                CFCreateOrder({
                  order_amount: 1.0,
                  order_currency: "INR",
                  customer_details: {
                    customer_id: "1234567890",
                    customer_phone: formik.values.Mobile,
                  },
                }).unwrap().then(res => {
                  alert(JSON.stringify(res))
                });
              } else {
                toast.error("Please fill your details before payment");
              }
            }}
            type="submit"
          >
            Pay Now
          </button>
        </div>
        {/* End next btn */}
      </div>
      {/* End stepper button */}
    </>
  );
};

export default Index;
