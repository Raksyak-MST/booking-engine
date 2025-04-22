"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import BookingDetails from "../sidebar/BookingDetails";
import {
  useAddReservationFromWebMutation,
  useGetReservationJsonLikeEzeeWebBookingMutation,
  reservationInfoActions,
  cashFreeApiActions,
  roomSelectionActions,
} from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { ERROR_MESSAGES } from "@/data/error-messages";
import { useFormik, FormikProvider, ErrorMessage, Field } from "formik";
import * as yup from "yup";
import { useRouter } from "next/navigation";

const Index = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [addReservationFromWebMutation] = useAddReservationFromWebMutation();
  const [getReservationJsonLikeEzeeWebbooking, options] =
    useGetReservationJsonLikeEzeeWebBookingMutation();
  const [CFCreateOrder] = cashFreeApiActions.useCreateOrderMutation();
  const reservationInfo = useSelector((state) => state.reservationInfo);

  const pickedPackageId = useSelector(
    (state) => state?.bookingQuery?.selectedPackageID,
  );
  const roomSelection = useSelector((state) => state?.roomSelection);
  const pickedPackage = roomSelection?.perNightCharges?.filter(
    (pack) => pack?.packageID === parseInt(pickedPackageId),
  );

  const roomPicked = useSelector((state) => state.roomPick?.roomPicked);

  const rates = !pickedPackage?.length ? {} : pickedPackage[0];
  const room = !rates?.rooms?.length ? {} : rates.rooms[0];

  useEffect(() => {
    const data = sessionStorage.getItem("roomSelection");
    if (data) {
      // FIXME: Not able to handle this in store.js as it was not defined at server rendering.
      // did it here because localStorage is not define at the store.js (preloadedState property)
      dispatch(roomSelectionActions.setRoomSelection(JSON.parse(data)));
    }
  }, []);

  useEffect(() => {
    const data = sessionStorage.getItem("guestDetails");
    if (data) {
      dispatch(reservationInfoActions.setGuestDetails(JSON.parse(data)));
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      guestDetails: [],
    },
    enableReinitialize: true,
    isValid: false,
    onSubmit: async (values) => {
      console.log(values.guestDetails);
      dispatch(reservationInfoActions.setGuestDetails(values.guestDetails));

      // try {
      //   const response = await getReservationJsonLikeEzeeWebbooking({
      //     ...reservationInfo,
      //     guestDetails: { ...values },
      //   }).unwrap();
      //   if (response?.statusCode !== 200) {
      //     toast.error("Error while getting reservation like Ezee");
      //     return;
      //   }
      //   if (!response?.data) {
      //     toast.error(
      //       "Not able to get reservation details. Please try after some time.",
      //     );
      //     return;
      //   }
      //   if (!Object.hasOwn(response?.data, "Reservations")) {
      //     toast.error("Not able to get the Reservations property in response");
      //     return;
      //   }
      //   const orderDetails = {
      //     order_amount: room?.TotalAmountAfterTax,
      //     order_currency: "INR",
      //     customer_details: {
      //       customer_id: "1",
      //       customer_phone: "8765432190",
      //       customer_email: "testuser@gmail.com",
      //       customer_name: "test user",
      //     },
      //   };
      //   const { error } = await createOrder(orderDetails, response?.data);

      //   if (error) {
      //     return;
      //   }

      //   toast.success(
      //     "Reservation is being processed. Please wait for confirmation.",
      //   );
      // } catch (error) {
      //   toast.error(error?.message);
      //   console.error(error?.message, error);
      // }
    },
    validationSchema: yup.object().shape({
      Salutation: yup.string().required("Salutation is required"),
      FirstName: yup.string().required("First Name is required"),
      LastName: yup.string().required("Last Name is required"),
      Email: yup.string().email("Invalid email").required("Email is required"),
      Mobile: yup.string().required("Mobile is required"),
      guestDetails: yup.array().of(yup.object().shape({})),
    }),
  });

  const createOrder = async (orderDetails, ezeeFormattedReservationDetails) => {
    try {
      // TODO: Api call from server to fetch payment session id
      const response = await CFCreateOrder(orderDetails);

      if (response?.error) {
        console.error("Error creating Cashfree order:", response.error);
        return;
      }

      console.info("CF Order created.");

      if (!response?.data?.payment_session_id) {
        console.error("Payment session id is missing from response");
        toast.error("Error creating CF order. Please try after some time.");
        return;
      }

      const data = response?.data;
      console.info("Cashfree created order response : ", data);
      const cashFree = Cashfree({ mode: "sendbox" });

      const checkoutResponse = await cashFree.checkout({
        mode: "sandbox",
        paymentSessionId: data?.payment_session_id,
        redirectTarget: "_modal",
      });

      if (checkoutResponse?.error) {
        toast.error(checkoutResponse?.error?.message);
      }

      console.info("Checkout response : ", checkoutResponse);

      if (checkoutResponse?.error) {
        // user has closed the payment modal
        console.error(checkoutResponse?.error?.message);
        return { error: checkoutResponse?.error }; // skip adding reservation if user close the modal
      }

      // TODO: Add reservation
      const addReservationResponse = await addReservationFromWebMutation(
        ezeeFormattedReservationDetails,
      );

      if (addReservationResponse?.error) {
        toast.error("Error adding reservation. Please try after some time.");
        console.error(addReservationResponse?.error);
      }

      router.push("/order-submitted");
      return { checkoutResponse };
    } catch (error) {
      console.error("Error creating Cashfree order:", error);
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

          <div className="mt-40 mb-40 md:mb-24">
            <h2 className="text-24 fw-500 ">Let us know who you are</h2>
            <p className="text-14">
              Please tell us the name of the guest staying at the hotel as it
              appears on the ID that they’ll present at check-in.
            </p>
          </div>
          <FormikProvider value={formik} key={room?.id}>
            <div className="p-4 border rounded">
              {Object.entries(roomPicked).map(([key, room], index) => (
                <div key={index}>
                  <div className="d-flex gap-2 align-items-center">
                    <h2 className="text-16 fw-500 ">{room?.roomTypeName}</h2>
                    <p>
                      {room?.adults} adults, {room?.children} children
                    </p>
                  </div>
                  <form className="row x-gap-20 y-gap-20 pt-20 mb-24">
                    <div className="col-md-3">
                      <select
                        className="form-select dropdown__button d-flex items-center rounded-4 border-light px-15 h-100 text-14"
                        name={`guestDetails.${index}.Salutation`}
                        values={formik?.values?.Salutation}
                        onChange={formik?.handleChange}
                        onBlur={formik?.handleBlur}
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
                      <div className="form-input">
                        <Field
                          name={`guestDetails.${index}.FirstName`}
                          required
                        />
                        <label className="lh-1 text-16 text-light-1">
                          First name
                        </label>
                      </div>
                      <ErrorMessage
                        component="span"
                        className="text-13 text-red-1"
                        name={`guestDetails.${index}.FirstName`}
                      />
                    </div>
                    {/* End col-12 */}
                    <div className="col-md-4">
                      <div className="form-input input-group has-validation">
                        <Field
                          name={`guestDetails.${index}.LastName`}
                          required
                        />
                        <label className="lh-1 text-16 text-light-1">
                          Last name
                        </label>
                      </div>
                      <ErrorMessage
                        component="span"
                        className="text-13 text-red-1"
                        name={`guestDetails.${index}.LastName`}
                      />
                    </div>
                  </form>
                </div>
              ))}
            </div>
            <h3 className="text-24 fw-500 pt-40">Your details</h3>
            <form className="row x-gap-20 y-gap-20 pt-20">
              <div className="col-md-3">
                <select
                  className="form-select h-full text-light-1"
                  name="Salutation"
                  values={formik?.values?.Salutation}
                  onChange={formik?.handleChange}
                  onBlur={formik?.handleBlur}
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
                    onBlur={formik?.handleBlur}
                    required
                  />
                  <label className="lh-1 text-16 text-light-1">
                    First name
                  </label>
                </div>
                <ErrorMessage
                  component="span"
                  className="text-13 text-red-1"
                  name="FirstName"
                />
              </div>
              {/* End col-12 */}
              <div className="col-md-4">
                <div className="form-input input-group has-validation">
                  <input
                    type="text"
                    name="LastName"
                    value={formik?.values?.LastName}
                    onChange={formik?.handleChange}
                    onBlur={formik?.handleBlur}
                    required
                  />
                  <label className="lh-1 text-16 text-light-1">Last name</label>
                </div>
                <ErrorMessage
                  component="span"
                  className="text-13 text-red-1"
                  name="LastName"
                />
              </div>
              {/* End col-12 */}
              <div className="col-md-12">
                <div className="form-input ">
                  <input
                    type="text"
                    name="Email"
                    value={formik?.values?.Email}
                    onChange={formik?.handleChange}
                    onBlur={formik?.handleBlur}
                    required
                  />
                  <label className="lh-1 text-16 text-light-1">Email</label>
                </div>
                <ErrorMessage
                  component="span"
                  className="text-13 text-red-1"
                  name="Email"
                />
              </div>
              {/* End col-12 */}
              <div className="col-md-12">
                <div className="form-input ">
                  <input
                    type="text"
                    name="Mobile"
                    value={formik?.values?.Mobile}
                    onChange={formik?.handleChange}
                    onBlur={formik?.handleBlur}
                    required
                  />
                  <label className="lh-1 text-16 text-light-1">Mobile</label>
                </div>
                <ErrorMessage
                  component="span"
                  className="text-13 text-red-1"
                  name="Mobile"
                />
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
                      By proceeding with this booking, I agree to Oterra Terms
                      of Use and Privacy Policy.
                    </div>
                  </div>
                  {/* End col-12 */}
                </div>
              </div>
              <div className="row x-gap-20 y-gap-20 pt-20">
                <div className="col-auto">
                  <button
                    className="button h-60 px-24 -dark-1 bg-blue-1 text-white gap-2"
                    onClick={(e) => {
                      formik.validateForm().then((errors) => {
                        if (Object.keys(errors).length > 0) {
                          toast.error("Please fill all the fields");
                        }
                      });
                      formik.handleSubmit(e);
                    }}
                    type="submit"
                  >
                    {options.isLoading ? (
                      <div
                        className="spinner-border spinner-border-sm"
                        role="status"
                      >
                        <span className="sr-only"></span>
                      </div>
                    ) : null}
                    Confirm Booking
                  </button>
                </div>
                {/* End next btn */}
              </div>
            </form>
          </FormikProvider>
        </div>
        <div className="col-xl-5 col-lg-4 mt-30">
          <div className="booking-sidebar">
            <BookingDetails />
          </div>
        </div>
      </div>
      {/* End main content */}
      {/* End stepper button */}
    </>
  );
};

export default Index;
