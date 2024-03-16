import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../app/features/cart/cartSlice";

function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (item, qty) => {
    dispatch(addToCart({ ...item, qty }));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  return (
    <div className="container flex justify-around items-start flex-wrap mx-auto mt-8">
      {cartItems.length === 0 ? (
        <div className="text-white">
          Your Cart is Empty{" "}
          <Link to="/shop" className="text-white underline">
            Go To Shop
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col w-[80%]">
            <h1 className="text-2xl font-semibold mb-4 text-white">
              Shopping Cart
            </h1>

            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center pb-2 mb-[1rem]">
                <div className="w-[5rem] h-[5rem]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>

                <div className="flex-1 ml-4">
                  <Link to={`/product/${item._id}`} className="text-pink-500">
                    {item.name}
                  </Link>

                  <div className="mt-2 text-white">{item.brand}</div>
                  <div className="mt-2 text-white font-bold">
                    $ {item.price}
                  </div>
                </div>

                <div className="w-24">
                  <select
                    value={item.qty}
                    onChange={(e) =>
                      addToCartHandler(item, Number(e.target.value))
                    }
                    className="w-full p-1 border rounded text-black"
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <button
                    className="text-red-500 mr-[5rem]"
                    onClick={() => removeFromCartHandler(item._id)}
                  >
                    <FaTrash className="ml-[1rem] mt-[.5rem]" />
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-8 w-[40rem]">
              <div className="p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2 text-white">
                  Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                </h2>

                <div className="text-2xl font-bold text-white">
                  ${" "}
                  {cartItems.reduce(
                    (acc, item) => acc + item.qty * item.price,
                    0
                  )}
                </div>

                <button
                  onClick={checkoutHandler}
                  disabled={cartItems.length === 0}
                  className="bg-pink-500 text-white mt-4 py-2 px-4 rounded-full text-lg w-full"
                >
                  Proceed To Checkout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
