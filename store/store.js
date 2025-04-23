import {
  configureStore,
  createListenerMiddleware,
  createSlice,
} from "@reduxjs/toolkit";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import moment from "moment";
import findPlaceSlice from "../features/hero/findPlaceSlice";

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

const roomList = createSlice({
  name: "roomList",
  initialState: { roomTypes: [] },
  reducers: {
    setAvailableRooms: (state, action) => {
      state.roomTypes = action.payload;
    },
    getRoomInfoByPackageCode: (_state, _action) => {},
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        // WARNING: do not change the state to (initiate) matchPending is intentionally used
        api.endpoints.getDataForWebBooking.matchPending,
        (state, _action) => {
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

const reservationInfoSlice = createSlice({
  name: "reservationInfo",
  initialState: {
    hotelID: 10,
    arrivalDate: moment(new Date()).format("YYYY-MM-DD"),
    departureDate: moment(new Date()).add(1, "days").format("YYYY-MM-DD"),
    guestDetails: [
      {
        PromoCode: "",
        adults: 1,
        children: 0,
        quantity: 1,
      },
    ],
  },
  reducers: {
    addPromoCode: (state, action) => {
      state.guestDetails?.map((guest) => (guest.PromoCode = action.payload));
    },
    setGuestDetails: (state, action) => {
      state.guestDetails = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(roomSelection.actions.setRoomSelection, (state, action) => {
      // NOTE: roomTypeID is the key from the api response so it is not the same as the key in the state
      Object.assign(state, {
        selectedRoomTypeID: action.payload?.roomTypeID,
      });
    });
    builder.addCase(
      searchQuerySlice.actions.setBookingQuery,
      (state, action) => {
        const { hotelID, arrivalDate, departureDate, selectedPackageID } =
          action.payload;
        Object.assign(state, action.payload);
      },
    );
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

const optionsSlice = createSlice({
  name: "options",
  initialState: {
    currentRoom: { id: 1, name: "Room1", adults: 1, children: 0 },
    roomChooises: [
      { id: 1, name: "Room1", isSelected: true, adults: 1, children: 0 },
    ],
    roomPicked: {},
  },
  reducers: {
    setRoomOptions: (state, action) => {
      state.roomChooises = action.payload;
    },
    changeRoomOption: (state, action) => {
      const index = state.roomChooises.findIndex(
        (room) => room.id == parseInt(action.payload),
      );
      const room = state.roomChooises[index];
      state.currentRoom = room;
    },
    insertRoomOptions: (state, action) => {
      const room = createRoomOption(action.payload);
      state.roomChooises.push(room);
    },
    setPickedRoom: (state, action) => {
      state.roomPicked = action.payload;
    },
    pickRoom: (state, action) => {
      state.roomPicked[state.currentRoom?.id] = action.payload;
      const index = state.roomChooises.findIndex(
        (room) => room.id === state.currentRoom?.id,
      );
      if (index === state.roomChooises.length - 1) return state;
      const nextRoomOption = state.roomChooises[index + 1];
      state.currentRoom = nextRoomOption;
    },
    removeRoom: (state, action) => {
      if (state?.roomChooises?.length === 1) return state;
      delete state.roomPicked[action.payload];
      const index = state.roomChooises.findIndex(
        (room) => room.id == action.payload,
      );
      const previousRoomIndex = index - 1;
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
      const room = state.roomChooises[index];
      room.adults = action.payload.adults;
      state.currentRoom = room;
    },
    updateChildren: (state, action) => {
      const index = state.roomChooises?.findIndex(
        (room) => room.id == action.payload.id,
      );
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

const searchQuerySlice = createSlice({
  name: "mainSearchBar",
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
  },
  extraReducers: (builder) => {
    builder.addCase(optionsSlice.actions.changeRoomOption, (state, action) => {
      console.log(action.payload);
    });
  },
});

// [ Middleware ]

const storageMiddleware = createListenerMiddleware();
const apiHandlerListenerMiddleware = createListenerMiddleware();

storageMiddleware.startListening({
  actionCreator: optionsSlice.actions.pickRoom,
  effect: (_action, api) => {
    const state = api.getState();
    sessionStorage.setItem(
      "roomPick",
      JSON.stringify(state.roomPick.roomPicked),
    );
  },
});

storageMiddleware.startListening({
  actionCreator: optionsSlice.actions.removeRoom,
  effect: (_action, api) => {
    const state = api.getState();
    sessionStorage.setItem(
      "roomPick",
      JSON.stringify(state.roomPick.roomPicked),
    );
    sessionStorage.setItem(
      "roomChooises",
      JSON.stringify(state.roomPick.roomChooises),
    );
  },
});

storageMiddleware.startListening({
  actionCreator: optionsSlice.actions.insertRoomOptions,
  effect: (_action, api) => {
    const state = api.getState();
    sessionStorage.setItem(
      "roomChooises",
      JSON.stringify(state.roomPick.roomChooises),
    );
  },
});

storageMiddleware.startListening({
  actionCreator: roomSelection.actions.setRoomSelection,
  effect: (action, _api) => {
    sessionStorage.setItem("roomSelection", JSON.stringify(action.payload));
  },
});

storageMiddleware.startListening({
  actionCreator: reservationInfoSlice.actions.setGuestDetails,
  effect: (action, _api) => {
    sessionStorage.setItem("guestDetails", JSON.stringify(action.payload));
  },
});

storageMiddleware.startListening({
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
    searchQuery: searchQuerySlice.reducer,
    roomList: roomList.reducer,
    roomSelection: roomSelection.reducer,
    reservationInfo: reservationInfoSlice.reducer,
    hotelDetails: hotelDetailsSlice.reducer,
    roomPick: optionsSlice.reducer,
    [api.reducerPath]: api.reducer,
    [cashFreeApiSlice.reducerPath]: cashFreeApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(storageMiddleware.middleware)
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
export const searchQueryActions = searchQuerySlice.actions;
export const roomListActions = roomList.actions;
export const roomSelectionActions = roomSelection.actions;
export const hotelDetailsActions = hotelDetailsSlice.actions;
export const reservationInfoActions = reservationInfoSlice.actions;
export const optionsActions = optionsSlice.actions;
