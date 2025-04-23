"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import BookingDetails from "../sidebar/BookingDetails";
import * as Actions from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { ERROR_MESSAGES } from "@/data/error-messages";
import { useFormik, FormikProvider, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

const Index = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [addReservationFromWebMutation, options] =
    Actions.useAddReservationFromWebMutation();

  const reservationInfo = useSelector((state) => state.reservationInfo);
  const bookingQuery = useSelector((state) => state.bookingQuery);

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
      dispatch(Actions.roomSelectionActions.setRoomSelection(JSON.parse(data)));
    }
  }, []);

  useEffect(() => {
    const data = sessionStorage.getItem("guestDetails");
    if (data) {
      dispatch(
        Actions.reservationInfoActions.setGuestDetails(JSON.parse(data)),
      );
    }
  }, []);

  const formik = useFormik({
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
    enableReinitialize: true,
    onSubmit: async (values) => {
      values.guestDetails.forEach((guestDetail) => {
        // needed to copy other details to guestDetails as required by backend to extract the details for cashFree order creation.
        Object.assign(guestDetail, {
          Salutation: guestDetail.Salutation || "Mr",
          Email: values.paymentDetails.Email,
          Mobile: values.paymentDetails.Mobile,
          Address: values.paymentDetails.Address,
          Country: values.paymentDetails.Country,
          State: values.paymentDetails.State,
          Zipcode: values.paymentDetails.Zipcode,
          Comment: values.paymentDetails.Comment,
          PromoCode: "",
        });
      });
      dispatch(
        Actions.reservationInfoActions.setGuestDetails(values.guestDetails),
      );
      console.log(values.guestDetails, bookingQuery);
    },
  });

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
                      >
                        <option disabled selected value="">
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
                  <button
                    className="button h-60 px-24 -dark-1 bg-blue-1 text-white gap-2"
                    onClick={(e) => {
                      formik.validateForm().then((errors) => {
                        if (Object.keys(errors).length > 0) {
                          toast.error(
                            "Please fill all the requred fields marked *",
                          );
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
