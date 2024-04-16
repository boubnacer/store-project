import { useGetUsersQuery } from "../../app/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../app/api/orderApiSlice";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import Chart from "react-apexcharts";
import OrderList from "./OrderList";
import { AiOutlineOrderedList, AiFillProfile } from "react-icons/ai";

import { PiPerson, PiPersonFill } from "react-icons/pi";

const AdminDashboard = () => {
  const { data: customers, isLoading: loadingUsers } = useGetUsersQuery();
  const { data: orders, isLoading: loadingOrders } = useGetTotalOrdersQuery();
  const { data: sales, isLoading: loadingSales } = useGetTotalSalesQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: {
        type: "line",
      },
      tooltip: {
        theme: "dark",
      },
      colors: ["#00E396"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Sales Trend",
        align: "left",
      },
      grid: {
        borderColor: "#ccc",
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
        },
      },
      yaxis: {
        title: {
          text: "Sales",
        },
        min: 0,
      },
      legend: {
        position: "top",
        horisontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories: formattedSalesDate.map((item) => item.x),
          },
        },
        series: [
          { name: "Sales", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

  return (
    <>
      {/* <AdminMenu/> */}
      <section className="xl:ml-[4rem] md:ml-[0rem]">
        <div className="flex justify-around flex-wrap w-[90%]">
          <div className="rounded-lg bg-gray-500 p-5 mt-5 w-[20rem]">
            <div className="font-bold rounded-full bg-pink-500 text-center p-3 w-[3rem] text-white">
              $
            </div>
            <p className="mt-5 text-white">Sales</p>
            <h1 className="text-xl text-white font-bold">
              $ {loadingSales ? <Loader /> : sales?.totalSales}
            </h1>
          </div>

          <div className="rounded-lg bg-gray-500 p-5 mt-5 w-[20rem]">
            <div className="font-bold rounded-full bg-pink-500 text-center flex justify-center p-3 w-[3rem] text-white">
              <PiPersonFill />
            </div>
            <p className="mt-5 text-white">Customers</p>
            <h1 className="text-xl text-white font-bold">
              {loadingUsers ? <Loader /> : customers?.length}
            </h1>
          </div>

          <div className="rounded-lg bg-gray-500 p-5 mt-5 w-[20rem]">
            <div className="font-bold rounded-full bg-pink-500 flex justify-center p-3 w-[3rem] text-white">
              <AiOutlineOrderedList />
            </div>
            <p className="mt-5 text-white">All Orders</p>
            <h1 className="text-xl text-white font-bold">
              {loadingOrders ? <Loader /> : orders?.totalOrders}
            </h1>
          </div>
        </div>

        <div className="ml-[10rem] mt-[4rem]">
          <Chart
            options={state.options}
            series={state.series}
            type="bar"
            width="70%"
          />
        </div>

        <div className="ml-[2rem] mt-[4rem] mb-[4rem] ">
          <OrderList />
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
