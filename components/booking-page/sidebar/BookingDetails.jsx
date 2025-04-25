import Image from "next/image";
import { useSelector } from "react-redux";
import moment from "moment";
import PromoCode from "./PromoCode";
import PricingSummary from "./PricingSummary";

const BookingDetails = () => {
  const selectedRoom = useSelector((state) => state.roomSelection);
  const reservationInfo = useSelector((state) => state.reservationInfo);

  return (
    <>
      <div className="px-30 py-30 border-light rounded-4">
        <div className="text-20 fw-500 mb-30">Your booking details</div>
        <div className="border-top-light mt-30 mb-20" />
        <div className="row y-gap-20 justify-between">
          <div className="col-auto">
            <div className="text-15">Check-in</div>
            <div className="fw-500">
              {reservationInfo?.arrivalDate
                ? moment(reservationInfo?.arrivalDate).format("ddd DD MMM YYYY")
                : null}
            </div>
          </div>
          <div className="col-auto md:d-none">
            <div className="h-full w-1 bg-border" />
          </div>
          <div className="col-auto text-right md:text-left">
            <div className="text-15">Check-out</div>
            <div className="fw-500">
              {reservationInfo?.departureDate
                ? moment(reservationInfo?.departureDate).format(
                    "ddd DD MMM YYYY",
                  )
                : null}
            </div>
          </div>
        </div>
        {/* End row */}
      </div>
      <PricingSummary />
      <PromoCode />
    </>
    // End px-30
  );
};

export default BookingDetails;
