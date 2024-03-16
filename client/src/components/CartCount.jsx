import React from "react";
import { useSelector } from "react-redux";

function CartCount() {
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  return (
    <>
      {cartItems.length > 0 && (
        <span className="px-1 py-0 text-sm text-white bg-pink-500 rounded-full">
          {cartItems.reduce((acc, items) => acc + items.qty, 0)}
        </span>
      )}
    </>
  );
}

export default CartCount;
