import dynamic from "next/dynamic";
import AddBanner from "@/components/add-banner/AddBanner";
import PopularDestinations from "@/components/destinations/PopularDestinations";
import DefaultFooter from "@/components/footer/default";
import Header1 from "@/components/header/header-1";
import Hero1 from "@/components/hero/hero-1";
import BlockGuide from "@/components/block/BlockGuide";
import Blog from "@/components/blog/Blog3";
import CallToActions from "@/components/common/CallToActions";
import Destinations from "@/components/home/home-1/Destinations";
import Testimonial from "@/components/home/home-1/Testimonial";
import TestimonialLeftCol from "@/components/home/home-1/TestimonialLeftCol";
import Hotels from "@/components/hotels/Hotels";
import SelectFilter from "@/components/hotels/filter-tabs/SelectFilter";
import { destinations2 } from "../../../data/desinations";

export const metadata = {
  title: "Home-1 || GoTrip - Travel & Tour React NextJS Template",
  description: "GoTrip - Travel & Tour React NextJS Template",
};

const Home_1 = () => {
  return (
    <>
      {/* End Page Title */}

      <Header1 />
      {/* End Header 1 */}

      <Hero1 />
      {/* End Hero 1 */}

      <section className="layout-pt-lg layout-pb-md" data-aos="fade-up">
        <div>
          <h2 className="text-center">Authentic Indigenous Luxury Experiences </h2>
          <p className="w-50 mx-auto text-center">The Oterra, 5-start deluxe luxury hotel nested in the heart of the Electronic City amidst 2.5 acres of landscaped lawns, with premium accommodations, a variety of luxurious restaurants featuring signature cuisine and dedicated event and meeting spaces. This unique location places you within easy reach of the city's dynamic business center and IT hubs. This luxurious 271-room hotel is ideally situated for business travelers and discerning to cater to your every need, featuring center equipped with cutting-edge equipment and personalized training programs is available for fitness enthusiasts.</p>
        </div>
        <div className="">
        </div>
      </section>

      <section className="layout-pt-lg layout-pb-md" data-aos="fade-up">
        <div className="container">
          <div className="relative pt-40 sm:pt-20">
            <PopularDestinations destinations={destinations2}/>
          </div>
        </div>
        {/* End .container */}
      </section>
      {/* End Popular Destinations */}
    </>
  );
};

export default dynamic(() => Promise.resolve(Home_1), { ssr: false });
