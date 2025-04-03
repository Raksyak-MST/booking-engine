
import { useSelector } from "react-redux"

export const HotelDetails = () => {
  const userPicketHotel = useSelector((state) => state.hotelDetails.selectedHotel)
  return (
    <div>
      <h2 className="text-18 fw-500">{userPicketHotel?.name}</h2>
      <address className="text-14">{userPicketHotel?.address}</address>
      <p className="text-13">{formatPhoneNumber(userPicketHotel?.phoneNumber)}</p>
      {userPicketHotel?.website ? (
        <a
          className="text-16 fw-500 -underline"
          href={userPicketHotel?.website}
          target="_blank"
        >
          See hotel
        </a>
      ) : null}
    </div>
  );
};

function formatPhoneNumber(phoneNumberString){
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    return cleaned 
}