
'use client'

import { hotelsData } from "../../../data/hotels";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import Image from "next/image";
import { priceFormatter } from "@/utils/textFormatter"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { bookingQueryActions, roomSelectionActions } from "@/store/store"
import { useRouter } from "next/navigation"
import { useState } from "react"

export const HotelProperties2 = () => {
  const availableRooms = useSelector(state => state.availableRooms)
  return (
    <>
      {availableRooms?.map((item, index) => (
        <div className="col-12 border-light mb-3 rounded p-3" key={index}>
          <div>
            <div className="row x-gap-20 y-gap-20">
              <div className="col-md-auto">
                <div className="cardImage ratio ratio-1:1 w-250 md:w-1/1 rounded-4">
                  <div className="cardImage__content">
                    <div className="cardImage-slider rounded-4  custom_inside-slider">
                      <Swiper
                        className="mySwiper"
                        modules={[Pagination, Navigation]}
                        pagination={{
                          clickable: true,
                        }}
                        navigation={true}
                      >
                        {item?.roomImages?.map((slide, i) => (
                          <SwiperSlide key={i}>
                            <Image
                              width={250}
                              height={250}
                              className="rounded-4 col-12 js-lazy"
                              src={slide}
                              alt="image"
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  </div>
                  {/* End image */}

                  <div className="cardImage__wishlist">
                    <button className="button -blue-1 bg-white size-30 rounded-full shadow-2">
                      <i className="icon-heart text-12"></i>
                    </button>
                  </div>
                </div>
              </div>
              {/* End .col */}

              <div className="col-md">
                <h3 className="text-18 lh-16 fw-500 mb-2">
                  {item?.roomTypeName}
                  <div className="d-inline-block ml-10">
                    <i className="icon-star text-10 text-yellow-2"></i>
                    <i className="icon-star text-10 text-yellow-2"></i>
                    <i className="icon-star text-10 text-yellow-2"></i>
                    <i className="icon-star text-10 text-yellow-2"></i>
                    <i className="icon-star text-10 text-yellow-2"></i>
                  </div>
                </h3>
                <div className="mb-2 d-flex flex-wrap gap-1">
                  {item?.roomDetails.map((lodging, index) => (
                    <div
                      key={index}
                      className="border-light rounded-100 px-2 text-12 bg-light-2"
                    >
                      {lodging}
                    </div>
                  ))}
                </div>
                <p className="text-14 lh-sm">{item?.description} </p>

                <div className="text-14 text-green-2 lh-15 mt-10">
                  <div className="fw-500">Free cancellation</div>
                  <div className="">
                    You can cancel later, so lock in this great price today.
                  </div>
                </div>
              </div>
            </div>
            <div className="row x-gap-10 y-gap-10 pt-20">
              {item?.roomAmenities?.map((amenities, index) => (
                <div key={index} className="col-auto">
                  <div className="border-light rounded-100 py-5 px-20 text-14 lh-14">
                    {amenities}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border-light p-3 rounded mt-2">
            <HotelPropertyDetails hotel={item} />
          </div>
        </div>
      ))}
    </>
  );
}

const HotelPropertyDetails = (props) => {
  const dispatch = useDispatch();
  const Router = useRouter();

  const { hotel } = props;

  const [selectedMealPlan, setSelectedMealPlan] = useState({});

  const roomPackages = hotel?.perNightCharges.map((roomPackage) => ({
    packageCode: roomPackage.packageCode,
    packageId: roomPackage.packageID,
    packageRate: roomPackage.rooms[0].packageRate,
  }));

  const handleMealPlanSelection = (e) => {
    const mealPlan = e.target.getAttribute("name");
    const packageId = e.target.getAttribute("id");
    setSelectedMealPlan({[mealPlan]: true});
    dispatch(
      bookingQueryActions.setBookingQuery({ selectedPackageID: packageId, selectedRoomTypeID: hotel?.roomTypeID })
    );
  }

  const handleRoomSelection = () => {
    dispatch(roomSelectionActions.setRoomSelection(hotel));
    Router.push("/booking-page")
  }

  return (
    <div className="y-gap-30">
      <div className="roomGrid -content--compact">
        <div>
          {/* <p className="text-15 fw-500 text-red-1">Rate Details</p> */}
          <p className="text-14 fw-500 mb-10">Select meal plan</p>
          <div className="radio-group">
            {roomPackages?.map((pack, index) => (
              <div key={index} onClick={handleMealPlanSelection}>
                <p
                  id={`${pack?.packageId}`}
                  className={`radio-label border-light rounded-100 px-3 text-14 ${
                    selectedMealPlan[pack.packageCode]
                      ? "bg-blue-1 text-white"
                      : ""
                  }`}
                  name={pack.packageCode}
                >
                  {pack?.packageCode}{" "}
                  {`(${new Intl.NumberFormat("en-IN", {
                    currency: "INR",
                    style: "currency",
                    currencyDisplay: "code"
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
