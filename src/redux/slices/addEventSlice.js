import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentEventId: null,
};
const addEventSlice = createSlice({
  name: "newEvent",
  initialState,
  reducers: {
    setCurrentEventId: (state, action) => {
      state.currentEventId = action.payload.currentEventId;
    },
    removeCurrentEventId: (state) => {
      state.currentEventId = null;
    },
  },
});

export const { setCurrentEventId, removeCurrentEventId } =
  addEventSlice.actions;
export default addEventSlice.reducer;
