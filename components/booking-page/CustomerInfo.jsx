import Link from "next/link";

import { useState } from "react"
import BookingDetails from "./sidebar/BookingDetails";
import { billingAction } from "@/store/store"
import { useDispatch, useSelector } from "react-redux";

const CustomerInfo = () => {

  const personalInfo = useSelector((state) => state.billing.personalInfo);
  const { errors } = useSelector((state) => state.billing)
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    dispatch(billingAction.setPersonalInfo({ ...personalInfo, [fieldName]: fieldValue}));
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
              name="Salutation"
              onChange={handleChange}
            >
              <option value="Mr">Mr.</option>
              <option value="Mrs">Mrs.</option>
            </select>
          </div>
          {/* End col-12 */}

          <div className="col-md-5">
            <div className="form-input ">
              <input
                type="text"
                name="FirstName"
                value={personalInfo?.FirstName}
                onChange={handleChange}
                required
              />
              <label className="lh-1 text-16 text-light-1">First name</label>
            </div>
            <div className="text-13 text-red-1">{errors?.FirstName}</div>
          </div>
          {/* End col-12 */}

          <div className="col-md-5">
            <div className="form-input input-group has-validation">
              <input
                type="text"
                name="LastName"
                value={personalInfo?.LastName}
                onChange={handleChange}
                required
              />
              <label className="lh-1 text-16 text-light-1">Last name</label>
            </div>
            <div className="text-13 text-red-1">{errors?.LastName}</div>
          </div>
          {/* End col-12 */}

          <div className="col-md-12">
            <div className="form-input ">
              <input
                type="text"
                name="Email"
                value={personalInfo?.Email}
                onChange={handleChange}
                required
              />
              <label className="lh-1 text-16 text-light-1">Email</label>
            </div>
            <div className="text-13 text-red-1">{errors?.Email}</div>
          </div>
          {/* End col-12 */}

          <div className="col-md-6">
            <div className="form-input ">
              <input
                type="text"
                name="Mobile"
                value={personalInfo?.Mobile}
                onChange={handleChange}
                required
              />
              <label className="lh-1 text-16 text-light-1">Mobile</label>
            </div>
            <div className="text-13 text-red-1">{errors?.Email}</div>
          </div>
          {/* End col-12 */}

          <div className="col-md-6">
            <div className="form-input ">
              <input
                type="password"
                name="Password"
                value={personalInfo?.Password}
                onChange={handleChange}
                required
              />
              <label className="lh-1 text-16 text-light-1">Password</label>
            </div>
            <div className="text-13 text-red-1">{errors?.Password}</div>
          </div>
          {/* End col-12 */}

          {/* <div className="col-md-6">
            <div className="form-input ">
              <input
                type="text"
                name="companyID"
                value={personalInfo?.companyID}
                onChange={handleChange}
                required
              />
              <label className="lh-1 text-16 text-light-1">Company code</label>
            </div>
            <div className="text-13 text-red-1">{errors?.companyID}</div>
          </div> */}
          {/* End col-12 */}

          <div className="col-12">
            <div className="form-input ">
              <input
                name="Address"
                type="text"
                required
                value={personalInfo?.Address}
                onChange={handleChange}
              />
              <label className="lh-1 text-16 text-light-1">
                Address line 1
              </label>
            </div>
            <div className="text-13 text-red-1">{errors?.Address}</div>
          </div>
          {/* End col-12 */}

          <div className="col-md-06">
            <div className="form-input ">
              <input
                type="text"
                name="Country"
                required
                value={personalInfo?.Country}
                onChange={handleChange}
              />
              <label className="lh-1 text-16 text-light-1">Country</label>
            </div>
            <div className="text-13 text-red-1">{errors?.Country}</div>
          </div>
          {/* End col-12 */}

          <div className="col-md-6">
            <div className="form-input ">
              <input
                name="State"
                type="text"
                required
                value={personalInfo?.State}
                onChange={handleChange}
              />
              <label className="lh-1 text-16 text-light-1">
                State/Province/Region
              </label>
            </div>
            <div className="text-13 text-red-1">{errors?.State}</div>
          </div>
          {/* End col-12 */}

          <div className="col-md-6">
            <div className="form-input ">
              <input
                name="Zipcode"
                type="text"
                required
                value={personalInfo?.Zipcode}
                onChange={handleChange}
              />
              <label className="lh-1 text-16 text-light-1">
                ZIP code/Postal code
              </label>
            </div>
            <div className="text-13 text-red-1">{errors?.Zipcode}</div>
          </div>
          {/* End col-12 */}

          <div className="col-12">
            <div className="form-input ">
              <textarea
                name="Comment"
                required
                rows={6}
                value={personalInfo?.Comment}
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
      {/*  */}
    </>
  );
};

export default CustomerInfo;
