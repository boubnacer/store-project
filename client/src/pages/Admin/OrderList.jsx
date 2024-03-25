import React from "react";
import { useGetOrdersQuery } from "../../app/api/orderApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { Link } from "react-router-dom";

function OrderList() {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <table className="mx-auto container">
          {/* <AdminMenu/> */}

          <thead className="w-full border">
            <tr className="mb-[5rem]">
              <th className="text-left text-white pl-1">ITEMS</th>
              <th className="text-left text-white pl-1">ID</th>
              <th className="text-left text-white pl-1">USER</th>
              <th className="text-left text-white pl-1">DATE</th>
              <th className="text-left text-white pl-1">TOTAL</th>
              <th className="text-left text-white pl-1">PAID</th>
              <th className="text-left text-white pl-1">DELIVERED</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>
                  <img
                    src={order.orderItems[0].image}
                    alt={order.name}
                    className="pt-4 w-[5rem]"
                  />
                </td>

                <td className="text-white">{order._id}</td>

                <td className="text-white">
                  {order.user ? order.user.username : "N/A"}
                </td>

                <td className="text-white">
                  {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
                </td>

                <td className="text-white">${order.totalPrice}</td>

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

                <td>
                  <Link to={`/order/${order._id}`}>
                    <button className="text-white">More</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default OrderList;
