import Header11 from "@/components/header/header-11";
import OrderSubmittedInfo from "@/components/booking-page/OrderSubmittedInfo";
import { Invoice } from "@/components/booking-page/Invoice";

export const metadata = {
  title: "Hotel order info page",
  description: "GoTrip - Travel & Tour React NextJS Template",
};

const index = () => {
  return (
    <>
      {/* End Page Title */}

      <div className="header-margin"></div>
      {/* header top margin */}

      <Header11 />
      {/* End Header 1 */}

      <section className="pt-40 layout-pb-md">
        <div className="container">
          <Invoice />
        </div>
        {/* End container */}
      </section>
      {/* End stepper */}

      {/* End Call To Actions Section */}

      {/* <DefaultFooter /> */}
    </>
  );
};

export default index;
