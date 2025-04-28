"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import HotelPropertiesDetails from "./HotelPropertiesDetails";
import RoomAmenities from "./RoomAmenities";
import { useGetDataForWebBookingMutation } from "@/store/store";
import { Loader } from "./Loader";

export const HotelProperties2 = () => {
  const roomList = useSelector((state) => state.roomList.roomTypes);
  const searchQuery = useSelector((state) => state.searchQuery);
  const [getDataForWebBooking, options] = useGetDataForWebBookingMutation();

  useEffect(() => {
    // need to refetch after coming back from next step, this has to be done manually
    getDataForWebBooking(searchQuery);
  }, []);

  if (options?.isError) {
    return (
      <div className="col-12 text-center">
        <h2>Look like our service is down</h2>
        <p>
          We cannnot find any rooms for your search. Please try after some time.
        </p>
      </div>
    );
  }

  if (options?.isLoading) {
    return <Loader />;
  }

  if (roomList?.length === 0) {
    return (
      <div className="col-12 text-center">
        <h2>Sorry, No Rooms for this Search</h2>
        <p>
          We cannnot find any rooms for your search. Please modify your search
          criteria and try again.
        </p>
      </div>
    );
  }

  return roomList?.map((item, index) => (
    <div className="col-12 border-light mb-3 rounded p-3" key={index}>
      <div>
        <div className="row x-gap-20 y-gap-20">
          <div className="col-md-auto">
            <div className="cardImage ratio ratio-1:1 w-250 md:w-1/1 rounded-4 bg-light-2">
              <div className="cardImage__content">
                <div className="cardImage-slider rounded-4  custom_inside-slider h-full">
                  <Swiper
                    className="mySwiper h-full"
                    modules={[Pagination, Navigation]}
                    pagination={{
                      clickable: true,
                    }}
                    navigation={true}
                  >
                    {item?.roomImages?.map((slide, i) => (
                      <SwiperSlide key={i} className="h-full">
                        <Image
                          width={250}
                          height={250}
                          className="rounded-4 col-12 js-lazy h-full object-fit-cover"
                          style={{ objectPosition: "left center" }}
                          src={
                            slide.includes("http")
                              ? slide
                              : "/img/hotels/default-hotel.jpg"
                          }
                          alt="image"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
              {/* End image */}
            </div>
          </div>
          {/* End .col */}
          <div className="col-md">
            <h3 className="text-18 lh-16 fw-500 mb-2">
              <span>{item?.roomTypeName}</span>
              <div className="d-inline-block ml-10 mr-10">
                <i className="icon-star text-10 text-yellow-2"></i>
                <i className="icon-star text-10 text-yellow-2"></i>
                <i className="icon-star text-10 text-yellow-2"></i>
                <i className="icon-star text-10 text-yellow-2"></i>
                <i className="icon-star text-10 text-yellow-2"></i>
              </div>
            </h3>
            <div className="mb-2 d-flex flex-wrap gap-1">
              {item?.roomDetails?.map((lodging, index) => (
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
            <RoomAmenities data={item?.roomAmenities} truncate={4} />
          </div>
        </div>
      </div>
      <div className="border-light p-3 rounded mt-2">
        <HotelPropertiesDetails hotel={item} />
      </div>
    </div>
  ));
};
