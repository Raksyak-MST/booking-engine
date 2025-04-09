import dynamic from "next/dynamic";
import DefaultHeader from "@/components/header/default-header";
import Hero1 from "@/components/hero/hero-1";

export const metadata = {
  title: "Home",
  description: "",
};

const Home_1 = () => {
  return (
    <>
      {/* End Page Title */}

      <DefaultHeader />
      {/* End Header 1 */}

      <Hero1 />
      {/* End Hero 1 */}

      <section className="layout-pt-lg layout-pb-md" data-aos="fade-up">
        <div>
          <h2 className="text-center">Authentic Indigenous Luxury Experiences </h2>
          <p className="w-50 mx-auto text-center">The Oterra, 5-start deluxe luxury hotel nested in the heart of the Electronic City amidst 2.5 acres of landscaped lawns, with premium accommodations, a variety of luxurious restaurants featuring signature cuisine and dedicated event and meeting spaces. This unique location places you within easy reach of the city's dynamic business center and IT hubs. This luxurious 271-room hotel is ideally situated for business travelers and discerning to cater to your every need, featuring center equipped with cutting-edge equipment and personalized training programs is available for fitness enthusiasts.</p>
        </div>
      </section>
    </>
  );
};

export default dynamic(() => Promise.resolve(Home_1), { ssr: false });
