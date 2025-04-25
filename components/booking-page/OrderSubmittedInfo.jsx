"use client";

import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import moment from "moment";
import { useEffect } from "react";
import { reservationInfoActions } from "@/store/store";
import * as Actions from "@/store/store";

const OrderSubmittedInfo = () => {
  const dispatch = useDispatch();

  const [cashFreePaymentVerifyQuery, options] =
    Actions.api.useLazyCashFreePaymentVerifyQuery();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { reservationNumber, customer_details } = orderDetails?.order || {};
  const { reservationResults } = orderDetails?.reservation || {};

  useEffect(() => {
    const data = localStorage.getItem("reservationConfirmation");
    if (data) {
      dispatch(Actions.orderDetailsActions.setReservation(JSON.parse(data)));
    }
  }, []);

  useEffect(() => {
    const data = localStorage.getItem("orderDetails");
    if (data) {
      const parsedData = JSON.parse(data);
      dispatch(Actions.orderDetailsActions.setOrderDetails(parsedData));
      cashFreePaymentVerifyQuery(parsedData?.order_id);
    }
  }, []);

  function renderMessage() {
    return false
      ? `, your reservation was submitted successfully!`
      : "Reservation details not found";
  }

  function renderPaymentSummary() {
    if (options.isLoading || !options.data) {
      return null;
    }
    const [paymentDetails] = options.data;
    const {
      cf_payment_id,
      order_amount,
      payment_group,
      payment_completion_time,
    } = paymentDetails;
    return (
      <div className="border-type-1 rounded-8 px-50 py-35 mt-40">
        <div className="row">
          <div className="col-lg-3 col-md-6">
            <div className="text-15 lh-2812">Payment ID</div>
            <div className="text-15 lh-12 fw-500 text-blue-1 mt-10">
              {cf_payment_id || "N/A"}
            </div>
          </div>
          {/* End .col */}
          <div className="col-lg-3 col-md-6">
            <div className="text-15 lh-12">Date</div>
            <div className="text-15 lh-12 fw-500 text-blue-1 mt-10">
              {payment_completion_time
                ? moment(payment_completion_time).format("ddd DD MMM YYYY")
                : "N/A"}
            </div>
          </div>
          {/* End .col */}
          <div className="col-lg-3 col-md-6">
            <div className="text-15 lh-12">Order amount</div>
            <div className="text-15 lh-12 fw-500 text-blue-1 mt-10">
              {order_amount
                ? new Intl.NumberFormat("en-IN", {
                    currency: "INR",
                    style: "currency",
                    currencyDisplay: "symbol",
                  }).format(order_amount)
                : "N/A"}
            </div>
          </div>
          {/* End .col */}
          <div className="col-lg-3 col-md-6">
            <div className="text-15 lh-12">Payment Method</div>
            <div className="text-15 lh-12 fw-500 text-blue-1 mt-10">
              {payment_group ?? "N/A "}
            </div>
          </div>
          {/* End .col */}
        </div>
      </div>
    );
  }

  const STATUS_COLOR_OPTIONS = {
    SUCCESS: "bg-success-1",
    PENDING: "bg-warning-1",
    FAILED: "bg-error-1",
  };

  return (
    <>
      <div className="col-xl-12 col-lg-8">
        <div className="order-completed-wrapper">
          <div className="d-flex flex-column items-center mt-40 lg:md-40 sm:mt-24">
            <div
              className={` size-80 flex-center rounded-full ${STATUS_COLOR_OPTIONS["SUCCESS"]} `}
            >
              <i className="icon-check text-30 text-white" />
            </div>
            <div className="text-26 lh-1 fw-600 mt-20">
              your reservation was submitted successfully!
            </div>
            <div className="text-15 text-light-1 mt-10">
              Booking details has been sent to:{" "}
              {customer_details?.customer_email}
            </div>
          </div>
          {/* End header */}

          {options.isLoading ? null : renderPaymentSummary()}

          <div className="border-light rounded-8 px-50 py-40 mt-40">
            <h4 className="text-20 fw-500 mb-30">Your Information</h4>
            <div className="row y-gap-10">
              <div className="col-12">
                <div className="d-flex justify-between ">
                  <div className="text-15 lh-16">Name</div>
                  <div className="text-15 lh-16 fw-500 text-blue-1">
                    {customer_details?.customer_name}
                  </div>
                </div>
              </div>
              {/* End .col */}
              {/* End .col */}
              <div className="col-12">
                <div className="d-flex justify-between border-top-light pt-10">
                  <div className="text-15 lh-16">Email</div>
                  <div className="text-15 lh-16 fw-500 text-blue-1">
                    {customer_details?.customer_email}
                  </div>
                </div>
              </div>
              {/* End .col */}
              <div className="col-12">
                <div className="d-flex justify-between border-top-light pt-10">
                  <div className="text-15 lh-16">Phone</div>
                  <div className="text-15 lh-16 fw-500 text-blue-1">
                    {customer_details?.customer_phone}
                  </div>
                </div>
              </div>
              {/* End .col */}
            </div>
            {/* End .row */}
          </div>
          {/* End order information */}
        </div>
      </div>
    </>
  );
};

export default OrderSubmittedInfo;
