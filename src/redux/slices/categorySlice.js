import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categorySelected: null,
};
const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.categorySelected = action.payload.categorySelected;
    },
  },
});

export const { setSelectedCategory } = categorySlice.actions;
export default categorySlice.reducer;
