import { createSlice } from "@reduxjs/toolkit";
import { totalItemsPrice } from "../../../utils/cart";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [], shippingAdress: {}, payentMethod: "PayPal" };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { user, rating, numReviews, reviews, ...item } = action.payload;

      const existItem = state.cartItems.find(
        (prevItem) => prevItem._id === item._id
      );

      if (existItem) {
        state.cartItems = state.cartItems.map((prevItem) =>
          prevItem._id === item._id ? item : prevItem
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      return totalItemsPrice(state, item);
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (prevItem) => prevItem._id !== action.payload
      );
      return totalItemsPrice(state);
    },

    saveShippingAdress: (state, action) => {
      state.shippingAdress = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },
    savePaymentMethod: (state, action) => {
      state.payentMethod = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },
    clearCart: (state, action) => {
      state.cartItems = [];
      localStorage.setItem("cart", JSON.stringify(state));
    },
    // resetcate when logout
    resetCart: (state) => (state = initialState),
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAdress,
  savePaymentMethod,
  clearCart,
  resetCart,
} = cartSlice.actions;
export default cartSlice.reducer;
