import {
  configureStore,
  createListenerMiddleware,
  createSlice,
} from "@reduxjs/toolkit";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import moment from "moment";
import findPlaceSlice from "../features/hero/findPlaceSlice";

// [ API slice ]
export const api = createApi({
  reducerPath: "api",
  baseQuery: async (args, api, extraOptions) => {
    const baseQuery = fetchBaseQuery({
      baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
      // timeout: 10000,
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
        body: {
          hotelID: data.hotelID,
          arrivalDate: data.arrivalDate,
          departureDate: data.departureDate,
          sameName: data.saveName,
          quantity: data.quantity,
          guestDetails: data.guestDetails,
        },
      }),
    }),
    getHotelDetailsWebBooking: builder.mutation({
      query: () => ({
        url: "/getHotelDetailsWebBooking",
        method: "POST",
      }),
    }),
    cashFreePaymentCreateOrder: builder.mutation({
      query: (data) => ({
        url: "/cashFreePaymentCreateOrder",
        method: "POST",
        body: {
          hotelID: data.hotelID,
          arrivalDate: data.arrivalDate,
          departureDate: data.departureDate,
          sameName: data.sameName,
          // reservationID: [], // FIXME: used for temp data send, until addReservationFromWeb api doesn't work
          quantity: data.quantity,
          guestDetails: data.guestDetails,
        },
      }),
    }),
    cashFreePaymentVerify: builder.query({
      query: (orderID) => ({
        url: `/cashFreePaymentVerify?orderID=${orderID}`,
      }),
    }),
  }),
});

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

const guestRoom = createSlice({
  name: "guestRoom",
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
      if (action.payload.adults > 3) return state;
      const index = state.roomChooises?.findIndex(
        (room) => room.id == action.payload.id,
      );
      const room = state.roomChooises[index];
      room.adults = Math.max(1, action.payload.adults);
      state.currentRoom = room;
    },
    updateChildren: (state, action) => {
      if (action.payload.children > 3) return state;
      const index = state.roomChooises?.findIndex(
        (room) => room.id == action.payload.id,
      );
      const room = state.roomChooises[index];
      room.children = Math.max(0, action.payload.children);
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
    reset: (state, action) => {
      state = {
        currentRoom: { id: 1, name: "Room1", adults: 1, children: 0 },
        roomChooises: [
          { id: 1, name: "Room1", isSelected: true, adults: 1, children: 0 },
        ],
        roomPicked: {},
      };
      return state;
    },
  },
});

const reservationInfoSlice = createSlice({
  name: "reservationInfo",
  initialState: {
    hotelID: 10,
    arrivalDate: moment(new Date()).format("YYYY-MM-DD"),
    departureDate: moment(new Date()).add(1, "days").format("YYYY-MM-DD"),
    quantity: 1,
    sameName: true,
    guestDetails: [
      {
        PromoCode: "",
        adults: 1,
        children: 0,
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
    setQuantity: (state, action) => {
      state.quantity = action.payload;
    },
    reset: (state) => {
      state = {
        hotelID: 10,
        arrivalDate: moment(new Date()).format("YYYY-MM-DD"),
        departureDate: moment(new Date()).add(1, "days").format("YYYY-MM-DD"),
        quantity: 1,
        sameName: true,
        guestDetails: [
          {
            PromoCode: "",
            adults: 1,
            children: 0,
          },
        ],
      };
      return state;
    },
  },
  extraReducers: (builder) => {
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

const searchQuerySlice = createSlice({
  name: "searchQuery",
  initialState: {
    hotelID: 10,
    arrivalDate: moment(new Date()).format("YYYY-MM-DD"),
    departureDate: moment(new Date()).add(1, "days").format("YYYY-MM-DD"),
    adults: 1,
    children: 0,
    quantity: 1,
    companyCode: "",
  },
  reducers: {
    setBookingQuery: (state, action) => {
      Object.assign(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(guestRoom.actions.updateAdults, (state, action) => {
      state.adults = action.payload.adults;
    });
    builder.addCase(guestRoom.actions.updateChildren, (state, action) => {
      state.children = action.payload.children;
    });
    builder.addCase(guestRoom.actions.pickRoom, (state, action) => {
      state.adults = action.payload.adults;
      state.children = action.payload.children;
    });
  },
});

const orderDetailsSlice = createSlice({
  name: "orderDetails",
  initialState: {
    order: {},
    reservation: {},
  },
  reducers: {
    setOrderDetails: (state, action) => {
      state.order = action.payload;
    },
    setReservation: (state, action) => {
      state.reservation = action.payload;
    },
  },
});

// [ Middleware ]

const storageMiddleware = createListenerMiddleware();
const apiHandlerListenerMiddleware = createListenerMiddleware();
const stateActionListenerMiddleware = createListenerMiddleware();

storageMiddleware.startListening({
  actionCreator: guestRoom.actions.pickRoom,
  effect: (_action, api) => {
    const state = api.getState();
    sessionStorage.setItem(
      "roomPick",
      JSON.stringify(state.guestRoom.roomPicked),
    );
  },
});

storageMiddleware.startListening({
  actionCreator: guestRoom.actions.removeRoom,
  effect: (_action, api) => {
    const state = api.getState();
    sessionStorage.setItem(
      "roomPick",
      JSON.stringify(state.guestRoom.roomPicked),
    );
    sessionStorage.setItem(
      "roomChooises",
      JSON.stringify(state.guestRoom.roomChooises),
    );
  },
});

storageMiddleware.startListening({
  actionCreator: guestRoom.actions.insertRoomOptions,
  effect: (_action, api) => {
    const state = api.getState();
    sessionStorage.setItem(
      "roomChooises",
      JSON.stringify(state.guestRoom.roomChooises),
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
  effect: (_, api) => {
    sessionStorage.clear();
  },
});

stateActionListenerMiddleware.startListening({
  actionCreator: guestRoom.actions.insertRoomOptions,
  effect: (action, api) => {
    const state = api.getState();
    api.dispatch(
      reservationInfoSlice.actions.setQuantity(
        state.guestRoom.roomChooises?.length,
      ),
    );
  },
});

stateActionListenerMiddleware.startListening({
  actionCreator: guestRoom.actions.removeRoom,
  effect: (action, api) => {
    const state = api.getState();
    api.dispatch(
      reservationInfoSlice.actions.setQuantity(
        state.guestRoom.roomChooises?.length,
      ),
    );
  },
});

apiHandlerListenerMiddleware.startListening({
  matcher: api.endpoints.cashFreePaymentCreateOrder.matchFulfilled,
  effect: (action, api) => {
    const state = api.getState();
    const { order_id } = action.payload;
    sessionStorage.setItem("orderID", order_id);
    sessionStorage.setItem("orderDetails", JSON.stringify(action.payload));
  },
});

apiHandlerListenerMiddleware.startListening({
  matcher: api.endpoints.addReservationFromWeb.matchFulfilled,
  effect: (action, api) => {
    const state = api.getState();
    sessionStorage.setItem(
      "reservationConfirmation",
      JSON.stringify(action.payload),
    );
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
    guestRoom: guestRoom.reducer,
    orderDetails: orderDetailsSlice.reducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(apiHandlerListenerMiddleware.middleware)
      .prepend(stateActionListenerMiddleware.middleware)
      .prepend(storageMiddleware.middleware)
      .concat(api.middleware),
});

// [ Actions exports ]
export const {
  useGetDataForWebBookingMutation,
  useWebLoginMutation,
  useGetReservationJsonLikeEzeeWebBookingMutation,
  useAddReservationFromWebMutation,
  useGetHotelDetailsWebBookingMutation,
} = api;

export const { setIsUserLogin } = authSlice.actions;
export const searchQueryActions = searchQuerySlice.actions;
export const roomListActions = roomList.actions;
export const roomSelectionActions = roomSelection.actions;
export const hotelDetailsActions = hotelDetailsSlice.actions;
export const reservationInfoActions = reservationInfoSlice.actions;
export const guestRoomActions = guestRoom.actions;
export const orderDetailsActions = orderDetailsSlice.actions;
