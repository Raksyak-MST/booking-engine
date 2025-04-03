
import { useSelector } from "react-redux"

export const HotelDetails = () => {
  const userPicketHotel = useSelector((state) => state.hotelDetails.selectedHotel)
  return (
    <div>
      <h2 className="text-18 fw-500">{userPicketHotel?.name}</h2>
      <address className="text-14">{userPicketHotel?.address}</address>
      <a className="text-13 d-block text-light-1" href={`tel:+${userPicketHotel?.phoneNumber}`}>
        {userPicketHotel?.phoneNumber}
      </a>
      {userPicketHotel?.website ? (
        <a
          className="text-14 -underline"
          href={userPicketHotel?.website}
          target="_blank"
        >
          See hotel
        </a>
      ) : null}
    </div>
  );
};
