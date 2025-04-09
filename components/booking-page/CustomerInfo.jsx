import Link from "next/link";

import BookingDetails from "./sidebar/BookingDetails";

const CustomerInfo = (props) => {
  const { controller } = props;
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
              values={controller?.values?.Salutation}
              onChange={controller?.handleChange}
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
                value={controller?.values?.FirstName}
                onChange={controller?.handleChange}
                required
              />
              <label className="lh-1 text-16 text-light-1">First name</label>
            </div>
            <div className="text-13 text-red-1">
              {controller?.touched?.FirstName && controller?.errors?.FirstName}
            </div>
          </div>
          {/* End col-12 */}

          <div className="col-md-5">
            <div className="form-input input-group has-validation">
              <input
                type="text"
                name="LastName"
                value={controller?.values?.LastName}
                onChange={controller?.handleChange}
                required
              />
              <label className="lh-1 text-16 text-light-1">Last name</label>
            </div>
            <div className="text-13 text-red-1">
              {controller?.touched?.LastName && controller?.errors?.LastName}
            </div>
          </div>
          {/* End col-12 */}

          <div className="col-md-12">
            <div className="form-input ">
              <input
                type="text"
                name="Email"
                value={controller?.values?.Email}
                onChange={controller?.handleChange}
                required
              />
              <label className="lh-1 text-16 text-light-1">Email</label>
            </div>
            <div className="text-13 text-red-1">
              {controller?.errors?.Email}
            </div>
          </div>
          {/* End col-12 */}

          <div className="col-md-12">
            <div className="form-input ">
              <input
                type="text"
                name="Mobile"
                value={controller?.values?.Mobile}
                onChange={controller?.handleChange}
                required
              />
              <label className="lh-1 text-16 text-light-1">Mobile</label>
            </div>
            <div className="text-13 text-red-1">
              {controller?.errors?.Mobile}
            </div>
          </div>
          {/* End col-12 */}

          <div className="col-12">
            <div className="form-input ">
              <input
                name="Address"
                type="text"
                required
                value={controller?.values?.Address}
                onChange={controller?.handleChange}
              />
              <label className="lh-1 text-16 text-light-1">
                Address line 1
              </label>
            </div>
            <div className="text-13 text-red-1">
              {controller?.errors?.Address}
            </div>
          </div>
          {/* End col-12 */}

          <div className="col-md-06">
            <div className="form-input ">
              <input
                type="text"
                name="Country"
                required
                value={controller?.values?.Country}
                onChange={controller?.handleChange}
              />
              <label className="lh-1 text-16 text-light-1">Country</label>
            </div>
            <div className="text-13 text-red-1">
              {controller?.errors?.Country}
            </div>
          </div>
          {/* End col-12 */}

          <div className="col-md-6">
            <div className="form-input ">
              <input
                name="State"
                type="text"
                required
                value={controller?.values?.State}
                onChange={controller?.handleChange}
              />
              <label className="lh-1 text-16 text-light-1">
                State/Province/Region
              </label>
            </div>
            <div className="text-13 text-red-1">
              {controller?.errors?.State}
            </div>
          </div>
          {/* End col-12 */}

          <div className="col-md-6">
            <div className="form-input ">
              <input
                name="Zipcode"
                type="text"
                required
                value={controller?.values?.Zipcode}
                onChange={controller?.handleChange}
              />
              <label className="lh-1 text-16 text-light-1">
                ZIP code/Postal code
              </label>
            </div>
            <div className="text-13 text-red-1">
              {controller?.errors?.Zipcode}
            </div>
          </div>
          {/* End col-12 */}

          <div className="col-12">
            <div className="form-input ">
              <textarea
                name="Comment"
                required
                rows={6}
                value={controller?.values?.Comment}
                onChange={controller?.handleChange}
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
