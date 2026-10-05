import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: [],
  reducers: {
    addFeed: (state, action) => action.payload,
    removeUserFromFeed: (state, action) => {
      const newUserCard = state.filter((user)=>user._id!=action.payload)
      return newUserCard; 
    },
  },
});

export const { addFeed, removeUserFromFeed } = feedSlice.actions;
export default feedSlice.reducer;
