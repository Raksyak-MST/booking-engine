"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as Actions from "@/store/store";

export const SelectiveRooms = () => {
  const rooms = useSelector((state) => state.guestRoom.roomChooises);
  const roomPick = useSelector((state) => state.guestRoom.currentRoom);
  const searchQuery = useSelector((state) => {
    return state.searchQuery;
  });
  const [getDataForWebBooking] = Actions.useGetDataForWebBookingMutation();
  useEffect(() => {
    getDataForWebBooking({ ...searchQuery });
  }, [roomPick]);

  return (
    <div>
      {rooms.length > 1 && (
        <div className="d-flex gap-2 flex-wrap align-items-start">
          {rooms.map((room, index) => (
            <span
              className={
                roomPick?.id != index + 1
                  ? "border border-blue-1 bg-white text-blue-1 px-3 rounded"
                  : "border border-blue-1 bg-blue-1 text-white px-3 rounded"
              }
              key={room?.id}
              id={room?.id}
            >
              {room.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
