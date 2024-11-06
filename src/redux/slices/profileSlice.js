import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: null,
};
const profileSlice = createSlice({
  name: "orgProfile",
  initialState,
  reducers: {
    setOrgProfile: (state, action) => {
      state.profile = action.payload.orgProfile;
    },
    removeOrgProfile: (state) => {
      state.profile = null;
    },
  },
});

export const { setOrgProfile, removeOrgProfile } = profileSlice.actions;
export default profileSlice.reducer;
