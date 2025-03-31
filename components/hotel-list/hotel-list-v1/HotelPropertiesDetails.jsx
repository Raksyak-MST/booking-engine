import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector} from "react-redux";
import { roomSelectionActions, bookingQueryActions } from "@/store/store";

const HotelPropertyDetails = (props) => {
  const { hotel } = props;
  const [selectedMealPlan, setSelectedMealPlan] = useState({ EP: true }); // default selected package name
  const bookingQuery = useSelector((state) => state.bookingQuery);

  const dispatch = useDispatch();
  const Router = useRouter();

  const roomPackages = hotel?.perNightCharges.map((roomPackage) => ({
    packageCode: roomPackage.packageCode,
    packageId: roomPackage.packageID,
    packageRate: roomPackage.rooms[0].packageRate,
  }));

  const handleMealPlanSelection = (e) => {
    const mealPlan = e.currentTarget.getAttribute("name");
    const packageId = e.currentTarget.getAttribute("id") ?? "";
    setSelectedMealPlan({ [mealPlan]: true });
    dispatch(
      bookingQueryActions.setBookingQuery({
        selectedPackageID: packageId,
        selectedRoomTypeID: hotel?.roomTypeID,
      })
    );
  };

  const handleRoomSelection = () => {
    dispatch(roomSelectionActions.setRoomSelection(hotel));
    Router.push("/booking-page");
    // FIXME: this is a hack to make the booking page work.
    localStorage.setItem(
      "bookingQuery",
      JSON.stringify(
        Object.assign({ ...bookingQuery }, { guestDetails: { PromoCode: "" } })
      )
    );
  };

  return (
    <div className="y-gap-30">
      <div className="roomGrid -content--compact">
        <div>
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
        <div
          className="button -md -dark-1 bg-blue-1 text-white cursor-pointer"
          onClick={handleRoomSelection}
        >
          BOOK NOW
        </div>
      </div>
      {/* End romm Grid horizontal content */}
    </div>
  );
};

export default HotelPropertyDetails;
