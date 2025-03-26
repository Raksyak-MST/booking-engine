
'use client'

import React, { useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { useDispatch } from 'react-redux'
import { setBookingData } from "@/store/store"
import { dateFormatter } from "@/utils/textFormatter"

const DateSearch = () => {
  // const [dates, setDates] = useState([
  //   new DateObject({ year: 2023, month: 1, day: 22 }),
  //   "December 09 2020",
  //   1597994736000, //unix time in milliseconds (August 21 2020)
  // ]);
  const dispatch = useDispatch();
  const [dates, setDates] = useState([
    new DateObject().setDay(5),
    new DateObject().setDay(14).add(1, "month"),
  ]);

  const handleDatePick = (event) => {
    console.log(event)
    setDates(event)
    if (!Array.isArray(event)) return;
    const checkInCheckout = event.map((date) => new Date(date));
    const checkIn = checkInCheckout[0],
      checkOut = checkInCheckout[1];
    dispatch(
      setBookingData({
        arrivalDate: dateFormatter(checkIn),
        departureDate: dateFormatter(checkOut),
      })
    );
  }

  return (
    <div className="text-15 text-light-1 ls-2 lh-16 custom_dual_datepicker">
      <DatePicker
        inputClass="custom_input-picker"
        containerClassName="custom_container-picker"
        value={dates}
        onChange={handleDatePick}
        numberOfMonths={2}
        offsetY={10}
        range
        rangeHover
        format="MMMM DD"
      />
    </div>
  );
};

export default DateSearch;
