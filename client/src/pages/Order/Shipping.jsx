import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProgressSteps from "../../components/ProgressSteps";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../app/features/cart/cartSlice";

const shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [country, setCountry] = useState(shippingAddress?.country || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress?.postalCode || ""
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!shippingAddress?.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod(paymentMethod));

    navigate("/placeorder");
  };

  return (
    <div className="container mx-auto mt-10 mb-10">
      <ProgressSteps step1 step2 />
      <div className="flex justify-around items-center flex-wrap mt-[5rem]">
        <form onSubmit={handleSubmit} className="w-[40rem]">
          <h1 className="text-2xl font-semibold mb-4 text-white">Shipping</h1>
          <div className="mb-4">
            <label htmlFor="address" className="block text-white mb-2">
              Address
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="city" className="block text-white mb-2">
              City
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="postal Code" className="block text-white mb-2">
              Postal Code
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter Postal Code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="country" className="block text-white mb-2">
              Country
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="payment-method" className="block text-gray-400">
              Select Payment Method
            </label>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-pink-500"
                  name="paymentMethod"
                  value="PayPal"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  checked={paymentMethod === "PayPal"}
                />
                <span className="ml-2 text-white">PayPal or Credit Card</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="bg-pink-500 text-white py-2 px-4 rounded-full text-lg w-full"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default shipping;
