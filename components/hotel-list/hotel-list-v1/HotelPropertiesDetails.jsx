import { useState, memo, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector} from "react-redux";
import { roomSelectionActions, bookingQueryActions } from "@/store/store";

const DEFAULT_ROOM_RATE = 0.0;

const HotelPropertyDetails = (props) => {
  const { hotel } = props;
  const [selectedMealPlan, setSelectedMealPlan] = useState({ EP: true, type: "EP" }); // default selected package name
  const [roomRate, setRoomRate] = useState(DEFAULT_ROOM_RATE);
  const bookingQuery = useSelector((state) => state.bookingQuery);

  const dispatch = useDispatch();
  const Router = useRouter();

  const roomPackages = hotel?.perNightCharges?.map((roomPackage) => ({
    packageCode: roomPackage.packageCode,
    packageId: roomPackage.packageID,
    packageRate: roomPackage.rooms[0]?.packageRate,
    TotalAmountBeforeTax: roomPackage.rooms[0]?.TotalAmountBeforeTax,
  }));

  useMemo(() => {
  const pkg = roomPackages
    ?.filter((pkg) => pkg.packageCode === selectedMealPlan.type)
    .pop();

    const EPPackage = roomPackages
      .filter((pkg) => pkg.packageCode === "EP")
      .pop();

    setRoomRate(
       pkg?.TotalAmountBeforeTax + pkg?.packageRate ??
       EPPackage?.TotalAmountBeforeTax + EPPackage?.packageRate
    );
  }, [selectedMealPlan])

  const handleMealPlanSelection = (e) => {
    const mealPlan = e.currentTarget.getAttribute("name");
    const packageId = e.currentTarget.getAttribute("id") ?? "";
    setSelectedMealPlan({ [mealPlan]: true, type: mealPlan });
    dispatch(
      bookingQueryActions.setBookingQuery({
        selectedPackageID: packageId,
        selectedRoomTypeID: hotel?.roomTypeID,
      })
    );
  };

  const handleRoomSelection = () => {
    dispatch(roomSelectionActions.setRoomSelection(hotel));
    dispatch(
      roomSelectionActions.setRoomSelection({
        selectedRoomTypeID: hotel?.roomTypeID,
      })
    );
    Router.push("/booking-page");
  };

  return (
    <div className="y-gap-30">
      <div className="row y-gap-10 items-end">
        <div className="col-md-6">
          {/* <p className="text-15 fw-500 text-red-1">Rate Details</p> */}
          <p className="text-14 fw-500 mb-10">Select meal plan</p>
          <div className="radio-group">
            {roomPackages?.map((pack, index) => (
              <div
                id={`${pack?.packageId}`}
                key={pack?.packageId}
                onClick={handleMealPlanSelection}
                name={pack?.packageCode}
              >
                <p
                  className={`d-flex gap-1 items-center radio-label border-light rounded-100 px-3 py-1 text-14 ${
                    selectedMealPlan[pack?.packageCode]
                      ? "bg-blue-1 text-white"
                      : ""
                  }`}
                  name={pack?.packageCode}
                >
                  {pack?.packageCode}{" "}
                  {`(${new Intl.NumberFormat("en-IN", {
                    currency: "INR",
                    style: "currency",
                    currencyDisplay: "code",
                  }).format(pack?.packageRate)})`}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-6">
          <p className="text-18 text-end fw-500">
            {new Intl.NumberFormat("en-IN", {
              currencyDisplay: "code",
              currency: "INR",
              style: "currency",
            }).format(roomRate)}
          </p>
          <p className="text-light-1 text-14 text-end">{`${hotel?.adults} adults, ${hotel?.children} children and ${hotel?.roomQuantity} room`}</p>
          <div
            className="button -md -dark-1 bg-blue-1 text-white cursor-pointer"
            onClick={handleRoomSelection}
          >
            BOOK NOW
          </div>
        </div>
      </div>
      {/* End romm Grid horizontal content */}
    </div>
  );
};

export default memo(HotelPropertyDetails);
