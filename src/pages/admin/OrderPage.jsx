import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { useOrders } from "../../context/OrdersContext";
import { FormatMoney } from "../../utils/FormatMoney";
import { FormatDate } from "../../utils/FormatDate";
import { ORDERSACTIONS } from "../../actions/ordersActions";

const OrderPage = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [balanceValue, setBalanceValue] = useState("");
  const { orders, deleteOrder, addBalance, dispatch } = useOrders();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  const getOrder = () => {
    const foundOrder = orders.find((order) => order.id == orderId);
    setOrder(foundOrder);
  };

  useEffect(() => {
    getOrder();
  }, [orders, orderId]);

  const handleAddBalance = async () => {
    try {
      if (balanceValue) {
        await addBalance(order?.user, order, balanceValue);
      }
    } catch (error) {
      dispatch({ type: ORDERSACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  return (
    <>
      {user ? (
        <>
          {user.isAdmin ? (
            <>
              {order ? (
                <div className="flex flex-col justify-center items-center gap-10">
                  <header
                    className="sticky top-0 left-0 w-full h-14 bg-white mainShadow flex justify-between items-center px-2"
                    style={{ zIndex: 999 }}
                  >
                    <button
                      title="Back"
                      onClick={() => history.back()}
                      className="hover:bg-[#969393]/15 rounded-full p-1 transform transition-all ease-in-out duration-100 active:scale-95"
                    >
                      <IoIosArrowBack size={25} />
                    </button>
                    <h3 className="text-lg font-semibold">Order info</h3>

                    <div className="flex justify-center items-center gap-3">
                      <button
                        onClick={() => {
                          deleteOrder(order.id);
                          alert("Order deleted successfully!");
                          navigate("/admin/orders");
                        }}
                        className="bg-red-600 text-white hover:bg-red-700 rounded-md transform transition-all ease-in-out duration-100 active:scale-95 py-1.5 px-2"
                      >
                        Delete order
                      </button>
                    </div>
                  </header>

                  {order.orderType == "Balance" ? (
                    <div className="flex flex-col justify-center items-center gap-3">
                      <strong className="text-xl">
                        Order type: {order.orderType}
                      </strong>
                      <p>Balance type: {order.paymentMethod.paymentName}</p>
                      <div className="flex justify-center to-current gap-0.5">
                        <p>By : </p>
                        <img
                          src={order.user.userImageURL}
                          className="w-10 h-10 rounded-full object-cover"
                          alt=""
                        />
                        <p>{order.user.fullName}</p>
                      </div>

                      <div className="flex justify-center items-center gap-1">
                        <p>Status : </p>
                        <input
                          type="checkbox"
                          checked={order.isActive || false}
                          onChange={handleAddBalance}
                        />
                      </div>

                      <p>Date : {FormatDate(order.orderedAt)}</p>

                      <p>
                        User balance : {FormatMoney(order.user.userMoney)} IQD
                      </p>

                      <p>
                        Order balance value : {FormatMoney(order.balanceValue)}
                      </p>

                      <input
                        type="number"
                        placeholder="Enter Balance Value To Add"
                        min={0}
                        value={balanceValue}
                        onChange={(e) =>
                          setBalanceValue(parseInt(e.target.value))
                        }
                        className={`w-[300px] p-2 border border-[#e4e4e5] rounded-md text-left [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                        required
                      />

                      <button
                        onClick={handleAddBalance}
                        className="w-[300px] p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transform transition-all ease-in-out duration-100 active:scale-95"
                      >
                        Add
                      </button>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              ) : (
                <>Order not found</>
              )}
            </>
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

export default OrderPage;
