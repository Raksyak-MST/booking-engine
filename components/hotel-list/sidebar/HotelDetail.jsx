import { useSelector } from "react-redux";

export const HotelDetails = () => {
  const userPicketHotel = useSelector(
    (state) => state.hotelDetails.selectedHotel,
  );
  return (
    <>
      {userPicketHotel && (
        <div className="mb-3 border rounded mt-3 p-2 ">
          <h2 className="text-18 fw-500">{userPicketHotel?.name}</h2>
          <address className="text-14">{userPicketHotel?.address}</address>
          <div>
            <a
              className="text-13 text-light-1"
              href={`tel:+${userPicketHotel?.phoneNumber}`}
            >
              {userPicketHotel?.phoneNumber}
            </a>
          </div>
          <a
            href={`mailto:${userPicketHotel?.email}`}
            className="text-13 text-light-1"
          >
            {userPicketHotel?.email}
          </a>
          {/* <div>
          {userPicketHotel?.website ? (
            <a
              className="text-14 -underline"
              href={`https://${userPicketHotel?.website}`}
              target="_blank"
            >
              See hotel
            </a>
          ) : null}
        </div> */}
        </div>
      )}
    </>
  );
};
