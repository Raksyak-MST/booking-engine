import { useSelector } from "react-redux"

const PricingSummary = () => {
  const billingReservation = useSelector(state => state?.billing?.reservationInfo)
  const reservationInfo = billingReservation?.Reservations?.Reservation 

  if(!Array.isArray(reservationInfo)) {
    toast.error("Failed to fetch reservation info")
  }

  const { BookingTran } = reservationInfo[0]

  if(!Array.isArray(BookingTran)){
    toast.error("Failed to fetch booking tran info")
  }

  const RentalInfo = BookingTran[0].RentalInfo

  return (
    <div className="px-30 py-30 border-light rounded-4 mt-30">
      <div className="text-20 fw-500 mb-20">Your price summary</div>
      <div className="row y-gap-5 justify-between">
        <div className="col-auto">
          <div className="text-15">Total room charges</div>
        </div>
        <div className="col-auto">
          <div className="text-15">
            {new Intl.NumberFormat("en-IN", {
              currency: BookingTran[0]?.CurrencyCode ?? "INR",
              currencyDisplay: "symbol",
              style: "currency",
            }).format(RentalInfo[0]?.TotalAmountBeforeTax)}
          </div>
        </div>
      </div>
      <div className="row y-gap-5 justify-between pt-5">
        <div className="col-auto">
          <div className="text-15">Taxes and fees</div>
        </div>
        <div className="col-auto">
          <div className="text-15">
            {new Intl.NumberFormat("en-IN", {
              currency:BookingTran[0]?.CurrencyCode ?? "INR",
              currencyDisplay: "symbol",
              style: "currency",
            }).format(RentalInfo[0]?.TotalTax)}
          </div>
        </div>
      </div>
      <div className="row y-gap-5 justify-between pt-5">
        <div className="col-auto">
          <div className="text-15">Total Price (Inc. Of Taxes)</div>
        </div>
        <div className="col-auto">
          <div className="text-15">
            {new Intl.NumberFormat("en-IN", {
              currency:BookingTran[0]?.CurrencyCode ?? "INR",
              currencyDisplay: "symbol",
              style: "currency",
            }).format(RentalInfo[0]?.TotalAmountAfterTax)}
          </div>
        </div>
      </div>
      {/* End .row */}

      <div className="px-20 py-20 bg-blue-2 rounded-4 mt-20">
        <div className="row y-gap-5 justify-between">
          <div className="col-auto">
            <div className="text-18 lh-13 fw-500">Price</div>
          </div>
          <div className="col-auto">
            <div className="text-18 lh-13 fw-500">
              {new Intl.NumberFormat("en-IN", {
                currency: BookingTran[0]?.CurrencyCode ?? "INR",
                currencyDisplay: "symbol",
                style: "currency",
              }).format(RentalInfo[0]?.TotalAmountAfterTax)}
            </div>
          </div>
        </div>
      </div>
      {/* End .row */}
    </div>
    // End px-30
  );
};

export default PricingSummary;
