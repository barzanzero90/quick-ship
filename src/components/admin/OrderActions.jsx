import React, { useEffect, useRef, useState } from "react";
import { useOrders } from "../../context/OrdersContext";
import { MdKeyboardArrowRight } from "react-icons/md";
import { BiTrash } from "react-icons/bi";
import { GoDotFill } from "react-icons/go";
import { IoIosArrowBack } from "react-icons/io";

const OrderActions = ({ setShowOrderActions, order }) => {
  const [showChangeOrderStatus, setShowChangeOrderStatus] = useState(false);
  const { deleteOrder, changeOrderStatus } = useOrders();
  let menuRef = useRef();

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setShowOrderActions(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  const handleChangeOrderStatus = (newStatus) => {
    changeOrderStatus(order, newStatus);
    setShowChangeOrderStatus(false);
    setShowOrderActions(false);
  };

  return (
    <div
      className="absolute top-10 right-1 bg-white mainShadow p-2 rounded-md flex flex-col justify-start items-start gap-2.5"
      style={{ zIndex: 2 }}
      ref={menuRef}
    >
      {!showChangeOrderStatus ? (
        <>
          <button
            onClick={() => setShowChangeOrderStatus(!showChangeOrderStatus)}
            className="flex justify-between items-center w-full text-left p-2 transform transition-all ease-in-out duration-100 hover:bg-[#969393]/15 hover:rounded-md active:scale-95 border-b border-b-[#e4e4e5]"
          >
            <p>Change order status</p>
            <MdKeyboardArrowRight size={20} />
          </button>

          <button
            onClick={() => deleteOrder(order.id)}
            className="flex justify-between items-center w-full text-left p-2 transform transition-all ease-in-out duration-100 hover:bg-[#969393]/15 hover:rounded-md active:scale-95"
          >
            <p>Delete order</p>
            <BiTrash size={20} />
          </button>
        </>
      ) : (
        <div className="flex flex-col justify-start items-start w-full">
          <div className="flex justify-between items-center w-full px-2 border-b border-b-[#e4e4e5]">
            <button
              title="Back"
              onClick={() => setShowChangeOrderStatus(!showChangeOrderStatus)}
              className="transform transition-all ease-in-out duration-100 hover:bg-[#969393]/15 hover:rounded-full active:scale-95"
            >
              <IoIosArrowBack size={25} />
            </button>

            <strong className="text-lg">Change order status</strong>

            <span></span>
          </div>

          <button
            onClick={() => handleChangeOrderStatus("isPending")}
            className="flex justify-start items-center gap-1 w-full text-left p-2 transform transition-all ease-in-out duration-100 hover:bg-[#969393]/15 hover:rounded-md active:scale-95"
          >
            {order.orderStatus.isPending ? (
              <GoDotFill size={15} color="#00ff00" />
            ) : (
              ""
            )}

            <p>Pending</p>
          </button>

          <button
            onClick={() => handleChangeOrderStatus("isConfirmed")}
            className="flex justify-start items-center gap-1 w-full text-left p-2 transform transition-all ease-in-out duration-100 hover:bg-[#969393]/15 hover:rounded-md active:scale-95"
          >
            {order.orderStatus.isConfirmed ? (
              <GoDotFill size={15} color="#00ff00" />
            ) : (
              ""
            )}

            <p>Confirmed</p>
          </button>

          <button
            onClick={() => handleChangeOrderStatus("isOnDelivered")}
            className="flex justify-start items-center gap-1 w-full text-left p-2 transform transition-all ease-in-out duration-100 hover:bg-[#969393]/15 hover:rounded-md active:scale-95"
          >
            {order.orderStatus.isOnDelivered ? (
              <GoDotFill size={15} color="#00ff00" />
            ) : (
              ""
            )}

            <p>On delivered</p>
          </button>

          <button
            onClick={() => handleChangeOrderStatus("isDelivered")}
            className="flex justify-start items-center gap-1 w-full text-left p-2 transform transition-all ease-in-out duration-100 hover:bg-[#969393]/15 hover:rounded-md active:scale-95"
          >
            {order.orderStatus.isDelivered ? (
              <GoDotFill size={15} color="#00ff00" />
            ) : (
              ""
            )}

            <p>Delivered</p>
          </button>

          <button
            onClick={() => handleChangeOrderStatus("isCompleted")}
            className="flex justify-start items-center gap-1 w-full text-left p-2 transform transition-all ease-in-out duration-100 hover:bg-[#969393]/15 hover:rounded-md active:scale-95"
          >
            {order.orderStatus.isCompleted ? (
              <GoDotFill size={15} color="#00ff00" />
            ) : (
              ""
            )}

            <p>Completed</p>
          </button>

          <button
            onClick={() => handleChangeOrderStatus("isCancelled")}
            className="flex justify-start items-center gap-1 w-full text-left p-2 transform transition-all ease-in-out duration-100 hover:bg-[#969393]/15 hover:rounded-md active:scale-95"
          >
            {order.orderStatus.isCancelled ? (
              <GoDotFill size={15} color="#ff0000" />
            ) : (
              ""
            )}

            <p>Cancelled</p>
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderActions;
