import { configureStore, createSlice } from "@reduxjs/toolkit";
import findPlaceSlice from "../features/hero/findPlaceSlice";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import moment from 'moment'
import * as yup from 'yup'

export const LOCALSTORAGE_KEY_ROOM_SELECTION = "prevSelectedRoom"

const validationYupSchema = yup.object().shape({
  Salutation: yup.string().required("Salutation is required"),
  FirstName: yup.string().required("First Name is required"),
  LastName: yup.string().required("Last Name is required"),
  // Gender: yup.string().required("Gender is required"),
  // DateOfBirth: yup.string().required("Date of Birth is required"),
  // SpouseDateOfBirth: yup.string().required("Spouse Date of Birth is required"),
  // WeddingAnniversary: yup.string().required("Wedding Anniversary is required"),
  // Password: yup.string().required("Password is required"),
  // Address: yup.string().required("Address is required"),
  // City: yup.string().required("City is required"),
  // State: yup.string().required("State is required"),
  // Country: yup.string().required("Country is required"),
  // Nationality: yup.string().required("Nationality is required"),
  // Zipcode: yup.string().required("Zipcode is required"),
  // Phone: yup.string().required("Phone is required"),
  // Mobile: yup.string().required("Mobile is required"),
  // Fax: yup.string().required("Fax is required"),
  // Email: yup.string().required("Email is required"),
  // PromoCode: yup.string().required("Promo Code is required"),
  // Comment: yup.string().required("Comment is required"),
  // companyID: yup.string().required("Company ID is required"),
});

// [ API slice ]
const api = createApi({
  reducerPath: "api",
  baseQuery: async (args, api, extraOptions) => {
    const baseQuery = fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL });
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
        body: data,
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
      })
    }),
    getHotelDetailsWebBooking: builder.mutation({
      query: () => ({
        url: "/getHotelDetailsWebBooking",
        method: "POST",
      })
    })
  }),
});

// [ Store slice]
const authSlice = createSlice({
  name: "auth",
  initialState: {
  isLogin: null
},
  reducers: {
    setIsUserLogin: (state, action) => {
      state.isLogin = action.payload; 
      return state 
    },
  }
})

const bookingQuerySlice = createSlice({
  name: "booking/query",
  initialState: {
    hotelID: 10,
    arrivalDate: moment(new Date()).format("YYYY-MM-DD"),
    departureDate: moment(new Date()).format("YYYY-MM-DD"),
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
        api.endpoints.getDataForWebBooking.matchPending,
        (state, action) => {
          // FIXME: this handles the loading deception when user click on the search button
          // WARNING: do not change the state to (initiate) matchPending is intentionally used
          state.roomTypes = [];
        }
      )
      .addMatcher(
        api.endpoints.getDataForWebBooking.matchFulfilled,
        (state, action) => {
          state.roomTypes = action?.payload?.data;
        }
      );
  },
});

const roomSelection = createSlice({
  name: "roomSelection",
  initialState: localStorage.getItem(LOCALSTORAGE_KEY_ROOM_SELECTION)
    ? JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY_ROOM_SELECTION))
    : {},
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
      try {
        // abortEarly: false will return all errors at once instead of one by one which is default set with abortEarly: true
        validationYupSchema.validateSync(state.personalInfo, {
          abortEarly: false,
        });
        state.hasError = false;
      } catch (err) {
        const validationError = {};
        err.inner.forEach((error) => {
          validationError[error.path] = error.message;
        });
        state.errors = validationError;
        state.hasError = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      api.endpoints.getReservationJsonLikeEzeeWebBooking.matchFulfilled,
      (state, action) => {
        state.reservationInfo = action.payload?.data;
      }
    );
    builder.addMatcher(
      api.endpoints.addReservationFromWeb.matchFulfilled,
      (state, action) => {
        console.log(action);
        state.reservationCompetitionDetails = action.payload;
      }
    );
  },
});

const reservationInfoSlice = createSlice({
  name: "reservationInfo",
  initialState: {
    hotelID: 10,
    arrivalDate: moment(new Date()).format("YYYY-MM-DD"),
    departureDate: moment(new Date()).format("YYYY-MM-DD"),
    adults: 2,
    children: 1,
    quantity: 1,
    selectedPackageID: "1",
    selectedRoomTypeID: localStorage.getItem("roomTypeId")
      ? JSON.parse(localStorage.getItem("roomTypeId"))
      : "",
    guestDetails: {
      PromoCode: "",
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(bookingQuerySlice.actions.setBookingQuery, (state, action) => {
        console.log(action);
        Object.assign(state, action.payload);
      })
      .addCase(billingInfoSlice.actions.setPersonalInfo, (state, action) => {
        Object.assign(state.guestDetails, action.payload);
      })
      .addCase(roomSelection.actions.setRoomSelection, (state, action) => {
        Object.assign(state, action.payload);
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
      state.selectedHotel = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      api.endpoints.getHotelDetailsWebBooking.matchFulfilled,
      (state, action) => {
        state.locations = action.payload?.data;
      }
    )
  }
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
  useAddReservationFromWebMutation,
  useGetHotelDetailsWebBookingMutation,
} = api;

store.subscribe(() => {
  const state = store.getState();
});

export const { setIsUserLogin } = authSlice.actions
export const { setBookingQuery, updateGuest } = bookingSlice.actions
export const bookingQueryActions = bookingQuerySlice.actions
export const bookingActions = bookingSlice.actions
export const availableRoomsActions = availableRooms.actions
export const roomSelectionActions = roomSelection.actions
export const billingAction = billingInfoSlice.actions
export const hotelDetailsActions = hotelDetailsSlice.actions