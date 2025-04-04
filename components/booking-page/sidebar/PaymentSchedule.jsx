import { useSelector } from 'react-redux'

const PaymentSchedule = () => {
  const selectedRoom = useSelector(state => state.roomSelection)
  const perNightCharges = selectedRoom?.perNightCharges?.filter(
    (pkg) => pkg?.packageCode == "AP" 
  )[0]?.rooms;

  const { TotalAmountAfterTax } = perNightCharges ? perNightCharges[0] : {} ; 

  return (
    <div className="px-30 py-30 border-light rounded-4 mt-30">
      <div className="text-20 fw-500 mb-20">Your payment schedule</div>
      <div className="row y-gap-5 justify-between">
        <div className="col-auto">
          <div className="text-15">Before you stay you&apos;ll pay</div>
        </div>
        {/* End col */}
        <div className="col-auto">
          <div className="text-15">
            {new Intl.NumberFormat("en-IN", {
              currency: "INR",
              currencyDisplay: "symbol",
              style: "currency",
            }).format(TotalAmountAfterTax)}
          </div>
        </div>
        {/* End col */}
      </div>
      {/* End row */}
    </div>
  );
};

export default PaymentSchedule;
