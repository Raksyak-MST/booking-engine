import { useSelector } from "react-redux";

function formateCurrency(num) {
  return new Intl.NumberFormat("en-IN", {
    currency: "INR",
    currencyDisplay: "symbol",
    style: "currency",
  }).format(num);
}

const PricingSummary = () => {
  const roomPicked = useSelector((state) => state.guestRoom?.roomPicked);
  const pricing = useSelector((state) => state.pricing);

  return (
    <div className="pt-20 border-light rounded-4 mt-30">
      <div className="mb-20 px-20">
        <h2 className="text-20 fw-500">Your price summary</h2>
        <p className="text-13">
          Before getting the latest price confirm your booking with your
          details.
        </p>
      </div>
      {Object.entries(roomPicked).map(([key, room], index) => (
        <div key={index} className="mb-28 bg-blue-1-05 p-4">
          <h2 className="text-18 bg-bule-2">
            {room?.selectedRoomOptions} ({room?.roomTypeName})
          </h2>
          <div className="row y-gap-5 justify-between">
            <div className="col-auto">
              <div className="text-15">Total room charges</div>
            </div>
            <div className="col-auto">
              <div className="text-15">
                {formateCurrency(
                  pricing?.BookingTran[index]?.RentalInfo
                    ?.TotalAmountBeforeTax ?? 0.0,
                )}
              </div>
            </div>
          </div>
          <div className="row y-gap-5 justify-between">
            <div className="col-auto">
              <div className="text-15">Package name</div>
            </div>
            <div className="col-auto">
              <div className="text-15">
                {pricing?.BookingTran[index]?.RentalInfo?.webDescription}
              </div>
            </div>
          </div>
          {/* End .row */}
        </div>
      ))}
      <div className="px-20 py-20 bg-blue-2 rounded-4 mt-20">
        <div className="row y-gap-5 justify-between">
          <div className="col-auto">
            <div className="text-15">Taxes and fees</div>
          </div>
          <div className="col-auto">
            <div className="text-15">
              {formateCurrency(pricing?.OverallTotal?.OverAllTotalTax ?? 0.0)}
            </div>
          </div>
        </div>
        <div className="row y-gap-5 justify-between">
          <div className="col-auto">
            <div className="text-15">Total Price (Exc. Of Taxes)</div>
          </div>
          <div className="col-auto">
            <div className="text-15">
              {formateCurrency(
                pricing?.OverallTotal?.OverAllTotalAmountBeforeTax ?? 0.0,
              )}
            </div>
          </div>
        </div>
        <div className="row y-gap-5 justify-between">
          <div className="col-auto">
            <div className="text-18 lh-13 fw-500">Total Price</div>
          </div>
          <div className="col-auto">
            <div className="text-18 lh-13 fw-500">
              {formateCurrency(
                pricing?.OverallTotal?.OverAllTotalAmountAfterTax ?? 0.0,
              )}
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
