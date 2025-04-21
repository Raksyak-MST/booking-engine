"use client";

import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { roomPickActions } from "@/store/store";

export const SelectiveRooms = () => {
  const dispatch = useDispatch();
  const rooms = useSelector((state) => state.roomPick.roomChooises);
  const roomPick = useSelector((state) => state.roomPick.currentRoom);

  const handleRoomClick = (e) => {
    const element = e.target;
    if (element?.name) {
      dispatch(
        roomPickActions.selectRoom({ name: element.name, id: element.id }),
      );
    }
  };

  return (
    <div>
      {rooms.length > 1 && (
        <div
          className="d-flex gap-2 flex-wrap align-items-start"
          onClick={handleRoomClick}
        >
          {rooms.map((room, index) => (
            <button
              className={
                roomPick?.id != index + 1
                  ? "button -outline-blue-1 px-3 py-2 cursor-pointer text-blue-1"
                  : "button bg-blue-1 px-3 py-2 cursor-pointer text-white"
              }
              key={index}
              id={index + 1}
              name={room.name}
            >
              {room.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
