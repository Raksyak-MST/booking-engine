import {
  configureStore,
  createListenerMiddleware,
  createSlice,
  isAnyOf,
} from "@reduxjs/toolkit";

import findPlaceSlice from "../features/hero/findPlaceSlice";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import moment from "moment";
import * as yup from "yup";
import { act } from "react";

// [ API slice ]
const api = createApi({
  reducerPath: "api",
  baseQuery: async (args, api, extraOptions) => {
    const baseQuery = fetchBaseQuery({
      baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
      timeout: 10000,
    });
    const result = await baseQuery(args, api, extraOptions);

    // FIXME: intentional delay, this will cause an additional 1 second delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return result;
  },
  endpoints: (builder) => ({
    getDataForWebBooking: builder.mutation({
      query: (data) => ({
        url: "/getDataforWebBooking",
        method: "POST",
        body: {
          hotelID: data.hotelID,
          arrivalDate: moment(data.arrivalDate).format("YYYY-MM-DD"),
          departureDate: moment(data.departureDate).format("YYYY-MM-DD"),
          adults: data.adults,
          children: data.children,
          quantity: data.quantity,
          selectedPackageID: data.selectedPackageID,
          selectedRoomTypeID: data.selectedRoomTypeID,
        },
      }),
    }),
    webLogin: builder.mutation({
      query: (data) => ({
        url: "/webLogin",
        method: "POST",
        body: new URLSearchParams(data),
      }),
    }),
    getReservationJsonLikeEzeeWebBooking: builder.mutation({
      query: (data) => ({
        url: "/getReservationJsonLikeEzeeWebBooking",
        method: "POST",
        body: data,
      }),
    }),
    addReservationFromWeb: builder.mutation({
      query: (data) => ({
        url: "/addReservationFromWeb",
        method: "POST",
        body: data,
      }),
    }),
    getHotelDetailsWebBooking: builder.mutation({
      query: () => ({
        url: "/getHotelDetailsWebBooking",
        method: "POST",
      }),
    }),
  }),
});

const cashFreeApiSlice = createApi({
  reducerPath: "cashFreeApi",
  baseQuery: fetchBaseQuery({ baseUrl: "api", timeout: 10000 }),
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({
        url: "/create-order",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

// [ Store slice]
const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLogin: null,
  },
  reducers: {
    setIsUserLogin: (state, action) => {
      state.isLogin = action.payload;
      return state;
    },
  },
});

const getMaxAdults = (rooms) => rooms * 3;
const getMaxChildren = (rooms) => rooms * 3;
const getMaxTotalGuests = (rooms) => rooms * 5;
const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

const bookingQuerySlice = createSlice({
  name: "bookingQuery",
  initialState: {
    hotelID: 10,
    arrivalDate: moment(new Date()).format("YYYY-MM-DD"),
    departureDate: moment(new Date()).add(1, "days").format("YYYY-MM-DD"),
    adults: 1,
    children: 0,
    quantity: 1,
    companyCode: "",
    selectedPackageID: "1",
    selectedRoomTypeID: "",
  },
  reducers: {
    setBookingQuery: (state, action) => {
      Object.assign(state, action.payload);
    },
    onRoomChange: (state, action) => {
      const maxA = getMaxAdults(action.payload);
      const maxC = getMaxChildren(action.payload);
      const maxT = getMaxTotalGuests(action.payload);

      let total = state.adults + state.children;

      if (total > maxT) {
        const overflow = total - maxT;
        const newChildren = clamp(state.children - overflow, 0, maxC);
        const newAdults = clamp(state.adults, 1, maxA);
        state.children = newChildren;
        state.adults = newAdults;
      } else {
        state.adults = clamp(state.adults, 1, maxA);
        state.children = clamp(state.children, 0, maxC);
      }
      state.quantity = action.payload;
    },
    onAdultChange: (state, action) => {
      const maxA = getMaxAdults(state.quantity);
      const total = action.payload + state.children;

      if (total <= getMaxTotalGuests(state.quantity)) {
        state.adults = clamp(action.payload, 1, maxA);
      }
    },
    onChildrenChange: (state, action) => {
      const maxC = getMaxChildren(state.quantity);
      const total = state.adults + action.payload;
      if (total <= getMaxTotalGuests(state.quantity)) {
        state.children = clamp(action.payload, 0, maxC);
      }
    },
    increaseAdults: (state) => {
      const maxAdults = state.quantity * 3;
      if (state.adults >= maxAdults) {
        return state;
      } else state.adults += 1;
    },
    increaseChildren: (state) => {
      const maxChildren = state.quantity * 2;
      if (state.children >= maxChildren) {
        return state;
      }
      state.children += 1;
    },
    increaseQuantity: (state) => {
      state.quantity += 1;
    },
    decreaseAdults: (state) => {
      if (state.adults <= 1) {
        return state;
      }
      state.adults -= 1;
    },
    decreaseChildren: (state) => {
      if (state.children <= 0) {
        return state;
      }
      state.children -= 1;
    },
    decreaseQuantity: (state) => {
      if (state.quantity <= 1) {
        return state;
      }
      state.quantity -= 1;
    },
  },
});

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    roomSelection: {
      package: "",
      mealPlan: "",
    },
  },
  reducers: {
    setBookingQuery: (state, action) => {
      Object.assign(state.bookingQuery, action.payload);
    },
    setCustomerInfo: (state, action) => {
      return state;
    },
  },
});

const availableRooms = createSlice({
  name: "availableRooms",
  initialState: { roomTypes: [] },
  reducers: {
    setAvailableRooms: (state, action) => {
      state.roomTypes = action.payload;
    },
    getRoomInfoByPackageCode: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        // WARNING: do not change the state to (initiate) matchPending is intentionally used
        api.endpoints.getDataForWebBooking.matchPending,
        (state, action) => {
          // FIXME: this handles the loading deception when user click on the search button
          state.roomTypes = [];
        },
      )
      .addMatcher(
        api.endpoints.getDataForWebBooking.matchFulfilled,
        (state, action) => {
          state.roomTypes = action?.payload?.data;
        },
      );
  },
});

const roomSelection = createSlice({
  name: "roomSelection",
  initialState: {},
  reducers: {
    setRoomSelection: (state, action) => {
      Object.assign(state, action.payload);
    },
  },
});

const billingInfoSlice = createSlice({
  name: "billing",
  initialState: {
    personalInfo: {
      Salutation: "Mr",
      FirstName: "",
      LastName: "",
      Gender: "",
      DateOfBirth: null,
      SpouseDateOfBirth: null,
      WeddingAnniversary: null,
      Address: "",
      City: null,
      State: "",
      Country: "",
      Nationality: "",
      Zipcode: "",
      Phone: null,
      Mobile: "",
      Fax: null,
      Email: "",
      PromoCode: "",
      Comment: "",
      companyID: "",
      isPasswordVisible: false,
      CCLink: "",
      CCNo: "",
      CCType: "",
      CCExpiryDate: "",
      CardHoldersName: "",
    },
    reservationInfo: {},
    reservationCompetitionDetails: {},
    errors: {},
    hasError: true,
  },
  reducers: {
    setPersonalInfo: (state, action) => {
      state.personalInfo = action.payload;
    },
    togglePasswordVisibility: (state) => {
      return !state.isPasswordVisible;
    },
    validateForm: (state) => {
      console.error("Use formik validation instead of calling this");
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      api.endpoints.getReservationJsonLikeEzeeWebBooking.matchFulfilled,
      (state, action) => {
        // only extract the first object, this is because the API return an array of objects
        state.reservationInfo = action.payload?.data;
      },
    );
    builder.addMatcher(
      api.endpoints.addReservationFromWeb.matchFulfilled,
      (state, action) => {
        state.reservationCompetitionDetails = action.payload;
      },
    );
  },
});

const reservationInfoSlice = createSlice({
  name: "reservationInfo",
  initialState: {
    hotelID: 10,
    arrivalDate: moment(new Date()).format("YYYY-MM-DD"),
    departureDate: moment(new Date()).format("YYYY-MM-DD"),
    adults: 1,
    children: 0,
    quantity: 1,
    selectedPackageID: "1",
    selectedRoomTypeID: "",
    guestDetails: {
      PromoCode: "",
    },
  },
  reducers: {
    setGuestDetails: (state, action) => {
      Object.assign(state?.guestDetails, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(roomSelection.actions.setRoomSelection, (state, action) => {
      // NOTE: roomTypeID is the key from the api response so it is not the same as the key in the state
      Object.assign(state, {
        selectedRoomTypeID: action.payload?.roomTypeID,
      });
    });
  },
});

const hotelDetailsSlice = createSlice({
  name: "hotelDetails",
  initialState: {
    locations: [],
    selectedHotel: null,
  },
  reducers: {
    setUserPickedHotelDetail: (state, action) => {
      state.selectedHotel = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        api.endpoints.getHotelDetailsWebBooking.matchFulfilled,
        (state, action) => {
          state.locations = action.payload?.data;
        },
      )
      .addMatcher(
        api.endpoints.getHotelDetailsWebBooking.matchFulfilled,
        (state, action) => {
          state.selectedHotel = action.payload?.data[0];
        },
      );
  },
});

const createRoomOption = (roomOptions) => {
  return {
    id: roomOptions.id,
    name: roomOptions.name,
    isSelected: false,
    adults: 1,
    children: 0,
  };
};

const roomPickSlice = createSlice({
  name: "roomPick",
  initialState: {
    currentRoom: { id: 1, name: "Room1", adults: 1, children: 0 },
    roomChooises: [
      { id: 1, name: "Room1", isSelected: true, adults: 1, children: 0 },
    ],
    roomPicked: {},
  },
  reducers: {
    insertRoomOptions: (state, action) => {
      const room = createRoomOption(action.payload);
      state.roomChooises.push(room);
    },
    addRoom: (state, action) => {
      state.roomPicked[state.currentRoom?.id] = action.payload;
    },
    removeRoom: (state, action) => {
      console.log("removed room");
      if (state?.roomChooises?.length === 1) return state;
      delete state.roomPicked[action.payload];
      const index = state.roomChooises.findIndex(
        (room) => room.id == action.payload,
      );
      const previousRoomIndex = index - 1;
      console.log(index, previousRoomIndex);
      const previousRoom = state.roomChooises[previousRoomIndex];
      if (previousRoom) {
        // if previous room exists, set it as the current room
        state.currentRoom = previousRoom;
      }
      state.roomChooises.splice(index, 1);
    },
    updateAdults: (state, action) => {
      const index = state.roomChooises?.findIndex(
        (room) => room.id == action.payload.id,
      );
      // console.log(state.roomChooises[0].id, index);
      const room = state.roomChooises[index];
      room.adults = action.payload.adults;
      state.currentRoom = room;
    },
    updateChildren: (state, action) => {
      const index = state.roomChooises?.findIndex(
        (room) => room.id == action.payload.id,
      );
      // console.log(state.roomChooises[0].id, index);
      const room = state.roomChooises[index];
      room.children = action.payload.children;
      state.currentRoom = room;
    },
    selectRoom: (state, action) => {
      state.roomChooises.forEach((room) => {
        if (room.id == action.payload?.id) {
          room.isSelected = true;
          state.currentRoom = room;
        } else {
          room.isSelected = false;
        }
      });
    },
  },
});

// [ Middleware ]

const localStorageMiddleware = createListenerMiddleware();
const apiHandlerListenerMiddleware = createListenerMiddleware();

localStorageMiddleware.startListening({
  actionCreator: roomSelection.actions.setRoomSelection,
  effect: (action, api) => {
    sessionStorage.setItem("roomSelection", JSON.stringify(action.payload));
  },
});

localStorageMiddleware.startListening({
  actionCreator: reservationInfoSlice.actions.setGuestDetails,
  effect: (action, api) => {
    sessionStorage.setItem("guestDetails", JSON.stringify(action.payload));
  },
});

localStorageMiddleware.startListening({
  matcher: api.endpoints.addReservationFromWeb.matchFulfilled,
  effect: () => {
    sessionStorage.removeItem("roomSelection");
  },
});

// [ Root Store ]
export const store = configureStore({
  reducer: {
    hero: findPlaceSlice,
    auth: authSlice.reducer,
    booking: bookingSlice.reducer,
    bookingQuery: bookingQuerySlice.reducer,
    availableRooms: availableRooms.reducer,
    roomSelection: roomSelection.reducer,
    billing: billingInfoSlice.reducer,
    reservationInfo: reservationInfoSlice.reducer,
    hotelDetails: hotelDetailsSlice.reducer,
    roomPick: roomPickSlice.reducer,
    [api.reducerPath]: api.reducer,
    [cashFreeApiSlice.reducerPath]: cashFreeApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(localStorageMiddleware.middleware)
      .concat(api.middleware)
      .concat(cashFreeApiSlice.middleware),
});

// [ Actions exports ]
export const {
  useGetDataForWebBookingMutation,
  useWebLoginMutation,
  useGetReservationJsonLikeEzeeWebBookingMutation,
  useAddReservationFromWebMutation,
  useGetHotelDetailsWebBookingMutation,
} = api;
export const cashFreeApiActions = cashFreeApiSlice;
export const { setIsUserLogin } = authSlice.actions;
export const { setBookingQuery, updateGuest } = bookingSlice.actions;
export const bookingQueryActions = bookingQuerySlice.actions;
export const bookingActions = bookingSlice.actions;
export const availableRoomsActions = availableRooms.actions;
export const roomSelectionActions = roomSelection.actions;
export const billingAction = billingInfoSlice.actions;
export const hotelDetailsActions = hotelDetailsSlice.actions;
export const reservationInfoActions = reservationInfoSlice.actions;
export const roomPickActions = roomPickSlice.actions;
