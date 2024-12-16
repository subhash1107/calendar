import { createSlice } from "@reduxjs/toolkit";


const formatDate = (date) => {
  if (typeof date === "string") return date;
  return date.toISOString().split("T")[0]; 
};

const initialState = { events: {} };

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    addEvent: (state, action) => {
      const { date, event } = action.payload;
      const formattedDate = formatDate(date); 

      if (!state.events[formattedDate]) {
        state.events[formattedDate] = [];
      }
      state.events[formattedDate].push(event);
    },

    deleteEvent: (state, action) => {
      const { date, index } = action.payload;
      const formattedDate = formatDate(date); 

      if (state.events[formattedDate]) {
       
        state.events[formattedDate] = state.events[formattedDate].filter(
          (_, idx) => idx !== index
        );
       
        if (state.events[formattedDate].length === 0) {
          delete state.events[formattedDate];
        }
      }
    },

    editEvent: (state, action) => {
      const { date, index, event } = action.payload;
      const formattedDate = formatDate(date); 

      if (
        state.events[formattedDate] &&
        state.events[formattedDate][index] !== undefined
      ) {
        state.events[formattedDate][index] = event;
      }
    },
  },
});

export const { addEvent, deleteEvent, editEvent } = eventSlice.actions;
export default eventSlice.reducer;
