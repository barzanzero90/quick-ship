import React, { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { hideScrollBar } from "../../hooks/hideScrollBar";
import { useLocations } from "../../context/LocationsContext";
import { useOrders } from "../../context/OrdersContext";
import { ORDERSACTIONS } from "../../actions/ordersActions";
import { FormatMoney } from "../../utils/FormatMoney";
import { IoIosAdd } from "react-icons/io";
import AddAddressModal from "./AddAddressModal";

const UserAddressModal = ({
  showUserAddressModal,
  setShowUserAddressModal,
  user,
  cart,
  orderNote,
  totalMoney,
  isFromCart,
}) => {
  hideScrollBar(showUserAddressModal);

  const { address, getUserAddress, getCountries, countries } = useLocations();

  useEffect(() => {
    if (user) {
      getUserAddress(user.email);
    }
  }, [user]);

  const [activeAddress, setActiveAddress] = useState(null);
  const { handleOrder, dispatch } = useOrders();
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);

  useEffect(() => {
    if (address.length > 0) {
      setActiveAddress(address[0]);
    }
  }, [address]);

  const handleAddressClick = (selectedAddress) => {
    setActiveAddress(selectedAddress);
  };

  useEffect(() => {
    getCountries();
  }, [countries]);

  // const selectedAddressDileveryPrice = activeAddress.city.deliveryPrice;

  const handleOrderProduct = async () => {
    try {
      if (activeAddress) {
        cart.forEach(async (product) => {
          const orderData = {
            orderType: "Product",
            product,
            orderStatus: {
              isPending: true,
              isConfirmed: false,
              isOnDelivered: false,
              isDelivered: false,
              isCompleted: false,
              isCancelled: false,
            },
            orderNote,
            user,
            address: activeAddress,
            orderedAt: new Date(),
          };

          await handleOrder(orderData, user, totalMoney, cart, isFromCart);
          alert("داواکاریەکەت سەرکەوتووبوو");
          setShowUserAddressModal(false);
        });
      } else {
        alert("تکایە ناونیشانەکەت هەڵبژێرە");
      }
    } catch (error) {
      dispatch({ type: ORDERSACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  return (
    <div
      className="fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-full h-screen bg-black/50 backdrop-blur-sm"
      onClick={() => setShowUserAddressModal(!showUserAddressModal)}
      style={{ zIndex: 999 }}
    >
      {!showAddAddressModal ? (
        <div
          className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[90%] h-[300px] overflow-y-auto bg-white rounded-md flex flex-col justify-start items-end gap-2.5 p-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center w-full px-2">
            <span></span>
            <h3 className="text-lg font-semibold">پشکنین</h3>
            <button
              title="داخستن"
              onClick={() => setShowUserAddressModal(!showUserAddressModal)}
              className="hover:bg-[#969393]/25 rounded-full p-1 active:scale-95 transform transition-all duration-100 ease-in-out"
            >
              <IoCloseOutline size={23} />
            </button>
          </div>

          <div className="my-address-modal flex flex-row-reverse flex-wrap gap-3 p-1.5">
            {address.map((address, index) => (
              <div
                key={index}
                className={`cursor-pointer w-[250px] p-2 border rounded-md flex flex-col justify-end items-end gap-2.5 ${
                  activeAddress === address
                    ? "border-[#FF6F00]"
                    : "border-[#e4e4e5]"
                }`}
                onClick={() => handleAddressClick(address)}
              >
                <div className="flex flex-row-reverse gap-2">
                  <strong>: وڵات</strong>
                  <p>{address.country.countryName}</p>
                </div>

                <div className="flex flex-row-reverse gap-2">
                  <strong>: شار</strong>
                  <p>{address.city.cityName}</p>
                </div>

                <div className="flex flex-row-reverse gap-2">
                  <strong>: ناونیشان</strong>
                  <p>{address.address}</p>
                </div>

                <div className="flex flex-row-reverse gap-2">
                  <strong>: ژ.مۆبایل</strong>
                  <p>{address.phoneNumber}</p>
                </div>

                <div className="flex flex-row-reverse gap-2">
                  <strong>: نرخی گەیاندن</strong>
                  <p>{FormatMoney(address.city.deliveryPrice)} IQD</p>
                </div>
              </div>
            ))}

            <button
              onClick={() => setShowAddAddressModal(!showAddAddressModal)}
              className="bg-gray-200 cursor-pointer w-[250px] p-2 border rounded-md flex flex-col justify-center items-center gap-2 transform transition-all duration-100 ease-in-out active:scale-95"
            >
              <IoIosAdd size={100} />
              <p className="text-xl">زیادکردنی ناونیشانی نوێ</p>
            </button>
          </div>
          <button
            onClick={() => {
              user?.userMoney >= activeAddress?.city.deliveryPrice
                ? handleOrderProduct()
                : alert(
                    "ناتوانیت بۆ ئەم ناونیشانە داواکاری بکەت، چونکە باڵانسی پێویستت نییە"
                  );
            }}
            className="bg-[#FF6F00] w-[150px] text-black rounded-md p-2 transform transition-all duration-100 ease-in-out hover:text-white active:scale-95"
          >
            داواکردن
          </button>
        </div>
      ) : (
        <>
          {showAddAddressModal && (
            <AddAddressModal
              showAddAddressModal={showAddAddressModal}
              setShowAddAddressModal={setShowAddAddressModal}
              userEmail={user.email}
              countries={countries}
            />
          )}
        </>
      )}
    </div>
  );
};

export default UserAddressModal;
