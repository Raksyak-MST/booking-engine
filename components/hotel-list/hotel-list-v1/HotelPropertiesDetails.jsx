import { useState, memo, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector} from "react-redux";
import { roomSelectionActions, bookingQueryActions, useGetReservationJsonLikeEzeeWebBookingMutation } from "@/store/store";
import toast from "react-hot-toast";
import { ERROR_MESSAGES } from "@/data/error-messages";

const DEFAULT_ROOM_RATE = 0.0;

const HotelPropertyDetails = (props) => {
  const { hotel } = props;
  const [selectedMealPlan, setSelectedMealPlan] = useState({ EP: true, type: "EP" }); // default selected package name
  const [roomRate, setRoomRate] = useState(DEFAULT_ROOM_RATE);
  const [ getReservationJsonLikeEzee, options ] = useGetReservationJsonLikeEzeeWebBookingMutation();
  const reservationInfo = useSelector(state => state.reservationInfo)

  const dispatch = useDispatch();
  const Router = useRouter();

  const roomPackages = hotel?.perNightCharges?.map((roomPackage) => ({
    packageCode: roomPackage.packageCode,
    packageId: roomPackage.packageID,
    packageRate: roomPackage.rooms[0]?.packageRate,
    fulltotal: roomPackage.rooms[0]?.fulltotal,
  }));

  useMemo(() => {
    const pkg = roomPackages
      ?.filter((pkg) => pkg.packageCode === selectedMealPlan.type)
      .pop();
    const EPPackage = roomPackages
      ?.filter((pkg) => pkg.packageCode === "EP")
      .pop();
    const roomAndPackageRate = parseInt(pkg?.fulltotal);
    const DefaultESPackageRate = parseInt(EPPackage?.fulltotal);
    setRoomRate(roomAndPackageRate ?? DefaultESPackageRate);
  }, [selectedMealPlan]);

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

  const handleRoomSelection = async () => {

    // FIXME: clean after payment successful 
    // localStorage.setItem("userRoomTypeID", hotel?.roomTypeID);
    // localStorage.setItem("userPickedHotel", JSON.stringify(hotel))

    dispatch(roomSelectionActions.setRoomSelection(hotel));
    dispatch(
      roomSelectionActions.setRoomSelection({
        selectedRoomTypeID: hotel?.roomTypeID,
      })
    );
    toast
      .promise(
        getReservationJsonLikeEzee({
          ...reservationInfo,
          selectedRoomTypeID: hotel?.roomTypeID,
        }).unwrap(),
        {
          loading: "Loading...",
          success: "Redirecting to booking page",
          error: ERROR_MESSAGES.API_FAILED_DEFAULT_MESSAGE,
        }
      )
      .then(() => {
        Router.push("/booking-page");
      });
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
                    currencyDisplay: "symbol",
                  }).format(pack?.packageRate)})`}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-6">
          <p className="text-18 fw-500 text-md-end">
            {new Intl.NumberFormat("en-IN", {
              currencyDisplay: "symbol",
              currency: "INR",
              style: "currency",
            }).format(roomRate)}
          </p>
          <p className="text-13 text-light-1 text-md-end">Per Night</p>
          <p className="text-light-1 text-14 text-md-end">{`${hotel?.adults} adults, ${hotel?.children} children and ${hotel?.roomQuantity} room`}</p>
          <div
            className="button -md -dark-1 bg-blue-1 text-white cursor-pointer"
            onClick={handleRoomSelection}
          >
            BOOK NOW
          </div>
        </div>
      </div>
      {/* End room Grid horizontal content */}
    </div>
  );
};

export default memo(HotelPropertyDetails);
