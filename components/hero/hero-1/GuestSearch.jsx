"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchQueryActions, guestRoomActions } from "@/store/store";
import { useEffect } from "react";

const GuestSearch = () => {
  const currentRoom = useSelector((state) => state.roomPick?.currentRoom);
  const roomChooises = useSelector((state) => state.roomPick?.roomChooises);
  const roomPick = useSelector((state) => state.roomPick);
  const dispatch = useDispatch();

  useEffect(() => {
    const data = sessionStorage.getItem("roomChooises");
    if (data) {
      dispatch(guestRoomActions.setRoomOptions(JSON.parse(data)));
    }
  }, []);

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
          <span className="js-count-adult">{currentRoom.adults}</span> adults -{" "}
          <span className="js-count-child">{currentRoom.children}</span>{" "}
          childeren{" "}
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
          {roomChooises.map((room, index) => (
            <div className="text-12" key={room?.id}>
              <div className="d-flex gap-2 align-items-center mb-2 justify-content-between">
                <div className="d-flex gap-2">
                  <button
                    className="btn border text-12"
                    onClick={() => {
                      dispatch(guestRoomActions.removeRoom(room?.id));
                    }}
                    disabled={
                      (room?.id < roomChooises.length) | (room?.id == 1)
                    }
                  >
                    X
                  </button>
                  <span>{room?.name}</span>
                </div>
                <div className="d-flex gap-2 ">
                  <button
                    className="btn border text-12"
                    onClick={() =>
                      dispatch(
                        guestRoomActions.updateAdults({
                          id: room?.id,
                          adults: room?.adults - 1,
                        }),
                      )
                    }
                  >
                    <i className="icon-minus" />
                  </button>
                  <span>{room?.adults}</span>
                  <button
                    className="btn border text-12"
                    onClick={() =>
                      dispatch(
                        guestRoomActions.updateAdults({
                          id: room?.id,
                          adults: room?.adults + 1,
                        }),
                      )
                    }
                  >
                    <i className="icon-plus" />
                  </button>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn border text-12"
                    onClick={() =>
                      dispatch(
                        guestRoomActions.updateChildren({
                          id: room?.id,
                          children: room?.children - 1,
                        }),
                      )
                    }
                  >
                    <i className="icon-minus" />
                  </button>
                  <span>{room?.children}</span>
                  <button
                    className="btn border text-12"
                    onClick={() => {
                      dispatch(
                        guestRoomActions.updateChildren({
                          id: room?.id,
                          children: room?.children + 1,
                        }),
                      );
                    }}
                  >
                    <i className="icon-plus" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="border-top-light mt-28" />
          <button
            className="text-14"
            onClick={() => {
              const lastRoom =
                roomPick.roomChooises[roomPick.roomChooises?.length - 1];
              const count = lastRoom.id + 1;
              dispatch(
                guestRoomActions.insertRoomOptions({
                  id: count,
                  name: `Room${count}`,
                }),
              );
            }}
          >
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
