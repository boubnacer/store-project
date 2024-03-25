import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useCreateOrderMutation } from "../../app/api/orderApiSlice";
import { useEffect } from "react";
import ProgressSteps from "../../components/ProgressSteps";
import Message from "../../components/Message";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { clearCart } from "../../app/features/cart/cartSlice";
import { toast } from "react-toastify";

function PlaceOrder() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCart());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <ProgressSteps step1 step2 step3 />

      <div className="container mt-5 mx-auto">
        {cart.cartItems.length === 0 ? (
          <Message>Your Cart is Empty</Message>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <td className="px-1 py-2 text-left align-top text-white">
                    Image
                  </td>
                  <td className="px-1 py-2 text-left text-white">Product</td>
                  <td className="px-1 py-2 text-left text-white">Quantity</td>
                  <td className="px-1 py-2 text-left text-white">Price</td>
                  <td className="px-1 py-2 text-left text-white">Total</td>
                </tr>
              </thead>

              <tbody>
                {cart.cartItems.map((item, index) => (
                  <tr key={index}>
                    <td className="p-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover"
                      />
                    </td>

                    <td className="p-2">
                      <Link className="text-white" to={`/product/${item._id}`}>
                        {item.name}
                      </Link>
                    </td>
                    <td className="p-2 text-white">{item.qty}</td>
                    <td className="p-2 text-white">{item.price.toFixed(2)}</td>
                    <td className="p-2 text-white">
                      ${(item.qty * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-5 text-white">
            Order Summary
          </h2>
          <div className="flex justify-between flex-wrap p-5 bg-[#181818]">
            <ul className="text-lg">
              <li className="text-white">
                <span className="font-semibold text-white">Items:</span> $
                {cart.itemsPrice}
              </li>
              <li className="text-white">
                <span className="font-semibold text-white">Shipping:</span> $
                {cart.shippingPrice}
              </li>
              <li className="text-white">
                <span className="font-semibold text-white">Tax:</span> $
                {cart.taxPrice}
              </li>
              <li className="text-white">
                <span className="font-semibold text-white">Total:</span> $
                {cart.totalPrice}
              </li>
            </ul>

            {error && <Message>{error.data?.message}</Message>}

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">
                Shipping
              </h2>
              <p className="text-white">
                <strong className="text-white">Address:</strong>{" "}
                {cart.shippingAddress.address}, {cart.shippingAddress.city},{" "}
                {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country},{" "}
              </p>
            </div>

            <div className="text-white">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                Payment Method
              </h2>
              <strong className="text-white">Method:</strong>{" "}
              {cart.paymentMethod}
            </div>
          </div>

          <button
            type="button"
            disabled={cart.cartItems === 0}
            onClick={placeOrderHandler}
            className="bg-pink-500 text-white py-2 px-4 rounded-full text-lg w-full mt-4"
          >
            Place Order
          </button>

          {isLoading && <Loader />}
        </div>
      </div>
    </>
  );
}

export default PlaceOrder;
