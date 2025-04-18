"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bookingQueryActions, roomPickActions } from "@/store/store";
import { useEffect } from "react";

const GuestSearch = () => {
  const state = useSelector((state) => state.bookingQuery);
  const roomChooises = useSelector((state) => state.roomPick?.roomChooises);
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

  const handleAddRoom = () => {
    dispatch(bookingQueryActions.onRoomChange(state?.quantity + 1));
  };

  const handleRoomRemove = (id) => {
    dispatch(
      bookingQueryActions.onRoomChange(Math.max(1, state?.quantity - 1)),
    );
    dispatch(roomPickActions.removeRoom(id));
  };

  const handleAdultsMinus = () => {
    dispatch(bookingQueryActions.onAdultChange(Math.max(1, state?.adults - 1)));
  };

  const handleAdultsPlus = () => {
    dispatch(roomPickActions.updateAdults(state?.adults + 1));
  };

  const handleChildrenMinus = () => {
    dispatch(
      bookingQueryActions.onChildrenChange(Math.max(0, state?.children - 1)),
    );
  };

  const handleChildrenPlus = () => {
    dispatch(bookingQueryActions.onChildrenChange(state?.children + 1));
  };

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
          <h2 className="text-14 textkok-light-1 text-center">
            Rooms and guests
          </h2>
          <div className="border-top-light mt-28 mb-20" />
          <div className="d-flex justify-content-between mb-20">
            <div>Rooms</div>
            <div>Adults</div>
            <div>Children</div>
          </div>
          {roomChooises.map((id, index) => (
            <div className="text-12" key={index}>
              <div className="d-flex gap-2 align-items-center mb-2 justify-content-between">
                <div className="d-flex gap-2">
                  <button
                    className="btn border text-12"
                    onClick={() => handleRoomRemove(id)}
                  >
                    X
                  </button>
                  <span>Room {index + 1}</span>
                </div>
                <div className="d-flex gap-2 ">
                  <button className="btn border text-12">
                    <i className="icon-minus" />
                  </button>
                  <span>{state?.adults}</span>
                  <button
                    className="btn border text-12"
                    onClick={handleAdultsPlus}
                  >
                    <i className="icon-plus" />
                  </button>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn border text-12">
                    <i className="icon-minus" />
                  </button>
                  <span>{state?.children}</span>
                  <button className="btn border text-12">
                    <i className="icon-plus" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="border-top-light mt-28" />
          <button className="text-14" onClick={handleAddRoom}>
            <i className="icon-plus m-2" />
            <span>Add rooms</span>
          </button>
          <div className="border-top-light" />
        </div>
      </div>
    </div>
  );
};
export default GuestSearch;
