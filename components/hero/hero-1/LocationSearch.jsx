
'use client'

import { useState, memo, useEffect } from "react";
import { bookingQueryActions, useGetHotelDetailsWebBookingMutation, hotelDetailsActions } from "@/store/store"
import { useSelector, useDispatch } from "react-redux"

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [ getHotelDetailsWebBooking, options ] = useGetHotelDetailsWebBookingMutation()

  useEffect(() => {
    getHotelDetailsWebBooking()
  }, [])

  const hotelLocations = useSelector(state => state.hotelDetails?.locations)
  const selectedHotel = useSelector(state => state.hotelDetails?.selectedHotel)

  const dispatch = useDispatch()

  const handleOptionClick = (item) => {
    setSearchValue(item.name);
    setSelectedItem(item);
    dispatch(bookingQueryActions.setBookingQuery({ hotelID: item.id}))
    dispatch(hotelDetailsActions.setUserPickedHotelDetail(item))
  };

  return (
    <>
      <div className="searchMenu-loc px-30 lg:py-20 lg:px-0 js-form-dd js-liverSearch">
        <div
          data-bs-toggle="dropdown"
          data-bs-auto-close="true"
          data-bs-offset="0,22"
        >
          <h4 className="text-15 fw-500 ls-2 lh-16">Location *</h4>
          <div className="text-15 text-light-1 ls-2 lh-16">
            <input
              autoComplete="off"
              type="search"
              placeholder="Where are you going?"
              className="js-search js-dd-focus"
              value={selectedHotel?.name ?? ""}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>
        {/* End location Field */}

        <div className="shadow-2 dropdown-menu min-width-400">
          <div className="bg-white px-20 py-20 sm:px-0 sm:py-15 rounded-4">
            {options.isLoading ? (
              <div className="col-12 text-center">
                <div className="spinner-border" role="status"></div>
              </div>
            ) : (
              <ul className="y-gap-5 js-results">
                {hotelLocations.map((item) => (
                  <li
                    className={`-link d-block col-12 text-left rounded-4 px-20 py-15 js-search-option mb-1 ${
                      selectedHotel && selectedHotel?.id === item.id
                        ? "active"
                        : ""
                    }`}
                    key={item?.id}
                    role="button"
                    onClick={() => handleOptionClick(item)}
                  >
                    <div className="d-flex">
                      <div className="icon-location-2 text-light-1 text-20 pt-4" />
                      <div className="ml-10">
                        <div className="text-15 lh-12 fw-500 js-search-option-target">
                          {item?.name}
                        </div>
                        <div className="text-14 lh-12 text-light-1 mt-5">
                          {item?.address}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(SearchBar);
