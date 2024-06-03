import React, { useState } from "react";
import { hideScrollBar } from "../../hooks/hideScrollBar";
import { IoCloseOutline } from "react-icons/io5";
import { useOrders } from "../../context/OrdersContext";
import { ORDERSACTIONS } from "../../actions/ordersActions";

const PaymentMethodModal = ({
  isSelectedPaymentMethod,
  setIsSelectedPaymentMethod,
  paymentMethod,
  user,
}) => {
  hideScrollBar(isSelectedPaymentMethod);

  const { handleOrder, dispatch } = useOrders();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [balanceValue, setBalanceValue] = useState("");

  const handleOrderBalance = async () => {
    try {
      if (!phoneNumber) {
        alert("تکایە ژمارەی مۆبایل بنووسە");
      } else if (!balanceValue) {
        alert("تکایە ئەو بڕە پارەیەی کە ناردووتە بنووسە");
      } else if (phoneNumber && balanceValue) {
        const orderData = {
          orderType: "Balance",
          paymentMethod,
          phoneNumber,
          balanceValue,
          user,
          isActive: false,
          orderedAt: new Date(),
        };

        await handleOrder(orderData);
        alert(
          "داواکاریەکەت سەرکەوتوو بوو \nتکایە چاوەڕێ بکە بۆ ئەوەی باڵانسەکەت زیاد بکرێت"
        );
        setIsSelectedPaymentMethod(false);
      }
    } catch (error) {
      dispatch({ type: ORDERSACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  return (
    <div
      className="fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-full h-screen bg-black/50 backdrop-blur-sm"
      onClick={() => setIsSelectedPaymentMethod(!isSelectedPaymentMethod)}
      style={{ zIndex: 999 }}
    >
      <div
        className="payment-method absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[350px] h-[500px] bg-white rounded-md flex flex-col justify-center items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center w-full px-2">
          <span></span>
          <h3 className="text-lg font-semibold">زیادکردنی باڵانس</h3>
          <button
            title="داخستن"
            onClick={() => setIsSelectedPaymentMethod(!isSelectedPaymentMethod)}
            className="hover:bg-[#969393]/25 rounded-full p-1 active:scale-95 transform transition-all duration-100 ease-in-out"
          >
            <IoCloseOutline size={23} />
          </button>
        </div>
        <p>خاڵبەندی زیادکردنی باڵانس</p>

        <div className="flex flex-row-reverse justify-center items-center gap-0.5 w-full">
          <p>زیادکردنی باڵانس بەڕێگای</p>
          <p>{paymentMethod.paymentName}</p>
          <img src={paymentMethod.paymentImage} className="w-7 h-7" alt="" />
        </div>
        <p>خاڵبەندی زیادکردنی باڵانس</p>

        <div className="flex flex-col justify-end items-end gap-2 text-right">
          <p>١- ناردنی ئەو بڕە پارەی دەتەوێت بۆ ئەم ژمارەیە</p>
          <strong className="mx-auto">
            <a href="tel:+96407518980248">07518980248</a>
          </strong>
        </div>

        <div className="flex flex-col justify-center items-center gap-2 text-right w-full">
          <p>٢- ئەو ژمارەیە بنووسە کە باڵانست پێناردووە</p>
          <input
            type="number"
            placeholder="ژمارەی مۆبایل"
            min={0}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(parseInt(e.target.value))}
            className={`payment-method-input w-[300px] p-2 border border-[#e4e4e5] rounded-md text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
            required
          />
        </div>

        <div className="flex flex-col justify-center items-center gap-2 text-right w-full">
          <p>٣- بڕی ئەو پارەیە بنووسە کە ناردووتە</p>
          <input
            type="number"
            placeholder="بڕی پارە"
            min={1}
            value={balanceValue}
            onChange={(e) => setBalanceValue(parseInt(e.target.value))}
            className={`payment-method-input w-[300px] p-2 border border-[#e4e4e5] rounded-md text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
            required
          />
        </div>

        <button
          onClick={handleOrderBalance}
          className="payment-method-btn w-[300px] rounded-md p-2 bg-[#FF6F00] text-white hover:bg-[#FF6F00]/90 active:scale-95 transform transition-all duration-100 ease-in-out"
        >
          ناردن
        </button>
      </div>
    </div>
  );
};

export default PaymentMethodModal;
