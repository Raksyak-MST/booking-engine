import Wrapper from "@/components/layout/Wrapper";
import MainHome from "../app/(homes)/home_1/page";

export const metadata = {
  title: "Home || Oterra Find next place to visit",
  description: "Oterra, Discover amazing places at exclusive deals",
};

export default function Home() {
  return (
    <>
      <Wrapper>
        <MainHome />
      </Wrapper>
    </>
  );
}
