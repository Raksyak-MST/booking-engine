
'use client'

import {useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import DateSearch from "../DateSearch";
import GuestSearch from "./GuestSearch";
import LocationSearch from "./LocationSearch";
import { useRouter } from "next/navigation";
import { URL } from "@/data/urls"
import { setIsUserLogin, setBookingData, useGetDataForWebBookingMutation } from "@/store/store"

const MainFilterSearchBox = () => {
  const Router = useRouter()
  const dispatch = useDispatch();
  const state = useSelector(state => state.auth)
  const bookingState = useSelector(state => state.booking);
  const [getDataForWebBooking, options] = useGetDataForWebBookingMutation()

  useEffect(() => {
    const fetchUserCookies = async () => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      const urlencoded = new URLSearchParams();
      urlencoded.append("userName", "ramesh");
      urlencoded.append("password", "ramesh@123");
      urlencoded.append("hotelid", "10");
      urlencoded.append("companyCode", "ALLILAD");

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
      };

      fetch(URL.LOGIN, requestOptions)
        .then((response) => {
          if(response.ok){
            console.log("Login response: ", response)
            return response.json();
          }else{
            throw new Error("Not logged in.", response)
          }
        })
        .then((result) => {
          console.log(result);
          dispatch(setIsUserLogin(true))
        })
        .catch((error) => console.error(error));
   }
    console.log(state)
    if(!state.isLogin){
      fetchUserCookies()
    }
  })

  return (
    <>
      <div className="position-relative mt-30 md:mt-20">
        <div className="mainSearch bg-white px-10 py-10 lg:px-20 lg:pt-5 lg:pb-20 rounded">
          <div className="button-grid items-center">
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
                className="mainSearch__submit button -dark-1 h-60 px-35 col-12 rounded bg-blue-1 text-white"
                onClick={() => {
                  dispatch(setBookingData({hotelId: 10}))
                  getDataForWebBooking(bookingState)
                }}
              >
                <i className="icon-search text-20 mr-10" />
                Book Now 
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
