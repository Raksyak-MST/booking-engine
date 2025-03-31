import Link from "next/link";
import { useState } from "react";

import BookingDetails from "./sidebar/BookingDetails";
import { billingAction  } from "@/store/store"
import { useDispatch, useSelector } from "react-redux";

const CustomerInfo = () => {

  const personalInf = useSelector((state) => state.billing.personalInfo);

  const dispatch = useDispatch();
  const { firstName, lastName, email, password, companyCode, country, mobile } = personalInf;

  const handleChange = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;

    dispatch(billingAction.setPersonalInfo({ ...personalInf, [fieldName]: fieldValue}));
  };

  return (
    <>
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
              name="salutation"
              onChange={handleChange}
            >
              <option value="Mr">Mr.</option>
              <option value="Miss">Mrs.</option>
            </select>
          </div>
          {/* End col-12 */}

          <div className="col-md-5">
            <div className="form-input ">
              <input
                type="text"
                name="firstName"
                value={firstName}
                onChange={handleChange}
                required
              />
              <label className="lh-1 text-16 text-light-1">First name</label>
            </div>
          </div>
          {/* End col-12 */}

          <div className="col-md-5">
            <div className="form-input ">
              <input
                type="text"
                name="lastName"
                value={lastName}
                onChange={handleChange}
                required
              />
              <label className="lh-1 text-16 text-light-1">Last name</label>
            </div>
          </div>
          {/* End col-12 */}

          <div className="col-md-12">
            <div className="form-input ">
              <input
                type="text"
                name="email"
                value={email}
                onChange={handleChange}
                required
              />
              <label className="lh-1 text-16 text-light-1">Email</label>
            </div>
          </div>
          {/* End col-12 */}

          <div className="col-md-12">
            <div className="form-input ">
              <input
                type="text"
                name="mobile"
                value={mobile}
                onChange={handleChange}
                required
              />
              <label className="lh-1 text-16 text-light-1">Mobile</label>
            </div>
          </div>
          {/* End col-12 */}


          <div className="col-md-6">
            <div className="form-input ">
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                required
              />
              <label className="lh-1 text-16 text-light-1">Password</label>
              {personalInf.isPasswordVisible ? (
                <i className="fas fa-eye"></i>
              ) : (
                <i className="fa fas-eye"></i>
              )}
            </div>
          </div>
          {/* End col-12 */}

          <div className="col-md-6">
            <div className="form-input ">
              <input
                type="text"
                name="companyCode"
                onChange={handleChange}
                value={companyCode}
                required
              />
              <label className="lh-1 text-16 text-light-1">Company code</label>
            </div>
          </div>
          {/* End col-12 */}

          <div className="col-12">
            <div className="form-input ">
              <input
                name="address"
                type="text"
                required
                value={personalInf?.address}
                onChange={handleChange}
              />
              <label className="lh-1 text-16 text-light-1">
                Address line 2
              </label>
            </div>
          </div>
          {/* End col-12 */}

          <div className="col-md-06">
            <div className="form-input ">
              <input
                type="text"
                name="country"
                onChange={handleChange}
                required
              />
              <label className="lh-1 text-16 text-light-1">Country</label>
            </div>
          </div>
          {/* End col-12 */}

          <div className="col-md-6">
            <div className="form-input ">
              <input
                name="state"
                type="text"
                required
                value={personalInf?.state}
                onChange={handleChange}
              />
              <label className="lh-1 text-16 text-light-1">
                State/Province/Region
              </label>
            </div>
          </div>
          {/* End col-12 */}

          <div className="col-md-6">
            <div className="form-input ">
              <input
                name="zipcode"
                type="text"
                required
                value={personalInf?.zipcode}
                onChange={handleChange}
              />
              <label className="lh-1 text-16 text-light-1">
                ZIP code/Postal code
              </label>
            </div>
          </div>
          {/* End col-12 */}

          <div className="col-12">
            <div className="form-input ">
              <textarea
                name="specialRequest"
                required
                rows={6}
                defaultValue={""}
                value={personalInf?.specialRequest}
                onChange={handleChange}
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
                  By proceeding with this booking, I agree to GoTrip Terms of
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
      {/*  */}
    </>
  );
};

export default CustomerInfo;
