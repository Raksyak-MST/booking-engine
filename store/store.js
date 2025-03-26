import { configureStore, createSlice } from "@reduxjs/toolkit";
import findPlaceSlice from "../features/hero/findPlaceSlice";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

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

const bookingInitialState = {
  hotelId: null,
  arrivalDate: null,
  departureDate: null,
  bookingLocation: null,
  adults: 2,
  children: 1,
  rooms: 1,
  companyId: null,
}

const bookingSlice = createSlice({
  name: "booking",
  initialState: bookingInitialState,
  reducers: {
    setBookingData: (state, action) => {
      console.log(action.payload)
      return Object.assign(state, action.payload) 
    },
    updateGuest: (state, action) => {
      console.log(action)
      const { name, value } = action.payload
      return Object.assign(state, {[name]: value})
    },
  }
})

export const store = configureStore({
  reducer: {
    hero: findPlaceSlice,
    auth: authSlice.reducer,
    booking: bookingSlice.reducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export const { useGetDataForWebBookingMutation } = api

export const { setIsUserLogin } = authSlice.actions
export const { setBookingData, updateGuest } = bookingSlice.actions