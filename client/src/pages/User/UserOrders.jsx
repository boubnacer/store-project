import React from "react";
import { useGetMyOrdersQuery } from "../../app/api/orderApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { Link } from "react-router-dom";

function UserOrders() {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-white">My Orders</h2>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.error || error.error}</Message>
      ) : (
        <table className="w-full ">
          <thead>
            <tr>
              <td className="py-2 text-white">IMAGE</td>
              <td className="py-2 text-white">ID</td>
              <td className="py-2 text-white">DATE</td>
              <td className="py-2 text-white">TOTAL</td>
              <td className="py-2 text-white">PAID</td>
              <td className="py-2 text-white">DELIVERED</td>
              <td className="py-2 text-white"></td>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <img
                  src={order.orderItems[0].image}
                  alt={order.name}
                  className="w-[6rem] mb-5"
                />

                <td className="py-2 text-white">{order._id}</td>
                <td className="py-2 text-white">
                  {order.createdAt.substring(0, 10)}
                </td>
                <td className="py-2 text-white">${order.totalPrice}</td>

                <td className="py-2">
                  {order.isPaid ? (
                    <p className="p-1 text-center bg-green-400 rounded-full w-[6rem] text-white">
                      Complete
                    </p>
                  ) : (
                    <p className="p-1 text-center bg-red-400 rounded-full w-[6rem] text-white">
                      Pending
                    </p>
                  )}
                </td>

                <td className="py-2">
                  {order.isDelivered ? (
                    <p className="p-1 text-center bg-green-400 rounded-full w-[6rem] text-white">
                      Complete
                    </p>
                  ) : (
                    <p className="p-1 text-center bg-red-400 rounded-full w-[6rem] text-white">
                      Pending
                    </p>
                  )}
                </td>

                <td className="py-2">
                  <Link to={`/order/${order._id}`}>
                    <button className="bg-pink-400  py-2 px-3 rounded text-white">
                      View Details
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserOrders;
