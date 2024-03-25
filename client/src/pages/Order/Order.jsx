import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../app/api/orderApiSlice";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function Order() {
  const { id: orderId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPayment }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const {
    data: paypal,
    isLoading: loadingPaypal,
    error: errorPaypal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPaypal && !loadingPaypal && paypal.clientId) {
      const loadingPaypalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            clientId: paypal.clientId,
            currency: "USD",
          },
        });

        paypalDispatch({
          type: "setLoadingStatus",
          value: "pending",
        });
      };

      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadingPaypalScript();
        }
      }
    }
  }, [errorPaypal, loadingPaypal, order, paypal, paypalDispatch]);

  function createOrder(data, actions) {
    return actions.order
      .created({
        purchase_units: [{ amount: { value: order.totalPrice } }],
      })
      .then((orderId) => {
        return orderId;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order is Paid");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    });
  }

  function onError(err) {
    toast.error(err.message);
  }

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error.data?.message}</Message>
  ) : (
    <div className="container flex flex-col ml-[10rem] md:flex-row">
      <div className="pr-4 md:2/3">
        <div className="border gray-300 mt-5 mb-5">
          {order.orderItems.length === 0 ? (
            <Message>Order is Empty</Message>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-[80%]">
                <thead className="border-b-2">
                  <tr>
                    <th className="p-2 text-white">Image</th>
                    <th className="p-2 text-white">Product</th>
                    <th className="p-2 text-white">Quantity</th>
                    <th className="p-2 text-white">Unit Price</th>
                    <th className="p-2 text-white">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover"
                        />
                      </td>

                      <td className="p-2">
                        <Link
                          className="text-white"
                          to={`/product/${item.product}`}
                        >
                          {item.name}
                        </Link>
                      </td>

                      <td className="p-2 text-center text-white">{item.qty}</td>
                      <td className="p-2 text-center text-white">
                        {item.price}
                      </td>
                      <td className="p-2 text-center text-white">
                        {(item.qty * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="md:w-1/3">
        <div className="mt-5 border-gray-300 pb-4 mb-4">
          <h2 className="text-xl font-bold text-white mb-2">Shipping</h2>
          <p className="text-white mb-4 mt-4">
            <strong className="text-pink-500">Order:</strong> {order._id}
          </p>
          <p className="text-white mb-4 ">
            <strong className="text-pink-500">Name:</strong>{" "}
            {order.user.username}
          </p>

          <p className="text-white mb-4 ">
            <strong className="text-pink-500">Email:</strong> {order.user.email}
          </p>

          <p className="mb-4 text-white">
            <strong className="text-pink-500">Address:</strong>{" "}
            {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>

          <p className="text-white mb-4 ">
            <strong className="text-pink-500">Payment Method:</strong>{" "}
            {order.paymentMethod}
          </p>

          {order.isPaid ? (
            <Message vaiant="success">Paid on {order.paidAt}</Message>
          ) : (
            <Message vaiant="danger">Not Paid</Message>
          )}
        </div>

        <h2 className="text-xl text-white font-bold mb-2 mt-[3rem]">
          Order Summary
        </h2>
        <div className="flex justify-between mb-2">
          <span className=" text-white">Items</span>
          <span className=" text-white">$ {order.itemsPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className=" text-white">Shipping</span>
          <span className=" text-white">$ {order.shippingPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className=" text-white">Tax</span>
          <span className=" text-white">$ {order.taxPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className=" text-white">Total</span>
          <span className=" text-white">$ {order.totalPrice}</span>
        </div>

        {!order?.isPaid && (
          <div>
            {loadingPayment && <Loader />}{" "}
            {isPending ? (
              <Loader />
            ) : (
              <div>
                <div>
                  <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                  ></PayPalButtons>
                </div>
              </div>
            )}
          </div>
        )}

        {loadingDeliver && <Loader />}
        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
          <div>
            <button
              type="button"
              onClick={deliverHandler}
              className="bg-pink-500 text-white w-full py-2"
            >
              Mark As Delivered
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Order;
