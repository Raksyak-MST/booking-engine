
import {useState} from 'react';

const RoomAmenities = (props) => {
  const { data, truncate = 0 } = props;
  const [truncateAmenities, setTruncateAmenities] = useState(truncate);
  const [isTruncate, setIsTruncate] = useState(true);
  const toggleTruncate = () => {
    setTruncateAmenities(truncateAmenities === 0 ? data.length : 0);
    setIsTruncate(state => !state);
  };

  if (isTruncate)
    return (
      <div className="row x-gap-10 y-gap-10 pt-20 items-center">
        {data
          ?.map((amenities, index) => (
            <div key={index} className="col-auto">
              <div className="border-light rounded-100 py-5 px-20 text-14 lh-14">
                {amenities}
              </div>
            </div>
          ))
          .slice(0, truncate)}{" "}
        <button className="button col-auto" onClick={() => toggleTruncate()}>
          +{data?.slice(truncate).length} more
        </button>
      </div>
    );

  if (truncateAmenities)
    return (
      <div className="row x-gap-10 y-gap-10 pt-20 items-center">
        {data?.map((amenities, index) => (
          <div key={index} className="col-auto">
            <div className="border-light rounded-100 py-5 px-20 text-14 lh-14">
              {amenities}
            </div>
          </div>
        ))}
        <button className="col-auto button" onClick={toggleTruncate}>Show less</button>
      </div>
    );

  if (!truncate)
    return (
      <div className="row x-gap-10 y-gap-10 pt-20 items-center">
        {data?.map((amenities, index) => (
          <div key={index} className="col-auto">
            <div className="border-light rounded-100 py-5 px-20 text-14 lh-14">
              {amenities}
            </div>
          </div>
        ))}
      </div>
    );
};

export default RoomAmenities;