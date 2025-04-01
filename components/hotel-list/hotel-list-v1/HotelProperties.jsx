'use client'

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import Image from "next/image";
import { useSelector } from "react-redux"
import { useState, useEffect } from "react"
import HotelPropertiesDetails from "./HotelPropertiesDetails"
import RoomAmenities from "./RoomAmenities"
import { usePathname } from 'next/navigation'
import {useGetDataForWebBookingMutation  } from "@/store/store"

export const HotelProperties2 = () => {
  const [ truncateOnSmallScreen, setTruncateOnMobile ] = useState(false);
  const pathname = usePathname()
  
  const availableRooms = useSelector(state => state.availableRooms)
  const bookingQuery = useSelector((state) => state.bookingQuery);
  const [ getDataForWebBooking, options ] = useGetDataForWebBookingMutation();

  useEffect(() => {
    // need to refetch after coming back from next step, this has to be done manually.
    if(pathname.includes("hotel-list-v1")){
      getDataForWebBooking(bookingQuery)
    }
  }, [pathname])

  useEffect(() => {
    const updateLines = () => {
      const width = window.innerWidth;
      if (width > 1024) {
        setTruncateOnMobile(false);
      } else if(width < 768) {
        setTruncateOnMobile(true);
      }
    }

    updateLines();
    window.addEventListener('resize', updateLines)
    return () => window.removeEventListener('resize', updateLines)
  }, [])

  if(options.isError && availableRooms.length === 0){
    return (
      <div className="col-12 text-center">
        <h2>Sorry, No Rooms for this Search</h2>
        <p>
          We cannnot find any rooms for your search. Please modify your search criteria and try again.
        </p>
      </div>
    );
  }

  return (
    <>
    {/* TODO: Add a loader handler to show loader while fetching data */}
      {options?.isLoading ? <Loader />: availableRooms?.map((item, index) => (
        <div className="col-12 border-light mb-3 rounded p-3" key={index}>
          <div>
            <div className="row x-gap-20 y-gap-20">
              <div className="col-md-auto">
                <div className="cardImage ratio ratio-1:1 w-250 md:w-1/1 rounded-4 bg-light-2">
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
            {truncateOnSmallScreen ? (
              <RoomAmenities data={item?.roomAmenities} truncate={5} />
            ) : (
              <RoomAmenities data={item?.roomAmenities} />
            )}
          </div>
          <div className="border-light p-3 rounded mt-2">
            <HotelPropertiesDetails hotel={item} />
          </div>
        </div>
      ))}
    </>
  );
}

const Loader = () => {
  return (
    <div className="col-12 text-center">
      <div className="spinner-border" role="status"></div>
    </div>
  )
}
