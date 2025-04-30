"use client";

import React, { useEffect, useState } from "react";
import BookingDetails from "../sidebar/BookingDetails";
import * as Actions from "@/store/store";
import { api } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useFormik, FormikProvider, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { getURL } from "next/dist/shared/lib/utils";

const Index = () => {
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [cashFreePaymentCreateOrder, options] =
    Actions.api.useCashFreePaymentCreateOrderMutation();

  const [addReservationFromWeb, addReservationOptions] =
    Actions.api.useAddReservationFromWebMutation();

  const [getReservationJsonLikeEzeeWebBooking] =
    Actions.api.useGetReservationJsonLikeEzeeWebBookingMutation();

  const pickedPackageId = useSelector(
    (state) => state?.bookingQuery?.selectedPackageID,
  );
  const roomSelection = useSelector((state) => state?.roomSelection);
  const pickedPackage = roomSelection?.perNightCharges?.filter(
    (pack) => pack?.packageID === parseInt(pickedPackageId),
  );

  const roomPicked = useSelector((state) => state.guestRoom.roomPicked);
  const reservationInfo = useSelector((state) => state.reservationInfo);
  const searchQuery = useSelector((state) => state.searchQuery);

  const rates = !pickedPackage?.length ? {} : pickedPackage[0];
  const room = !rates?.rooms?.length ? {} : rates.rooms[0];

  useEffect(() => {
    const data = sessionStorage.getItem("roomSelection");
    if (data) {
      // FIXME: Not able to handle this in store.js as it was not defined at server rendering.
      // did it here because localStorage is not define at the store.js (preloadedState property)
      dispatch(Actions.roomSelectionActions.setRoomSelection(JSON.parse(data)));
    }
  }, []);

  useEffect(() => {
    const data = sessionStorage.getItem("guestDetails");
    const roomQuantity = sessionStorage.getItem("roomPick");
    if (data) {
      dispatch(
        Actions.reservationInfoActions.setGuestDetails(JSON.parse(data)),
      );
      if (roomQuantity) {
        dispatch(
          Actions.reservationInfoActions.setQuantity(
            Object.keys(JSON.parse(roomQuantity)).length,
          ),
        );
      }
    }
  }, []);

  useEffect(() => {
    const data = sessionStorage.getItem("tempGuestDetails");
    if (data) {
      formik.setValues(JSON.parse(data));
    }
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      guestDetails: [],
      paymentDetails: {
        Email: "",
        Mobile: "",
        Address: "",
        Country: "",
        State: "",
        Zipcode: "",
        Comment: "",
      },
    },

    validationSchema: Yup.object().shape({
      guestDetails: Yup.array().of(
        Yup.object().shape({
          Salutation: Yup.string().required("Salutation is required"),
          FirstName: Yup.string().required("First Name is required"),
          LastName: Yup.string().required("Last Name is required"),
        }),
      ),
      paymentDetails: Yup.object().shape({
        Email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        Mobile: Yup.string().required("Mobile is required"),
      }),
    }),
    onSubmit: async (values) => {
      try {
        const errors = await formik.validateForm();

        if (Object.keys(errors).length > 0) {
          toast.error("Please fill all the requred fields marked *");
          return;
        }

        sessionStorage.setItem("tempGuestDetails", JSON.stringify(values));
        const updatedGuestDetails = values.guestDetails.map(
          (guestDetail, index) => ({
            ...guestDetail,
            // needed to copy other details to guestDetails all guest as common data for seprate reservation.
            Salutation: guestDetail.Salutation || "Mr",
            Email: values.paymentDetails.Email,
            Mobile: values.paymentDetails.Mobile,
            Address: values.paymentDetails.Address,
            Country: values.paymentDetails.Country,
            State: values.paymentDetails.State,
            Zipcode: values.paymentDetails.Zipcode,
            Comment: values.paymentDetails.Comment,
            selectedPackageID: roomPicked[index + 1]?.selectedPackageID,
            selectedRoomTypeID: roomPicked[index + 1]?.roomTypeID,
            adults: roomPicked[index + 1]?.adults,
            children: roomPicked[index + 1]?.children,
            PromoCode: "",
          }),
        );
        dispatch(
          Actions.reservationInfoActions.setGuestDetails(updatedGuestDetails),
        );

        toast.success("Guest details saved successfully");

        const payload = {
          guestDetails: updatedGuestDetails,
          arrivalDate: searchQuery.arrivalDate,
          departureDate: searchQuery.departureDate,
          quantity: searchQuery.quantity,
          hotelID: searchQuery.hotelID,
          sameName: false,
        };

        await addReservationFromWeb(payload).unwrap();

        if (addReservationOptions.isError) {
          toast.error("Reservation creation failed");
          // don't initiate payment if reservation api failed.
          return;
        }

        if (addReservationOptions.isSuccess) {
          toast.success("Your reservation has been created successfully");
        }

        const response = await cashFreePaymentCreateOrder(payload);

        if (options.isError) {
          toast.error("Cashfree payment creation failed");
          return;
        }

        const { data } = response;
        if (!data) {
          toast.error("Not able to get Cashfree payment details");
          return;
        }

        await getReservationJsonLikeEzeeWebBooking(payload);

        // [[ cash free integration ]]
        const cashFree = Cashfree({ mode: "sendbox" });

        const checkoutResponse = await cashFree.checkout({
          mode: "sandbox",
          paymentSessionId: data?.payment_session_id,
          redirectTarget: "_modal",
        });

        if (checkoutResponse.error) {
          toast.error(checkoutResponse.error.message);
          return;
        }
        // [[ cash free integration ]]
        //
        setPaymentInitiated(true); // used to diable the confirm booking button.
        router.replace("/order-submitted");
      } catch (error) {
        toast.error("Cashfree payment failed");
        setPaymentInitiated(false);
      }
    },
  });

  const handleFieldValidation = (e) => {
    e.preventDefault();
    formik.validateForm().then((errors) => {
      if (Object.keys(errors).length > 0) {
        toast.error("Please fill all the requred fields marked *");
        return;
      }
    });
    // don't remove this it is used to call the formik submit function
    formik.handleSubmit(e);
  };

  return (
    <>
      <div className="row">
        <div className="col-xl-7 col-lg-8 mt-30">
          <FormikProvider value={formik} key={room?.id}>
            <div className="p-4 border rounded">
              <div className="mb-40 md:mb-24">
                <h2 className="text-24 fw-500 ">Let us know who you are</h2>
                <p className="text-14">
                  Please tell us the name of the guest staying at the hotel as
                  it appears on the ID that they’ll present at check-in.
                </p>
              </div>
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
                      <Field
                        as="select"
                        className="form-select h-full"
                        name={`guestDetails.${index}.Salutation`}
                        defaultValue="default"
                      >
                        <option disabled value="default">
                          Salutation*
                        </option>
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
                      </Field>
                      <ErrorMessage
                        component="span"
                        className="text-13 text-red-1"
                        name={`guestDetails.${index}.Salutation`}
                      />
                    </div>

                    {/* End col-12 */}
                    <div className="col-md-5">
                      <div className="form-input">
                        <Field
                          name={`guestDetails.${index}.FirstName`}
                          required
                          value={
                            formik.values.guestDetails[index]?.FirstName ?? ""
                          }
                        />
                        <label className="lh-1 text-16 text-light-1">
                          First name*
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
                          value={
                            formik.values.guestDetails[index]?.LastName ?? ""
                          }
                        />
                        <label className="lh-1 text-16 text-light-1">
                          Last name*
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
            <h3 className="text-24 fw-500 pt-40">Payment details</h3>
            <form className="row x-gap-20 y-gap-20 pt-20">
              <div className="col-md-6">
                <div className="form-input ">
                  <Field name="paymentDetails.Email" required />
                  <label className="lh-1 text-16 text-light-1">Email*</label>
                </div>
                <ErrorMessage
                  component="span"
                  className="text-13 text-red-1"
                  name="paymentDetails.Email"
                />
              </div>
              {/* End col-12 */}
              <div className="col-md-6">
                <div className="form-input ">
                  <Field name="paymentDetails.Mobile" required />
                  <label className="lh-1 text-16 text-light-1">Mobile*</label>
                </div>
                <ErrorMessage
                  component="span"
                  className="text-13 text-red-1"
                  name="paymentDetails.Mobile"
                />
              </div>
              {/* End col-12 */}
              <div className="col-12">
                <div className="form-input ">
                  <Field name="paymentDetails.Address" />
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
                  <Field name="paymentDetails.Country" />
                  <label className="lh-1 text-16 text-light-1">Country</label>
                </div>
                <div className="text-13 text-red-1">
                  {formik?.errors?.Country}
                </div>
              </div>
              {/* End col-12 */}
              <div className="col-md-6">
                <div className="form-input ">
                  <Field name="paymentDetails.State" />
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
                  <Field name="paymentDetails.Zipcode" />
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
                  <Field name="paymentDetails.Comment" as="textarea" rows={4} />
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
                  <div className="d-flex gap-2">
                    {/*
                     * Made two separate buttons because of the need for different actions,
                     * otherwise all actions will be handled by singe handler which was causing data sync issue
                     */}
                    <button
                      className="button -md -outline-blue-1 px-24 gap-2 text-blue-1"
                      onClick={handleFieldValidation}
                      type="submit"
                      disabled={
                        addReservationOptions.isLoading || paymentInitiated
                      }
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
