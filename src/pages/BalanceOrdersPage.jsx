import React from "react";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";
import { FiTrash2 } from "react-icons/fi";
import { FormatMoney } from "../utils/FormatMoney";
import { FormatDate } from "../utils/FormatDate";

const BalanceOrdersPage = () => {
  const { user } = useAuth();
  const { orders, deleteOrder } = useOrders();

  return (
    <>
      {user ? (
        <div className="pt-[30px]">
          <div className="flex flex-col gap-5 justify-end items-end w-[95%] p-2 rounded-md mainShadow mx-auto">
            <div className="flex flex-row-reverse justify-between items-center w-full px-2 pb-1.5 border-b border-b-[#e4e4e5]">
              <h2 className="text-xl font-semibold text-right">
                داواکاریەکانی زیادکردنی باڵانس
              </h2>
            </div>

            <div className="">
              {orders.filter((order) => order.orderType == "Balance" && order.user.email == user.email).length ==
              0 ? (
                <strong className="text-2xl text-right">
                  هیچ داواکاریەکی باڵانست نەکردووە
                </strong>
              ) : (
                <div className="balance-orders flex flex-row-reverse flex-wrap justify-start items-end gap-3">
                  {orders
                    .filter((order) => order.orderType == "Balance" && order.user.email == user.email)
                    .map((balanceOrder, index) => (
                      <div
                        key={index}
                        className="balance-order-card flex flex-col justify-end items-end gap-4 w-[300px] rounded-md border border-[#e4e4e5] text-right p-2"
                      >
                        <div className="flex flex-row-reverse justify-between items-center w-full">
                          <strong key={index}>
                            بەڕێگای : {balanceOrder.paymentMethod.paymentName}
                          </strong>

                          <button
                            title="سڕینەوە"
                            onClick={() => deleteOrder(balanceOrder.id)}
                            className="rounded-full bg-[#FF0000] text-white p-1 hover:bg-red-600 active:scale-95 transform transition-all duration-100 ease-in-out"
                          >
                            <FiTrash2 size={25} />
                          </button>
                        </div>

                        <p>ژمارەی مۆبایل : {balanceOrder.phoneNumber}</p>
                        <div className="flex flex-row-reverse justify-center items-center gap-0.5">
                          :دۆخ{" "}
                          {balanceOrder.isActive ? (
                            <p className="text-[#00FF00]">چالاک</p>
                          ) : (
                            <p className="text-[#FF0000]">چاوەڕێ بە</p>
                          )}
                        </div>
                        <p>بڕ: {FormatMoney(balanceOrder.balanceValue)} د.ع</p>
                        <p>بەروار: {FormatDate(balanceOrder.orderedAt)}</p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>Loading...</>
      )}
    </>
  );
};

export default BalanceOrdersPage;
