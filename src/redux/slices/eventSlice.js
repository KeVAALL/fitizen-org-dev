import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentEvent: null,
};
const eventSlice = createSlice({
  name: "selectedEvent",
  initialState,
  reducers: {
    setCurrentEvent: (state, action) => {
      state.currentEvent = action.payload.currentEvent;
    },
    removeCurrentEvent: (state) => {
      state.currentEvent = null;
    },
  },
});

export const { setCurrentEvent, removeCurrentEvent } = eventSlice.actions;
export default eventSlice.reducer;
