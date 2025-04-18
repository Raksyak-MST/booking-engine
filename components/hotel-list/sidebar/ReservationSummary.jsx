import { useSelector } from "react-redux";
export const ReservationSummary = () => {
  const roomPicked = useSelector((state) => state.roomPick?.roomPicked);
  const rooms = Object.entries(roomPicked);
  return (
    <div className="mb-3 border rounded mt-3 p-2 ">
      <h2 className="text-18 fw-500 mb-20">Reservation Summary</h2>
      {rooms?.map((room) => (
        <div key={room[0]} className="mb-3 bg-light-2 p-2 rounded">
          <h2 className="text-14">{`Room ${room[0]}`}</h2>
          <div className="d-flex justify-content-between align-items-center">
            <p>{room[1]?.roomTypeName}</p>
            <p>
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                currencyDisplay: "symbol",
              }).format(room[1]?.perNightRate)}
            </p>
          </div>
          <a href="#" className="text-14 -underline text-blue-1">
            Change room
          </a>
        </div>
      ))}
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="text-18 bg-light-3 p-2 rounded">Total for stay:</h2>
        <p className="text-14">
          {new Intl.NumberFormat("en-IN", {
            currency: "INR",
            style: "currency",
            currencyDisplay: "symbol",
          }).format(0.0)}
        </p>
      </div>
    </div>
  );
};
