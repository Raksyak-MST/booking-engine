import { configureStore, createSlice } from "@reduxjs/toolkit";
import findPlaceSlice from "../features/hero/findPlaceSlice";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import moment from 'moment'

// [ API slice ]
const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  endpoints: (builder) => ({
    getDataForWebBooking: builder.mutation({
      query: (data) => ({
        url: "/getDataforWebBooking",
        method: "POST",
        body: data,
      }),
    }),
    webLogin: builder.mutation({
      query: (data) => ({
        url: "/webLogin",
        method: "POST",
        body: new URLSearchParams(data),
      })
    }),
    getReservationJsonLikeEzeeWebBooking: builder.mutation({
      query: (data) => ({
        url: "/getReservationJsonLikeEzeeWebBooking",
        method: "POST",
        body: data,
      })
    })
  }),
});

// [ Store slice initial states ]
const initialState = {
  isLogin: null
}

const bookingQueryInitialState = {
  hotelID: 10,
  arrivalDate: moment(new Date()).format("YYYY-MM-DD"),
  departureDate: moment(new Date()).format("YYYY-MM-DD"),
  adults: 2,
  children: 1,
  quantity: 1,
  companyCode: "",
  selectedPackageID: "1",
  selectedRoomTypeID: "",
};

const billingInitialState = {
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
  },
  reservationInfo: {}
};

const bookingInitialState = {
  roomSelection: {
    package: "",
    mealPlan: "",
  },
};

// [ Store slice]
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsUserLogin: (state, action) => {
      state.isLogin = action.payload; 
      return state 
    },
  }
})

const bookingQuerySlice = createSlice({
  name: "booking/query",
  initialState: bookingQueryInitialState,
  reducers: {
    setBookingQuery: (state, action) => {
      return Object.assign(state, action.payload);
    },
  }
})

const bookingSlice = createSlice({
  name: "booking",
  initialState: bookingInitialState,
  reducers: {
    setBookingQuery: (state, acuseroutertion) => {
      return Object.assign(state.bookingQuery, action.payload);
    },
    setCustomerInfo: (state, action) => {
      return state;
    },
  },
});

const availableRooms = createSlice({
  name: "availableRooms",
  initialState: [],
  reducers: {
    setAvailableRooms: (state, action) => {
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(api.endpoints.getDataForWebBooking.matchFulfilled, (state, action) => {
      return action.payload?.data;
    })
  }
});

const roomSelection = createSlice({
  name: "roomSelection",
  initialState: {},
  reducers: {
    setRoomSelection: (state, action) => {
      return Object.assign(state, action.payload);
    },
  },
})

const billingInfoSlice = createSlice({
  name: "billing",
  initialState: billingInitialState,
  reducers: {
    setPersonalInfo: (state, action) => {
      state.personalInfo = action.payload;
    },
    togglePasswordVisibility: (state) => {
      return !state.isPasswordVisible;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      api.endpoints.getReservationJsonLikeEzeeWebBooking.matchFulfilled,
      (state, action) => {
        state.reservationInfo = action.payload?.data;
      }
    );
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
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

// [ Actions exports ]
export const {
  useGetDataForWebBookingMutation,
  useWebLoginMutation,
  useGetReservationJsonLikeEzeeWebBookingMutation,
} = api;

export const { setIsUserLogin } = authSlice.actions
export const { setBookingQuery, updateGuest } = bookingSlice.actions
export const bookingQueryActions = bookingQuerySlice.actions
export const bookingActions = bookingSlice.actions
export const availableRoomsActions = availableRooms.actions
export const roomSelectionActions = roomSelection.actions
export const billingAction = billingInfoSlice.actions