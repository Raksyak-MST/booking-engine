import { useState, memo, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  roomSelectionActions,
  searchQueryActions,
  guestRoomActions,
  useGetReservationJsonLikeEzeeWebBookingMutation,
} from "@/store/store";
import toast from "react-hot-toast";
import { ERROR_MESSAGES } from "@/data/error-messages";

const DEFAULT_ROOM_RATE = 0.0;

const HotelPropertyDetails = (props) => {
  const { hotel } = props;
  const [selectedMealPlan, setSelectedMealPlan] = useState({
    EP: true,
    type: "EP",
  }); // default selected package name
  const [roomRate, setRoomRate] = useState(DEFAULT_ROOM_RATE);
  const [perNight, setPerNight] = useState(DEFAULT_ROOM_RATE);
  const [getReservationJsonLikeEzee, options] =
    useGetReservationJsonLikeEzeeWebBookingMutation();
  const reservationInfo = useSelector((state) => state.reservationInfo);
  const currentRoom = useSelector((state) => state.roomPick?.currentRoom);

  const dispatch = useDispatch();
  const Router = useRouter();

  const roomPackages = hotel?.perNightCharges?.map((roomPackage) => ({
    packageCode: roomPackage.packageCode,
    packageDescription: roomPackage.PackageDescription,
    packageId: roomPackage.packageID,
    packageRate: roomPackage.rooms[0]?.packageRate,
    rentPreTax: roomPackage.rooms[0]?.RentPreTax,
    fullTotal: roomPackage.rooms[0]?.fulltotal,
  }));

  useMemo(() => {
    const pkg = roomPackages
      ?.filter((pkg) => pkg.packageCode === selectedMealPlan.type)
      .slice(0, 1)
      .pop();
    const EPPackage = roomPackages
      ?.filter((pkg) => pkg.packageCode === "EP")
      .slice(0, 1)
      .pop();
    const roomAndPackageRate = parseInt(pkg?.fullTotal);
    const DefaultESPackageRate = parseInt(EPPackage?.fullTotal);

    const perNightRate = parseInt(pkg?.rentPreTax ?? EPPackage?.rentPreTax);

    setRoomRate(roomAndPackageRate ?? DefaultESPackageRate);
    setPerNight(perNightRate);
  }, [selectedMealPlan]);

  const handleMealPlanSelection = (e) => {
    const mealPlan = e.currentTarget.getAttribute("name");
    const packageId = e.currentTarget.getAttribute("id") ?? "";
    setSelectedMealPlan({
      [mealPlan]: true,
      type: mealPlan,
      packageId: packageId,
    });
    dispatch(
      searchQueryActions.setBookingQuery({
        selectedPackageID: packageId,
        selectedRoomTypeID: hotel?.roomTypeID,
      }),
    );
  };

  const handleRoomSelection = async () => {
    dispatch(roomSelectionActions.setRoomSelection(hotel));
    dispatch(
      guestRoomActions.pickRoom({
        adults: currentRoom?.adults,
        children: currentRoom?.children,
        selectedRoomOptions: currentRoom?.name,
        roomTypeID: hotel?.roomTypeID,
        roomTypeName: hotel?.roomTypeName,
        perNightRate: perNight,
        roomRate: roomRate,
        selectedPackageID: selectedMealPlan?.packageId,
      }),
    );
    toast.success(`You have selected ${currentRoom?.name}`);
  };

  return (
    <div className="y-gap-30">
      <div className="row y-gap-10 items-end">
        <div className="col-md-8 align-self-start">
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
                  {pack?.packageDescription}{" "}
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
        <div className="col-md-4 d-flex flex-column gap-md-2">
          <div>
            <p className="text-18 fw-500 text-md-end">
              {new Intl.NumberFormat("en-IN", {
                currencyDisplay: "symbol",
                currency: "INR",
                style: "currency",
              }).format(roomRate)}
            </p>
            <p className="text-13 text-light-1 text-md-end">
              {new Intl.NumberFormat("en-IN", {
                currency: "INR",
                style: "currency",
                currencyDisplay: "symbol",
              }).format(perNight)}{" "}
              / Per Night
            </p>
            <p className="text-12 text-md-end">tax excluded</p>
          </div>
          <div
            className="button -md -dark-1 bg-blue-1 text-white cursor-pointer align-self-md-end"
            onClick={handleRoomSelection}
          >
            Select
          </div>
        </div>
      </div>
      {/* End room Grid horizontal content */}
    </div>
  );
};

export default memo(HotelPropertyDetails);
