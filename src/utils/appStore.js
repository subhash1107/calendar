import { configureStore } from "@reduxjs/toolkit";
import eventReducer from "./eventSlice"
const appStore = configureStore({
    reducer: {
      events: eventReducer,
    },
  });
  
  export default appStore;