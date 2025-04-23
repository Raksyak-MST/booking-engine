import { useSelector } from "react-redux";

function formateCurrency(num) {
  return new Intl.NumberFormat("en-IN", {
    currency: "INR",
    currencyDisplay: "symbol",
    style: "currency",
  }).format(num);
}

const PricingSummary = () => {
  const pickedPackageId = useSelector(
    (state) => state?.bookingQuery?.selectedPackageID,
  );
  const roomPicked = useSelector((state) => state.roomPick?.roomPicked);
  const roomSelection = useSelector((state) => state?.roomSelection);

  return (
    <div className="pt-20 border-light rounded-4 mt-30">
      <div className="text-20 fw-500 mb-20 px-20">Your price summary</div>
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
              <div className="text-15">{formateCurrency(room?.roomRate)}</div>
            </div>
          </div>
          {/* <div className="row y-gap-5 justify-between pt-5">
            <div className="col-auto">
              <div className="text-15">Taxes and fees</div>
            </div>
            <div className="col-auto">
              <div className="text-15">{formateCurrency(room?.TotalTax)}</div>
            </div>
          </div>
          <div className="row y-gap-5 justify-between pt-5">
            <div className="col-auto">
              <div className="text-15">Total Price (Inc. Of Taxes)</div>
            </div>
            <div className="col-auto">
              <div className="text-15">
                {formateCurrency(room?.TotalAmountAfterTax)}
              </div>
            </div>
          </div> */}
          {/* End .row */}
        </div>
      ))}
      <div className="px-20 py-20 bg-blue-2 rounded-4 mt-20">
        <div className="row y-gap-5 justify-between">
          <div className="col-auto">
            <div className="text-18 lh-13 fw-500">Price</div>
          </div>
          <div className="col-auto">
            <div className="text-18 lh-13 fw-500">{formateCurrency(0.0)}</div>
          </div>
        </div>
      </div>
      {/* End .row */}
    </div>
    // End px-30
  );
};

export default PricingSummary;
