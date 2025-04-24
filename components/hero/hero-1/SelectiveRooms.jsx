"use client";

import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { guestRoomActions } from "@/store/store";

export const SelectiveRooms = () => {
  const dispatch = useDispatch();
  const rooms = useSelector((state) => state.roomPick.roomChooises);
  const roomPick = useSelector((state) => state.roomPick.currentRoom);

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
