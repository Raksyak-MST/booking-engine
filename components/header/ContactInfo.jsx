import { useSelector } from "react-redux"
const ContactInfo = () => {
  const selectedHotel = useSelector(state => state.hotelDetails?.selectedHotel)
  const contactContent = [
    {
      id: 1,
      title: "Toll Free Customer Care",
      action: selectedHotel?.phoneNumber,
      text: selectedHotel?.phoneNumber,
    },
    {
      id: 2,
      title: "Need live support?",
      action: `mailto:${selectedHotel?.frontOfcEmail}`,
      text: selectedHotel?.frontOfcEmail,
    },
  ];
  return (
    <>
      {contactContent.map((item) => (
        <div className="mb-20" key={item.id}>
          <div className={"text-14"}>{item.title}</div>
          <a href={item.action} className="text-18 fw-500 text-dark-1 mt-5">
            {item.text} 
          </a>
        </div>
      ))}
    </>
  );
};

export default ContactInfo;
