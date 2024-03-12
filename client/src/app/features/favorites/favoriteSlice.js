import { createSlice } from "@reduxjs/toolkit";

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: [],
  reducers: {
    addToFavorites: (state, action) => {
      // check if the product is not already favorated
      if (!state.some((product) => product._id === action.payload._id)) {
        state.push(action.payload);
      }
    },

    removeFromFavorites: (state, action) => {
      //remove the product with the matching ID
      return state.filter((product) => product._id !== action.payload._id);
    },

    setFavorites: (state, action) => {
      // Set the favorites from the local Storage
      return action.payload;
    },
  },
});

export const { addToFavorites, removeFromFavorites, setFavorites } =
  favoriteSlice.actions;

export const selectFavorateProduct = (state) => state.favorites;

export default favoriteSlice.reducer;
