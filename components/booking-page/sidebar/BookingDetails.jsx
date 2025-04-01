import Image from "next/image";
import { useSelector } from "react-redux"

const BookingDetails = () => {
  const selectedRoom = useSelector(state => state.roomSelection)
  const bookingQueryInfo = useSelector(state => state.bookingQuery)
  const perNightCharges = selectedRoom?.perNightCharges?.filter(
    (pkg) => pkg?.packageID == bookingQueryInfo?.selectedPackageID
  )[0]?.rooms;

  return (
    <div className="px-30 py-30 border-light rounded-4">
      <div className="text-20 fw-500 mb-30">Your booking details</div>
      <div className="x-gap-15 y-gap-20">
        <div>
          <Image
            width={140}
            height={140}
            src="/img/backgrounds/1.png"
            alt="image"
            className="size-140 rounded-4 object-cover"
          />
        </div>
        {/* End .col */}
        <div className="col">
          <div className="lh-17 fw-500">{selectedRoom?.roomTypeName}</div>
          <div className="text-14 text-light-1 lh-15 mt-5">
            {selectedRoom?.description}
          </div>
        </div>
        {/* End .col */}
      </div>
      {/* End .row */}

      <div className="border-top-light mt-30 mb-20" />
      <div className="row y-gap-20 justify-between">
        <div className="col-auto">
          <span className="fw-500">Room1</span>
        </div>
        <div className="col-auto">
          {perNightCharges
            ? new Intl.NumberFormat("en-IN", {
                currencyDisplay: "code",
                style: "currency",
                currency: "INR",
              }).format(perNightCharges[0]?.fulltotal)
            : null}
        </div>
      </div>
      <div className="row y-gap-20 justify-between">
        <div className="col-auto">
          <span className="fw-500">Total tax</span>
        </div>
        <div className="col-auto">
          {perNightCharges
            ? new Intl.NumberFormat("en-IN", {
                currencyDisplay: "code",
                style: "currency",
                currency: "INR",
              }).format(perNightCharges[0]?.TotalTax)
            : null}
        </div>
      </div>
      <div className="row y-gap-20 justify-between">
        <div className="col-auto">
          <span className="fw-500">Total price</span>
        </div>
        <div className="col-auto">
          {perNightCharges
            ? new Intl.NumberFormat("en-IN", {
                currencyDisplay: "code",
                style: "currency",
                currency: "INR",
              }).format(perNightCharges[0]?.TotalAmountAfterTax)
            : null}
        </div>
      </div>
      <div className="border-top-light mt-30 mb-20" />
      <div className="row y-gap-20 justify-between">
        <div className="col-auto">
          <div className="text-15">Check-in</div>
          <div className="fw-500">{selectedRoom?.arrivalDate}</div>
        </div>
        <div className="col-auto md:d-none">
          <div className="h-full w-1 bg-border" />
        </div>
        <div className="col-auto text-right md:text-left">
          <div className="text-15">Check-out</div>
          <div className="fw-500">{selectedRoom?.departureDate}</div>
        </div>
      </div>
      {/* End row */}

      <div className="border-top-light mt-30 mb-20" />
      <div>
        <div className="text-15">Total length of stay:</div>
        <div className="fw-500">{selectedRoom?.numberOfNights} nights</div>
      </div>

      <div className="border-top-light mt-30 mb-20" />
      <div className="row y-gap-20 justify-between items-center">
        <div className="col-auto">
          <div className="text-15">You selected:</div>
          <div className="fw-500">{selectedRoom?.roomTypeName}</div>
        </div>
        <div className="col-auto">
          <div className="text-15">
            {selectedRoom?.roomQuantity} room, {selectedRoom?.adults} adult and{" "}
            {selectedRoom?.children} children
          </div>
        </div>
      </div>
      {/* End row */}
    </div>
    // End px-30
  );
};

export default BookingDetails;
