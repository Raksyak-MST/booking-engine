"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bookingQueryActions, roomPickActions } from "@/store/store";
import { useEffect } from "react";

const Counter = ({
  name,
  title,
  defaultValue,
  count,
  increment = () => {},
  decrement = () => {},
  other = {},
}) => {
  return (
    <>
      <div className="row y-gap-10 justify-between items-center">
        <div className="col-auto">
          <div className="text-15 lh-12 fw-500">{title}</div>
          {title === "Children" && (
            <div className="text-14 lh-12 text-light-1 mt-5">{other?.rule}</div>
          )}
          <div className="text-12 text-light-1">{other?.description}</div>
        </div>
        {/* End .col-auto */}
        <div className="col-auto">
          <div className="d-flex items-center js-counter">
            <button
              className="button -outline-blue-1 text-blue-1 size-38 rounded-4 js-down"
              onClick={decrement}
            >
              <i className="icon-minus text-12" />
            </button>
            {/* decrement button */}
            <div className="flex-center size-20 ml-15 mr-15">
              <div className="text-15 js-count">{count}</div>
            </div>
            {/* counter text  */}
            <button
              className="button -outline-blue-1 text-blue-1 size-38 rounded-4 js-up"
              onClick={increment}
            >
              <i className="icon-plus text-12" />
            </button>
            {/* increment button */}
          </div>
        </div>
        {/* End .col-auto */}
      </div>
      {/* End .row */}
      <div className="border-top-light mt-24 mb-24" />
    </>
  );
};

const GuestSearch = () => {
  const state = useSelector((state) => state.bookingQuery);
  const dispatch = useDispatch();

  useEffect(() => {
    // FIXME: create a new room option after the state is updated this ensures
    // it will run after the state is been updated.
    dispatch(
      roomPickActions.createRoomOption({
        id: state.quantity,
        name: `Room${state.quantity}`,
      }),
    );
  }, [state?.quantity]);

  return (
    <div className="searchMenu-guests px-30 lg:py-20 lg:px-0 js-form-dd js-form-counters position-relative">
      <div
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        aria-expanded="false"
        data-bs-offset="0,22"
      >
        <h4 className="text-15 fw-500 ls-2 lh-16">Guest</h4>
        <div className="text-15 text-light-1 ls-2 lh-16">
          <span className="js-count-adult">{state.adults}</span> adults -{" "}
          <span className="js-count-child">{state.children}</span> childeren -{" "}
          <span className="js-count-room">{state.quantity}</span> room
        </div>
      </div>
      {/* End guest */}

      <div className="shadow-2 dropdown-menu min-width-400">
        <div className="bg-white px-30 py-30 rounded-4 counter-box">
          <Counter
            name="adults"
            title="Adults"
            defaultValue={1}
            count={state?.adults}
            increment={(e) =>
              dispatch(bookingQueryActions.onAdultChange(state?.adults + 1))
            }
            decrement={(e) =>
              dispatch(bookingQueryActions.onAdultChange(state?.adults - 1))
            }
            other={{ description: "Per room max 2 Adults" }}
          />
          <Counter
            name="children"
            title="Children"
            defaultValue={state?.children}
            count={state?.children}
            increment={(e) => {
              dispatch(
                bookingQueryActions.onChildrenChange(state?.children + 1),
              );
            }}
            decrement={(e) =>
              dispatch(
                bookingQueryActions.onChildrenChange(state?.children - 1),
              )
            }
            other={{
              description: "Per room max 3 Children",
              rule: "Ages 0 - 17",
            }}
          />
          <Counter
            name="quantity"
            title="Rooms"
            defaultValue={1}
            count={state?.quantity}
            increment={(e) => {
              dispatch(bookingQueryActions.onRoomChange(state?.quantity + 1));
            }}
            decrement={(e) => {
              dispatch(roomPickActions.removeRoom());
              dispatch(
                bookingQueryActions.onRoomChange(
                  Math.max(1, state?.quantity - 1),
                ),
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default GuestSearch;
