import { configureStore, createSlice } from "@reduxjs/toolkit";
import findPlaceSlice from "../features/hero/findPlaceSlice";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import moment from 'moment'

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  endpoints: (builder) => ({
    getDataForWebBooking: builder.mutation({
      query: (data) => ({
        url: "getDataforWebBooking",
        method: "POST",
        body: data,
      }),
    }),
    webLogin: builder.mutation({
      query: (data) => ({
        url: "webLogin",
        method: "POST",
        body: new URLSearchParams(data),
      })
    }),
  }),
});

const initialState = {
  isLogin: null
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsUserLogin: (state, action) => {
      console.log("Set user to:", action)
      state.isLogin = action.payload; 
      return state 
    },
  }
})

const bookingQueryInitialState = {
  hotelID: 10,
  arrivalDate: moment(new Date()).format("YYYY-MM-DD"),
  departureDate: moment(new Date()).format("YYYY-MM-DD"),
  adults: 2,
  children: 1,
  quantity: 1,
  companyCode: "",
};

const bookingInitialState = {
  roomSelection: {
    package: "",
    mealPlan: "",
  },
  customerInfo: {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    companyCode: "",
  },
};

const bookingQuerySlice = createSlice({
  name: "booking/query",
  initialState: bookingQueryInitialState,
  reducers: {
    setBookingQuery: (state, action) => {
      console.log(action.payload);
      return Object.assign(state, action.payload);
    },
  }
})

const bookingSlice = createSlice({
  name: "booking",
  initialState: bookingInitialState,
  reducers: {
    setBookingQuery: (state, action) => {
      console.log(action.payload);
      return Object.assign(state.bookingQuery, action.payload);
    },
    setCustomerInfo: (state, action) => {
      console.log(action.payload);
      return state;
    },
  },
});

const availableRooms = createSlice({
  name: "availableRooms",
  initialState: [],
  reducers: {
    setAvailableRooms: (state, action) => {
      console.log(action.payload);
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(api.endpoints.getDataForWebBooking.matchFulfilled, (state, action) => {
      return action.payload?.data;
    })
  }
});

export const store = configureStore({
  reducer: {
    hero: findPlaceSlice,
    auth: authSlice.reducer,
    booking: bookingSlice.reducer,
    bookingQuery: bookingQuerySlice.reducer,
    availableRooms: availableRooms.reducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export const { useGetDataForWebBookingMutation, useWebLoginMutation } = api

export const { setIsUserLogin } = authSlice.actions
export const { setBookingQuery, updateGuest } = bookingSlice.actions
export const bookingQueryActions = bookingQuerySlice.actions
export const bookingActions = bookingSlice.actions
export const availableRoomsActions = availableRooms.actions