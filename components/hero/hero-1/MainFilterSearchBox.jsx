
'use client'

import {useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import DateSearch from "../DateSearch";
import GuestSearch from "./GuestSearch";
import LocationSearch from "./LocationSearch";
import { useRouter } from "next/navigation";
import { useGetDataForWebBookingMutation } from "@/store/store"
import { setBookingData } from "@/store/store"

const MainFilterSearchBox = () => {
  const Router = useRouter()
  const bookingState = useSelector(state => state.booking);
  const dispatch = useDispatch()
  const [getDataForWebBooking, options] = useGetDataForWebBookingMutation()
  const { companyCode } = useSelector(state => state.booking)

  return (
    <>
      <div className="position-relative mt-30 md:mt-20">
        <div className="mainSearch bg-white px-10 py-10 lg:px-20 lg:pt-5 lg:pb-20 rounded">
          <div className="button-grid --compact-5 items-center">
            {/* <LocationSearch /> */}
            {/* End Location */}
            <div className="px-30 lg:py-20 lg:px-0 js-form-dd js-liverSearch">
                <h4 className="text-15 fw-500 ls-2 lh-16">Company code</h4>
              <input className="text-15 text-light-1 ls-2 lh-16" placeholder="Enter company code" value={companyCode} onChange={(event) => {
                dispatch(setBookingData({companyCode: event?.target?.value?.toUpperCase()}))
              }}/>
            </div>
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
                className="mainSearch__submit button -dark-1 h-60 px-35 col-12 rounded bg-blue-1 text-white"
                onClick={() => {
                  getDataForWebBooking(bookingState)
                  Router.push("/hotel-list-v1")
                }}
              >
                <i className="icon-search text-20 mr-10" />
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
