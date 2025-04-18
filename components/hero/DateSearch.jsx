
'use client'

import React, { useState, useCallback } from "react";
import DatePicker from "react-multi-date-picker";
import { useDispatch, useSelector } from 'react-redux'
import { bookingQueryActions } from "@/store/store"
import moment from "moment";

const DateSearch = () => {
  const dispatch = useDispatch();
  const {arrivalDate, departureDate } = useSelector(state => state.bookingQuery)

  const [dates, setDates] = useState(() => {
    // fetch from the store if uer has picked date from previous page
    if (arrivalDate && departureDate) {
      return [new Date(arrivalDate), new Date(departureDate)];
    }
    return [new Date(), new Date()];
  });

  const handleDatePick = useCallback((event) => {
    if (!Array.isArray(event)) return;
    setDates(event)
    dispatch(
      bookingQueryActions.setBookingQuery({
        arrivalDate: event[0],
        departureDate: event[1],
      })
    );
  }, [dispatch])

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
        minDate={new Date()}
      />
    </div>
  );
};

export default React.memo(DateSearch);
