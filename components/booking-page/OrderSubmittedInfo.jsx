'use client'

import { useSelector } from "react-redux"
import toast from "react-hot-toast"
import moment from "moment"

const OrderSubmittedInfo = () => {
  const personalInfo = useSelector((state) => state.reservationInfo.guestDetails) 
  const reservationCompetitionDetails = useSelector((state) => state.billing.reservationCompetitionDetails)

  const pickedPackageId = useSelector(
    (state) => state?.bookingQuery?.selectedPackageID
  );
  const roomSelection = useSelector((state) => state?.roomSelection);
  const pickedPackage = roomSelection?.perNightCharges?.filter(
    (pack) => pack?.packageID === parseInt(pickedPackageId)
  );

  const rates = !pickedPackage?.length ? {} : pickedPackage[0];
  const room = !rates?.rooms?.length ? {} : rates.rooms[0];

  let reservationNumber,
    reservationResults,
    reservationDate,
    reservationTotalAmount,
    reservationPaymentMethod;

  if(!Array.isArray(reservationCompetitionDetails?.reservationResults)){
    toast.error("Reservation details not found")
    reservationResults = [{}]
  }

  if (reservationCompetitionDetails?.reservationResults?.length > 0) {
    reservationNumber =
      reservationCompetitionDetails?.reservationResults[0].reservationDetails;
  }

  return (
    <>
      <div className="col-xl-8 col-lg-8">
        <div className="order-completed-wrapper">
          <div className="d-flex flex-column items-center mt-40 lg:md-40 sm:mt-24">
            <div className="size-80 flex-center rounded-full bg-dark-3">
              <i className="icon-check text-30 text-white" />
            </div>
            <div className="text-26 lh-1 fw-600 mt-20">
              {`${personalInfo?.Salutation} ${personalInfo?.LastName}`}, your
              reservation was submitted successfully!
            </div>
            <div className="text-15 text-light-1 mt-10">
              Booking details has been sent to: {personalInfo?.Email}
            </div>
          </div>
          {/* End header */}

          <div className="border-type-1 rounded-8 px-50 py-35 mt-40">
            <div className="row">
              <div className="col-lg-3 col-md-6">
                <div className="text-15 lh-2812">Reservation Number</div>
                <div className="text-15 lh-12 fw-500 text-blue-1 mt-10">
                  {reservationNumber}
                </div>
              </div>
              {/* End .col */}
              <div className="col-lg-3 col-md-6">
                <div className="text-15 lh-12">Date</div>
                <div className="text-15 lh-12 fw-500 text-blue-1 mt-10">
                  {moment(new Date()).format("ddd DD MMM YYYY")}
                </div>
              </div>
              {/* End .col */}
              <div className="col-lg-3 col-md-6">
                <div className="text-15 lh-12">Total</div>
                <div className="text-15 lh-12 fw-500 text-blue-1 mt-10">
                  {new Intl.NumberFormat("en-IN", {
                    currency: "INR",
                    style: "currency",
                    currencyDisplay: "symbol",
                  }).format(room?.TotalAmountAfterTax)}
                </div>
              </div>
              {/* End .col */}
              <div className="col-lg-3 col-md-6">
                <div className="text-15 lh-12">Payment Method</div>
                <div className="text-15 lh-12 fw-500 text-blue-1 mt-10">
                  N/A
                </div>
              </div>
              {/* End .col */}
            </div>
          </div>
          {/* order price info */}

          <div className="border-light rounded-8 px-50 py-40 mt-40">
            <h4 className="text-20 fw-500 mb-30">Your Information</h4>
            <div className="row y-gap-10">
              <div className="col-12">
                <div className="d-flex justify-between ">
                  <div className="text-15 lh-16">First name</div>
                  <div className="text-15 lh-16 fw-500 text-blue-1">
                    {personalInfo?.FirstName}
                  </div>
                </div>
              </div>
              {/* End .col */}
              <div className="col-12">
                <div className="d-flex justify-between border-top-light pt-10">
                  <div className="text-15 lh-16">Last name</div>
                  <div className="text-15 lh-16 fw-500 text-blue-1">
                    {personalInfo?.LastName}
                  </div>
                </div>
              </div>
              {/* End .col */}
              <div className="col-12">
                <div className="d-flex justify-between border-top-light pt-10">
                  <div className="text-15 lh-16">Email</div>
                  <div className="text-15 lh-16 fw-500 text-blue-1">
                    {personalInfo?.Email}
                  </div>
                </div>
              </div>
              {/* End .col */}
              <div className="col-12">
                <div className="d-flex justify-between border-top-light pt-10">
                  <div className="text-15 lh-16">Phone</div>
                  <div className="text-15 lh-16 fw-500 text-blue-1">
                    {personalInfo?.Mobile}
                  </div>
                </div>
              </div>
              {/* End .col */}
              <div className="col-12">
                <div className="d-flex justify-between border-top-light pt-10">
                  <div className="text-15 lh-16">Address line 1</div>
                  <div className="text-15 lh-16 fw-500 text-blue-1">
                    {personalInfo?.Address}
                  </div>
                </div>
              </div>
              {/* End .col */}
              <div className="col-12">
                <div className="d-flex justify-between border-top-light pt-10">
                  <div className="text-15 lh-16">City</div>
                  <div className="text-15 lh-16 fw-500 text-blue-1">
                    {personalInfo?.City}
                  </div>
                </div>
              </div>
              {/* End .col */}
              <div className="col-12">
                <div className="d-flex justify-between border-top-light pt-10">
                  <div className="text-15 lh-16">State/Province/Region</div>
                  <div className="text-15 lh-16 fw-500 text-blue-1">
                    {personalInfo?.State}
                  </div>
                </div>
              </div>
              {/* End .col */}
              <div className="col-12">
                <div className="d-flex justify-between border-top-light pt-10">
                  <div className="text-15 lh-16">ZIP code/Postal code</div>
                  <div className="text-15 lh-16 fw-500 text-blue-1">
                    {personalInfo?.Zipcode}
                  </div>
                </div>
              </div>
              {/* End .col */}
              <div className="col-12">
                <div className="d-flex justify-between border-top-light pt-10">
                  <div className="text-15 lh-16">Country</div>
                  <div className="text-15 lh-16 fw-500 text-blue-1">
                    {personalInfo?.Country}
                  </div>
                </div>
              </div>
              {/* End .col */}
              <div className="col-12">
                <div className="d-flex justify-between border-top-light pt-10">
                  <div className="text-15 lh-16">Special Requirements</div>
                  <div className="text-15 lh-16 fw-500 text-blue-1">
                    {personalInfo?.Comment}
                  </div>
                </div>
              </div>
              {/* End .col */}
            </div>
            {/* End .row */}
          </div>
          {/* End order information */}
        </div>
        <button>Download</button>
      </div>
    </>
  );
};

export default OrderSubmittedInfo;
