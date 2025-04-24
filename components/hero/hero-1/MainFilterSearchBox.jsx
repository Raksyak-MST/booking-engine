"use client";

import { useSelector } from "react-redux";
import DateSearch from "../DateSearch";
import GuestSearch from "./GuestSearch";
import { useRouter } from "next/navigation";
import { useGetDataForWebBookingMutation } from "@/store/store";
import LocationSearch from "./LocationSearch";
import toast from "react-hot-toast";
import { ERROR_MESSAGES } from "@/data/error-messages";
import moment from "moment";

const MainFilterSearchBox = () => {
  const Router = useRouter();
  const searchQuery = useSelector((state) => state.searchQuery);
  const currentRoom = useSelector((state) => state.guestRoom.currentRoom);
  const [getDataForWebBooking, options] = useGetDataForWebBookingMutation();

  const handleSearch = async () => {
    if (!searchQuery.hotelID) {
      toast.error("Please select a hotel");
      return;
    }

    if (
      searchQuery.arrivalDate == "Invalid date" ||
      searchQuery.departureDate == "Invalid date"
    ) {
      toast.error("Please select check-in check-out date");
      return;
    }

    try {
      await getDataForWebBooking({
        ...searchQuery,
        adults: currentRoom?.adults,
        children: currentRoom?.children,
      });
      Router.push("/room-types");
    } catch (error) {
      console.error(error);
      toast.error(ERROR_MESSAGES.API_FAILED_DEFAULT_MESSAGE);
    }
  };

  return (
    <>
      <div className="position-relative mt-30 md:mt-20">
        <div className="mainSearch bg-white px-10 py-10 lg:px-20 lg:pt-5 lg:pb-20 rounded">
          <div className="button-grid --compact-5 items-center">
            <LocationSearch />
            {/* End Location */}
            <div className="searchMenu-date px-30 lg:py-20 lg:px-0 js-form-dd js-calendar">
              <div>
                <h4 className="text-15 fw-500 ls-2 lh-16">
                  Check in - Check out
                </h4>
                <DateSearch />
              </div>
            </div>
            {/* End check-in-out */}

            <GuestSearch />
            {/* End guest */}

            <div className="button-item">
              <button
                className="mainSearch__submit button -dark-1 h-60 px-35 col-12 rounded bg-blue-1 text-white gap-2"
                onClick={handleSearch}
              >
                {options.isLoading ? (
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                  >
                    <span className="sr-only"></span>
                  </div>
                ) : (
                  <i className="icon-search text-20 mr-10" />
                )}
                Search
              </button>
            </div>
            {/* End search button_item */}
          </div>
        </div>
        {/* End .mainSearch */}
      </div>
    </>
  );
};

export default MainFilterSearchBox;
