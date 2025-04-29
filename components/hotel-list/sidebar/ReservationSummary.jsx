import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { guestRoomActions } from "@/store/store";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { api } from "@/store/store";

export const ReservationSummary = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const roomPicked = useSelector((state) => state.guestRoom?.roomPicked);
  const roomsOptions = useSelector((state) => state.guestRoom?.roomChooises);
  const rooms = Object.entries(roomPicked);
  const reservationInfo = useSelector((state) => state.reservationInfo);

  const [getReservationJsonLikeEzeeWebBooking] =
    api.useGetReservationJsonLikeEzeeWebBookingMutation();

  useEffect(() => {
    const data = sessionStorage.getItem("roomPick");
    if (data) {
      dispatch(guestRoomActions.setPickedRoom(JSON.parse(data)));
    }
  }, []);
  const handleReservationClick = async () => {
    try {
      await getReservationJsonLikeEzeeWebBooking(reservationInfo).unwrap();
      router.push("booking-page");
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while processing your reservation.");
    }
  };
  return (
    <div className="mb-3 border rounded mt-3 p-2 ">
      <h2 className="text-18 fw-500 mb-20">Reservation Summary</h2>
      {rooms?.map((room) => (
        <div key={room[0]} className="mb-3 bg-light-2 p-2 rounded">
          <h2 className="text-14">{`Room ${room[0]}`}</h2>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <p>{room[1]?.roomTypeName}</p>
              <p className="text-12">{`${room[1]?.adults} adults, ${room[1]?.children} children`}</p>
            </div>
            <p>
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                currencyDisplay: "symbol",
              }).format(room[1]?.roomRate)}
            </p>
          </div>
          <button
            href="#"
            className="text-14 -underline text-blue-1 cursor-pointer"
            onClick={() => {
              dispatch(guestRoomActions.changeRoomOption(room[0]));
            }}
          >
            Change room
          </button>
        </div>
      ))}
      <p>
        {rooms.reduce((acc, room) => (acc += room[1]?.adults), 0)} adults,{" "}
        {rooms.reduce((acc, room) => (acc += room[1]?.children), 0)} children
      </p>
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="text-18 bg-light-3 p-2 rounded">Total for stay:</h2>
        <p className="text-14">
          {new Intl.NumberFormat("en-IN", {
            currency: "INR",
            style: "currency",
            currencyDisplay: "symbol",
          }).format(
            rooms.reduce((acc, room) => (acc += room[1]?.roomRate), 0.0),
          )}
        </p>
      </div>
      <div className="p-2">
        <button
          className="button -dark-1 py-20 col-12 rounded bg-blue-1 text-white"
          onClick={handleReservationClick}
          disabled={rooms.length < roomsOptions.length}
        >
          Book Reservation
        </button>
      </div>
    </div>
  );
};
