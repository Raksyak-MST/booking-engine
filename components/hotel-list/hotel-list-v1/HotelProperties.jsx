
'use client'

import { hotelsData } from "../../../data/hotels";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import Image from "next/image";
import { priceFormatter } from "@/utils/textFormatter"
import { useSelector } from "react-redux"

const HotelProperties = () => {
  return (
    <>
      {hotelsData.slice(0, 7).map((item) => (
        <div className="col-12 border-light mb-3 rounded p-3" key={item?.id}>
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
                        {item?.slideImg?.map((slide, i) => (
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
                <h3 className="text-18 lh-16 fw-500">
                  {item?.title}
                  <br className="lg:d-none" /> {item?.location}
                  <div className="d-inline-block ml-10">
                    <i className="icon-star text-10 text-yellow-2"></i>
                    <i className="icon-star text-10 text-yellow-2"></i>
                    <i className="icon-star text-10 text-yellow-2"></i>
                    <i className="icon-star text-10 text-yellow-2"></i>
                    <i className="icon-star text-10 text-yellow-2"></i>
                  </div>
                </h3>

                <div className="row x-gap-10 y-gap-10 items-center pt-10">
                  <div className="col-auto">
                    <p className="text-14">{item?.location}</p>
                  </div>

                  <div className="col-auto">
                    <button
                      data-x-click="mapFilter"
                      className="d-block text-14 text-blue-1 underline"
                    >
                      Show on map
                    </button>
                  </div>

                  <div className="col-auto">
                    <div className="size-3 rounded-full bg-light-1"></div>
                  </div>

                  <div className="col-auto">
                    <p className="text-14">2 km to city center</p>
                  </div>
                </div>

                <div className="text-14 lh-15 mt-20">
                  <div className="fw-500">King Room</div>
                  <div className="text-light-1">1 extra-large double bed</div>
                </div>

                <div className="text-14 text-green-2 lh-15 mt-10">
                  <div className="fw-500">Free cancellation</div>
                  <div className="">
                    You can cancel later, so lock in this great price today.
                  </div>
                </div>

                <div className="row x-gap-10 y-gap-10 pt-20">
                  <div className="col-auto">
                    <div className="border-light rounded-100 py-5 px-20 text-14 lh-14">
                      Breakfast
                    </div>
                  </div>

                  <div className="col-auto">
                    <div className="border-light rounded-100 py-5 px-20 text-14 lh-14">
                      WiFi
                    </div>
                  </div>

                  <div className="col-auto">
                    <div className="border-light rounded-100 py-5 px-20 text-14 lh-14">
                      Spa
                    </div>
                  </div>

                  <div className="col-auto">
                    <div className="border-light rounded-100 py-5 px-20 text-14 lh-14">
                      Bar
                    </div>
                  </div>
                </div>
              </div>
              {/* End .col-md */}

              <div className="col-md-auto text-right md:text-left">
                <div className="row x-gap-10 y-gap-10 justify-end items-center md:justify-start">
                  <div className="col-auto">
                    <div className="text-14 lh-14 fw-500">Exceptional</div>
                    <div className="text-14 lh-14 text-light-1">
                      3,014 reviews
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="flex-center text-white fw-600 text-14 size-40 rounded-4 bg-blue-1">
                      {item?.ratings}
                    </div>
                  </div>
                </div>

                <div className="">
                  <div className="text-14 text-light-1 mt-50 md:mt-20">
                    8 nights, 2 adult
                  </div>
                  <div className="text-22 lh-12 fw-600 mt-5">
                    US${item?.price}
                  </div>
                  <div className="text-14 text-light-1 mt-5">
                    +US$828 taxes and charges
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-light p-3 rounded mt-2">
            <HotelPropertyDetails hotel={item}/>
          </div>
        </div>
      ))}
    </>
  );
};

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
  const { hotel } = props;
  const roomPackages = hotel?.perNightCharges.map((roomPackage) => ({
    packageCode: roomPackage.packageCode,
    packageId: roomPackage.packageId
  }));
  const roomRates = hotel?.perNightCharges.map((roomPackage) =>
    roomPackage?.rooms?.map((room, index) => (
      <option key={index} value={index}>
        ({room?.packageCode}) {priceFormatter(room?.TotalAmountBeforeTax)}
      </option>
    ))
  );
  return (
    <div className="y-gap-30">
      <div className="roomGrid -content--compact">
        <div>
          <div className="text-15 fw-500 mb-10">Packages</div>
          <div className="dropdown js-dropdown js-price-1-active">
            <select className="form-select dropdown__button d-flex items-center rounded-4 border-light px-15 h-50 text-14">
              {...roomRates}
            </select>
          </div>
        </div>
        <div>
          <p className="text-15 fw-500 mb-10">Select meal plan</p>
          <div className="radio-group">
            {roomPackages?.map((pack, index) => (
              <div key={index}>
                <input
                  type="radio"
                  id="AB"
                  name="meal"
                  className="radio-input"
                />
                <label
                  htmlFor="AB"
                  className="radio-label border-light rounded-100 px-3 text-14"
                >
                  {pack?.packageCode}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div
          className="button -md -dark-1 bg-blue-1 text-white cursor-pointer"
          onClick={() => {
            console.log(hotel);
          }}
        >
          BOOK NOW
        </div>
      </div>
      {/* End romm Grid horizontal content */}
    </div>
  );
};

export default HotelProperties;
