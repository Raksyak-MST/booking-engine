import Image from "next/image";
import { useSelector } from "react-redux"
import moment from "moment"
import PromoCode from "./PromoCode";
import PricingSummary from "./PricingSummary";

const BookingDetails = () => {
  const selectedRoom = useSelector(state => state.roomSelection)

  return (
    <>
      <div className="px-30 py-30 border-light rounded-4">
        <div className="text-20 fw-500 mb-30">Your booking details</div>
        <div className="row x-gap-15 y-gap-20">
          <div className="col-auto cardImage ratio ratio-1:1 w-140 md:w-1/1 rounded-4 bg-light-2">
            <Image
              fill
              src={
                selectedRoom?.roomImages?.length > 0
                  ? selectedRoom?.roomImages[0]?.includes("http")
                    ? selectedRoom?.roomImages[0]
                    : "/img/hotels/default-hotel.jpg"
                  : "/img/hotels/default-hotel.jpg"
              }
              alt="image"
              className="size-140 rounded-4 object-cover"
            />
          </div>
          {/* End .col */}
          <div className="col">
            <div className="lh-17 fw-500">{selectedRoom?.roomTypeName}</div>
            <div className="row items-end">
              <div className="col-auto">
                <div className="text-15">Stay information:</div>
              </div>
              <div className="col-auto">
                <div className="text-15">
                  {selectedRoom?.roomQuantity} room, {selectedRoom?.adults}{" "}
                  adult and {selectedRoom?.children} children
                </div>
              </div>
            </div>
          </div>
          {/* End .col */}
        </div>
        {/* End .row */}

        <div className="border-top-light mt-30 mb-20" />
        <div className="row y-gap-20 justify-between">
          <div className="col-auto">
            <div className="text-15">Check-in</div>
            <div className="fw-500">
              {selectedRoom?.arrivalDate
                ? moment(selectedRoom?.arrivalDate).format("ddd DD MMM YYYY")
                : null}
            </div>
          </div>
          <div className="col-auto md:d-none">
            <div className="h-full w-1 bg-border" />
          </div>
          <div className="col-auto text-right md:text-left">
            <div className="text-15">Check-out</div>
            <div className="fw-500">
              {selectedRoom?.departureDate
                ? moment(selectedRoom?.departureDate).format("ddd DD MMM YYYY")
                : null}
            </div>
          </div>
        </div>
        {/* End row */}

        <div className="border-top-light mt-30 mb-20" />
        <div>
          <div className="text-15">Total length of stay:</div>
          <div className="fw-500">{selectedRoom?.numberOfNights} nights</div>
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
