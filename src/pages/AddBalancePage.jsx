import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { paymentMethods } from "../data/PaymentMethods";
import PaymentMethodModal from "../components/modals/PaymentMethodModal";

const AddBalancePage = () => {
  const { user } = useAuth();
  const [isSelectedPaymentMethod, setIsSelectedPaymentMethod] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("FastPay");

  return (
    <div className="pt-[30px]">
      <div className="add-balance flex flex-col gap-5 justify-center items-center p-3 border border-[#e4e4e5] w-[400px] rounded-md mx-auto">
        <div className="flex flex-col justify-center items-center gap-3 text-center w-full">
          <h3 className="text-lg font-semibold">زیادکردنی باڵانس</h3>
          <p>
            بۆ زیادکردنی باڵانس، دەبێت تۆ باڵانسی پێویست بۆ ئێمە بنێریت، لەڕێگای
            یەکێک لەم شێوازانەی خوارەوە، دوای ئەوەی کە تۆ باڵانس بۆ ئێمە دەنێریت
            ئێمە باڵانس بۆ تۆ زیاد دەکەین بەگوێرەی ئەو باڵانسەی کە تۆ ناردووتە
          </p>

          {paymentMethods.map((paymentMethod, index) => (
            <div
              key={index}
              className="flex flex-col justify-center items-center gap-4 w-full"
            >
              <button
                onClick={() => {
                  user
                    ? [
                        setIsSelectedPaymentMethod(!isSelectedPaymentMethod),
                        setPaymentMethod(paymentMethod),
                      ]
                    : alert("تکایە سەرەتا بچۆ ژوورەوە");
                }}
                className="add-balance-btn flex flex-row-reverse justify-start items-center gap-3 w-[350px] p-2 rounded-md border border-[#e4e4e5] transform transition-all duration-100 ease-in-out active:scale-95"
              >
                <img
                  src={paymentMethod.paymentImage}
                  className="w-10 h-10"
                  alt=""
                />
                <h3 className="text-lg">{paymentMethod.paymentName}</h3>
              </button>
            </div>
          ))}
        </div>
      </div>

      {isSelectedPaymentMethod && (
        <PaymentMethodModal
          isSelectedPaymentMethod={isSelectedPaymentMethod}
          setIsSelectedPaymentMethod={setIsSelectedPaymentMethod}
          paymentMethod={paymentMethod}
          user={user}
        />
      )}
    </div>
  );
};

export default AddBalancePage;
