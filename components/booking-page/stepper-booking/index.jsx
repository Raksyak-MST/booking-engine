"use client";

import Link from "next/link";
import React from "react";
import BookingDetails from "../sidebar/BookingDetails";
import {
  useAddReservationFromWebMutation,
  useGetReservationJsonLikeEzeeWebBookingMutation,
  reservationInfoActions,
  cashFreeApiActions,
} from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { ERROR_MESSAGES } from "@/data/error-messages";
import { useFormik } from "formik";
import * as yup from "yup";

const Index = () => {
  const [addReservationFromWebMutation] = useAddReservationFromWebMutation();
  const [getReservationJsonLikeEzeeWebbooking] =
    useGetReservationJsonLikeEzeeWebBookingMutation();
  const [CFCreateOrder] = cashFreeApiActions.useCreateOrderMutation();
  const reservationInfo = useSelector((state) => state.reservationInfo);
  const billingReservationInfo = useSelector(
    (state) => state.billing?.reservationInfo
  );
  const dispatch = useDispatch();
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
    isValid: false,
    onSubmit: (values) => {
      dispatch(reservationInfoActions.setGuestDetails(values));

      toast.promise(
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
      );
    },
    validationSchema: yup.object().shape({
      Salutation: yup.string().required("Salutation is required"),
      FirstName: yup.string().required("First Name is required"),
      LastName: yup.string().required("Last Name is required"),
      Email: yup.string().email("Invalid email").required("Email is required"),
      Mobile: yup.string().required("Mobile is required"),
    }),
  });

  const handleOnClick = (e) => {
    if (formik.isValid) {
      toast.promise(
        CFCreateOrder({
          order_amount: 1.0,
          order_currency: "INR",
          customer_details: {
            customer_id: "1234567890",
            customer_name: formik.values.FirstName,
            customer_email: formik.values.Email,
            customer_phone: formik.values.Mobile,
          },
        })
          .unwrap()
          .then((res) => {
            alert(JSON.stringify(res));
            try {
              addReservationFromWebMutation(billingReservationInfo);
            } catch (error) {
              toast.error(
                "Failed to book reservation. Please try again later."
              );
            }
          }),
        {
          loading: "Loading...",
          success: "You are being redirected to payment page",
          error: "Failed to proceed.",
        }
      );
    } else {
      toast.error("Please fill your details before payment");
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-xl-7 col-lg-8 mt-30">
          <div className="py-15 px-20 rounded-4 text-15 bg-blue-1-05">
            Sign in to book with your saved details or{" "}
            <Link href="/signup" className="text-blue-1 fw-500">
              register
            </Link>{" "}
            to manage your bookings on the go!
          </div>
          {/* End register notify */}

          <h2 className="text-22 fw-500 mt-40 md:mt-24">
            Let us know who you are
          </h2>

          <form className="row x-gap-20 y-gap-20 pt-20">
            <div className="col-md-2">
              <select
                className="form-select h-full text-light-1"
                name="Salutation"
                values={formik?.values?.Salutation}
                onChange={formik?.handleChange}
              >
                {[
                  { id: 1, value: "Mr", label: "Mr." },
                  { id: 2, value: "Mrs", label: "Mrs." },
                  { id: 3, value: "Ms", label: "Ms." },
                  { id: 4, value: "Dr", label: "Dr." },
                  { id: 5, value: "Mast.", label: "Mast.." },
                  { id: 6, value: "Prof", label: "Prof." },
                  { id: 7, value: "Capt", label: "Capt." },
                  { id: 8, value: "Wg Cdr.", label: "Wg Cdr." },
                  { id: 9, value: "Major.", label: "Major." },
                  { id: 10, value: "Brig", label: "Brig." },
                  { id: 11, value: "Col.", label: "Col." },
                  { id: 12, value: "Lt Col", label: "Lt Col" },
                  { id: 13, value: "Lt", label: "Lt." },
                  { id: 14, value: "Maj Gen.", label: "Maj Gen" },
                ].map((obj) => (
                  <option key={obj?.id} value={obj?.value}>
                    {obj?.label}
                  </option>
                ))}
              </select>
            </div>
            {/* End col-12 */}

            <div className="col-md-5">
              <div className="form-input ">
                <input
                  type="text"
                  name="FirstName"
                  value={formik?.values?.FirstName}
                  onChange={formik?.handleChange}
                  required
                />
                <label className="lh-1 text-16 text-light-1">First name</label>
              </div>
              <div className="text-13 text-red-1">
                {formik?.touched?.FirstName &&
                  formik?.errors?.FirstName}
              </div>
            </div>
            {/* End col-12 */}

            <div className="col-md-5">
              <div className="form-input input-group has-validation">
                <input
                  type="text"
                  name="LastName"
                  value={formik?.values?.LastName}
                  onChange={formik?.handleChange}
                  required
                />
                <label className="lh-1 text-16 text-light-1">Last name</label>
              </div>
              <div className="text-13 text-red-1">
                {formik?.touched?.LastName && formik?.errors?.LastName}
              </div>
            </div>
            {/* End col-12 */}

            <div className="col-md-12">
              <div className="form-input ">
                <input
                  type="text"
                  name="Email"
                  value={formik?.values?.Email}
                  onChange={formik?.handleChange}
                  required
                />
                <label className="lh-1 text-16 text-light-1">Email</label>
              </div>
              <div className="text-13 text-red-1">
                {formik?.errors?.Email}
              </div>
            </div>
            {/* End col-12 */}

            <div className="col-md-12">
              <div className="form-input ">
                <input
                  type="text"
                  name="Mobile"
                  value={formik?.values?.Mobile}
                  onChange={formik?.handleChange}
                  required
                />
                <label className="lh-1 text-16 text-light-1">Mobile</label>
              </div>
              <div className="text-13 text-red-1">
                {formik?.errors?.Mobile}
              </div>
            </div>
            {/* End col-12 */}

            <div className="col-12">
              <div className="form-input ">
                <input
                  name="Address"
                  type="text"
                  required
                  value={formik?.values?.Address}
                  onChange={formik?.handleChange}
                />
                <label className="lh-1 text-16 text-light-1">
                  Address line 1
                </label>
              </div>
              <div className="text-13 text-red-1">
                {formik?.errors?.Address}
              </div>
            </div>
            {/* End col-12 */}

            <div className="col-md-06">
              <div className="form-input ">
                <input
                  type="text"
                  name="Country"
                  required
                  value={formik?.values?.Country}
                  onChange={formik?.handleChange}
                />
                <label className="lh-1 text-16 text-light-1">Country</label>
              </div>
              <div className="text-13 text-red-1">
                {formik?.errors?.Country}
              </div>
            </div>
            {/* End col-12 */}

            <div className="col-md-6">
              <div className="form-input ">
                <input
                  name="State"
                  type="text"
                  required
                  value={formik?.values?.State}
                  onChange={formik?.handleChange}
                />
                <label className="lh-1 text-16 text-light-1">
                  State/Province/Region
                </label>
              </div>
              <div className="text-13 text-red-1">
                {formik?.errors?.State}
              </div>
            </div>
            {/* End col-12 */}

            <div className="col-md-6">
              <div className="form-input ">
                <input
                  name="Zipcode"
                  type="text"
                  required
                  value={formik?.values?.Zipcode}
                  onChange={formik?.handleChange}
                />
                <label className="lh-1 text-16 text-light-1">
                  ZIP code/Postal code
                </label>
              </div>
              <div className="text-13 text-red-1">
                {formik?.errors?.Zipcode}
              </div>
            </div>
            {/* End col-12 */}

            <div className="col-12">
              <div className="form-input ">
                <textarea
                  name="Comment"
                  required
                  rows={6}
                  value={formik?.values?.Comment}
                  onChange={formik?.handleChange}
                ></textarea>
                <label className="lh-1 text-16 text-light-1">
                  Special Requests
                </label>
              </div>
            </div>
            {/* End col-12 */}

            <div className="col-12">
              <div className="row y-gap-20 items-center justify-between">
                <div className="col-auto">
                  <div className="text-14 text-light-1">
                    By proceeding with this booking, I agree to Oterra Terms of
                    Use and Privacy Policy.
                  </div>
                </div>
                {/* End col-12 */}
              </div>
            </div>
          </form>
        </div>
        <div className="col-xl-5 col-lg-4 mt-30">
          <div className="booking-sidebar">
            <BookingDetails />
          </div>
        </div>
      </div>
      {/* End main content */}
      <div className="row x-gap-20 y-gap-20 pt-20">
        <div className="col-auto">
          <button
            className="button h-60 px-24 -dark-1 bg-blue-1 text-white"
            onClick={formik.handleSubmit}
            type="submit"
          >
            Book Now
          </button>
        </div>
        {/* End next btn */}
      </div>
      {/* End stepper button */}
    </>
  );
};

export default Index;
