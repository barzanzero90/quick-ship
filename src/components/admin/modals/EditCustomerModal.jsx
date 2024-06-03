import React, { useState } from "react";
import { hideScrollBar } from "../../../hooks/hideScrollBar";
import { IoCloseOutline } from "react-icons/io5";
import { useAuth } from "../../../context/AuthContext";
import { AUTHACTIONS } from "../../../actions/authActions";

const EditCustomerModal = ({
  showEditCustomerModal,
  setShowEditCustomerModal,
  customer,
}) => {
  hideScrollBar(showEditCustomerModal);

  const [customerFullName, setCustomerFullName] = useState(customer.fullName);
  const [customerEmail, setCustomerEmail] = useState(customer.email);
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState(
    customer.phoneNumber
  );
  const [customerMoney, setCustomerMoney] = useState(customer.userMoney);
  const [customerMoneySpent, setCustomerMoneySpent] = useState(
    customer.userMoneySpent
  );
  const [customerIsAdmin, setCustomerIsAdmin] = useState(customer.isAdmin);
  const { editProfile, dispatch } = useAuth();

  const handleEditCustomer = async () => {
    try {
      if (customerFullName.trim() != "") {
        const customerData = {
          fullName: customerFullName,
          email: customerEmail,
          phoneNumber: customerPhoneNumber,
          userMoney: customerMoney,
          userMoneySpent: customerMoneySpent,
          isAdmin: customerIsAdmin,
        };

        await editProfile(customerData);
        alert("Customer edited successully!");
        setShowEditCustomerModal(false);
      }
    } catch (error) {
      dispatch({ type: AUTHACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  return (
    <div
      className="fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-full h-screen bg-black/50 backdrop-blur-sm"
      onClick={() => setShowEditCustomerModal(!showEditCustomerModal)}
      style={{ zIndex: 999 }}
    >
      <div
        className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[500px] bg-white rounded-md flex flex-col justify-start items-start gap-2 p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center w-full px-2">
          <button
            title="Close"
            onClick={() => setShowEditCustomerModal(!showEditCustomerModal)}
            className="hover:bg-[#969393]/25 rounded-full p-1 active:scale-95 transform transition-all duration-100 ease-in-out"
          >
            <IoCloseOutline size={23} />
          </button>

          <h3 className="text-lg font-semibold">Edit customer</h3>

          <span></span>
        </div>

        <div className="flex flex-col justify-center items-center gap-4 w-full py-3">
          <img
            src={customer.userImageURL}
            className="w-12 h-12 rounded-full object-cover"
            alt=""
          />

          <input
            type="text"
            placeholder="Customer Full Name"
            value={customerFullName}
            onChange={(e) => setCustomerFullName(e.target.value)}
            className="w-[350px] p-2 border border-[#e4e4e5] rounded-md"
          />

          <input
            type="email"
            placeholder="Customer Email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            className="w-[350px] p-2 border border-[#e4e4e5] rounded-md"
          />

          <input
            type="number"
            placeholder="Customer Phone Number"
            value={customerPhoneNumber}
            onChange={(e) => setCustomerPhoneNumber(e.target.value)}
            className="w-[350px] p-2 border border-[#e4e4e5] rounded-md"
          />

          <input
            type="number"
            placeholder="Customer Balance"
            value={customerMoney}
            onChange={(e) => setCustomerMoney(e.target.value)}
            className="w-[350px] p-2 border border-[#e4e4e5] rounded-md"
          />

          <input
            type="number"
            placeholder="Customer Balance Spent"
            value={customerMoneySpent}
            onChange={(e) => setCustomerMoneySpent(e.target.value)}
            className="w-[350px] p-2 border border-[#e4e4e5] rounded-md"
          />

          <div className="flex justify-between items-center w-full px-5">
            <p>Is admin</p>

            <input
              type="checkbox"
              checked={customerIsAdmin || false}
              onChange={(e) => setCustomerIsAdmin(e.target.checked)}
            />
          </div>

          <button
            onClick={handleEditCustomer}
            className="w-[350px] bg-blue-700 text-white transform transition-all ease-in-out duration-100 hover:bg-blue-800 rounded-md p-2 active:scale-95"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCustomerModal;
