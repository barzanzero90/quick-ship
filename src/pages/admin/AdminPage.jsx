import React, { Suspense } from "react";
import { useAuth } from "../../context/AuthContext";
import SideBar from "../../components/admin/SideBar";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { PiUsersThree } from "react-icons/pi";
import { GoStar } from "react-icons/go";
import { GiProfit } from "react-icons/gi";
import { Link } from "react-router-dom";
import { useOrders } from "../../context/OrdersContext";
import { FormatMoney } from "../../utils/FormatMoney";
import { FormatDate } from "../../utils/FormatDate";

const AdminPage = () => {
  const { user, users } = useAuth();
  const { orders } = useOrders();

  const totalSales = orders
    .filter((order) => order.orderType == "Product")
    .reduce(
      (acc, orderTotalMoney) => acc + orderTotalMoney.product.totalPrice,
      0
    );

  const totalProfit = orders
    .filter((order) => order.orderType == "Product")
    .reduce(
      (acc, orderTotalMoney) =>
        acc + orderTotalMoney.product.product.productProfit,
      0
    );

  return (
    <>
      {user ? (
        <>
          {user.isAdmin ? (
            <div className="grid grid-cols-4 gap-5 w-full h-screen">
              <SideBar />

              <div className="col-span-3 p-2 w-full">
                <div className="flex flex-col justify-center items-center gap-5 w-full p-3">
                  <div className="flex justify-between items-center w-full">
                    <h2 className="text-2xl font-semibold">
                      Welcome back, <strong>{user.fullName}</strong>
                    </h2>

                    <div className="flex justify-center items-center gap-2">
                      <h3 className="text-lg font-bold">{user.fullName}</h3>

                      <Suspense fallback={<>Loading...</>}>
                        <img
                          src={user.userImageURL}
                          className="w-12 h-12 object-cover rounded-full"
                          alt=""
                        />
                      </Suspense>
                    </div>
                  </div>

                  <div className="flex justify-center items-center w-full h-[150px] overflow-x-auto bg-gray-100 rounded-md">
                    <div className="w-full flex flex-col justify-center items-center gap-2 bg-gray-300 h-full rounded-tl-md rounded-bl-md">
                      <div className="flex justify-center items-center gap-1">
                        <HiOutlineShoppingBag
                          size={20}
                          className="bg-[#969393]/50 rounded-full w-8 h-8 p-1"
                        />
                        <h3 className="text-xl font-semibold">Total sales</h3>
                      </div>
                      <strong className="text-lg">
                        {FormatMoney(totalSales)} IQD
                      </strong>
                    </div>

                    <div className="w-full flex flex-col justify-center items-center gap-2 h-full border-r border-r-[#969393]/50">
                      <div className="flex justify-center items-center gap-1">
                        <PiUsersThree
                          size={20}
                          className="bg-[#969393]/50 rounded-full w-8 h-8 p-1"
                        />
                        <h3 className="text-xl font-semibold">Users</h3>
                      </div>
                      <strong className="text-lg">{users.length}</strong>
                    </div>

                    <div className="w-full flex flex-col justify-center items-center gap-2 h-full border-r border-r-[#969393]/50">
                      <div className="flex justify-center items-center gap-1">
                        <GoStar
                          size={20}
                          className="bg-[#969393]/50 rounded-full w-8 h-8 p-1"
                        />
                        <h3 className="text-xl font-semibold">Total orders</h3>
                      </div>
                      <strong className="text-lg">
                        {FormatMoney(orders.length)}
                      </strong>
                    </div>

                    <div className="w-full flex flex-col justify-center items-center gap-2 h-full">
                      <div className="flex justify-center items-center gap-1">
                        <GiProfit
                          size={20}
                          className="bg-[#969393]/50 rounded-full w-8 h-8 p-1"
                        />
                        <h3 className="text-xl font-semibold">Profit</h3>
                      </div>

                      <strong className="text-lg">
                        {FormatMoney(totalProfit)} IQD
                      </strong>
                    </div>
                  </div>

                  {/* 5 Last Orders */}
                  <div className="flex flex-col justify-center items-center w-full gap-3">
                    <div className="flex justify-between items-center w-full">
                      <h2 className="text-xl font-semibold">Last orders</h2>

                      <Link
                        to="/admin/orders"
                        className="text-blue-600 hover:text-blue-800 transform transition-all duration-100 ease-in-out active:scale-95"
                      >
                        See All
                      </Link>
                    </div>

                    <table className="w-full text-left bg-[#f9f9f9] rounded-md">
                      <tr className="w-full border-b border-b-[#969393]/25">
                        <td>Name</td>
                        <td>Type</td>
                        <td>Id</td>
                        <td>Price</td>
                        <td>Date</td>
                      </tr>

                      {orders.slice(0, 5).map((order, index) => (
                        <tr
                          key={index}
                          className="w-full border-b border-b-[#969393]/25 last:border-none p-1"
                        >
                          <td>
                            {order.orderType == "Balance" ? (
                              <Link to={`/admin/order/${order.id}`}>
                                {order.paymentMethod.paymentName}
                              </Link>
                            ) : (
                              <Link to="/admin/orders">
                                {order.product.product.productName}
                              </Link>
                            )}
                          </td>
                          <td>{order.orderType}</td>
                          <td>{order.id}</td>
                          <td>
                            {FormatMoney(
                              order.orderType == "Product"
                                ? order.product.totalPrice
                                : order.balanceValue
                            )}{" "}
                            IQD
                          </td>
                          <td>{FormatDate(order.orderedAt)}</td>
                        </tr>
                      ))}
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>404</>
          )}
        </>
      ) : (
        <>Loading...</>
      )}
    </>
  );
};

export default AdminPage;
