"use client"

import DealsFilter from "../sidebar/DealsFilter";
import Map from "../sidebar/Map";
import SearchBox from "../sidebar/SearchBox";
import PopularFilters from "../sidebar/PopularFilters";
import AminitesFilter from "../sidebar/AminitesFilter";
import RatingsFilter from "../sidebar/RatingsFilter";
import GuestRatingFilters from "../sidebar/GuestRatingFilters";
import StyleFilter from "../sidebar/StyleFilter";
import NeighborhoddFilter from "../sidebar/NeighborhoddFilter";
import PirceSlider from "../sidebar/PirceSlider";
import { HotelDetails } from "../sidebar/HotelDetail"

const Sidebar = () => {
  return (
    <>
      <div className="sidebar__item -no-border position-relative">
        <HotelDetails />
      </div>
    </>
  );
};

export default Sidebar;
