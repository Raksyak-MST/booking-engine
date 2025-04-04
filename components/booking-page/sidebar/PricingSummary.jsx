import { useSelector } from "react-redux"

const PricingSummary = () => {

  const selectedRoom = useSelector(state => state.roomSelection)
  const bookingQueryInfo = useSelector(state => state.bookingQuery)
  const perNightCharges = selectedRoom?.perNightCharges?.filter(
    (pkg) => pkg?.packageCode == "AP" 
  )[0]?.rooms;

  const { fulltotal, TotalTax, TotalAmountAfterTax } = perNightCharges ? perNightCharges[0] : {} ; 

  return (
    <div className="px-30 py-30 border-light rounded-4 mt-30">
      <div className="text-20 fw-500 mb-20">Your price summary</div>
      <div className="row y-gap-5 justify-between">
        <div className="col-auto">
          <div className="text-15">{selectedRoom?.roomTypeName}</div>
        </div>
        {/* End col */}
        <div className="col-auto">
          <div className="text-15">
            {new Intl.NumberFormat("en-IN", {
              currency: "INR",
              currencyDisplay: "symbol",
              style: "currency",
            }).format(fulltotal)}
          </div>
        </div>
        {/* End col */}
      </div>
      {/* End .row */}

      <div className="row y-gap-5 justify-between pt-5">
        <div className="col-auto">
          <div className="text-15">Taxes and fees</div>
        </div>
        <div className="col-auto">
          <div className="text-15">
            {new Intl.NumberFormat("en-IN", {
              currency: "INR",
              currencyDisplay: "symbol",
              style: "currency",
            }).format(TotalTax)}
          </div>
        </div>
      </div>
      {/* End .row */}

      <div className="row y-gap-5 justify-between pt-5">
        <div className="col-auto">
          <div className="text-15">Booking fees</div>
        </div>
        <div className="col-auto">
          <div className="text-15">FREE</div>
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
                currency: "INR",
                currencyDisplay: "symbol",
                style: "currency",
              }).format(TotalAmountAfterTax)}
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
