import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AddAddressModal from "../components/modals/AddAddressModal";
import { useLocations } from "../context/LocationsContext";
import { BiEdit } from "react-icons/bi";
import { PiTrash } from "react-icons/pi";
import EditAddressModal from "../components/modals/EditAddressModal";
import { IoIosAdd } from "react-icons/io";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

const AddressPage = () => {
  const { user, userExistsInLocalStorage, loading } = useAuth();
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const { getUserAddress, address, countries, getCountries, deleteAddress } =
    useLocations();
  const [showEditAddressModal, setShowEditAddressModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userExistsInLocalStorage && loading) {
      navigate("/");
    }
  }, [userExistsInLocalStorage, loading, navigate]);

  useEffect(() => {
    if (user) {
      getUserAddress(user.email);
    }
  }, [user]);

  useEffect(() => {
    getCountries();
  }, [countries]);

  return (
    <>
      {user ? (
        <main className="pt-[30px]">
          <Helmet>
            <title>گەیاندنی خێرا | ناونیشانەکانم</title>
          </Helmet>

          <div className="flex flex-col justify-end items-end w-[95%] p-2 rounded-md mainShadow mx-auto">
            <div className="flex flex-row-reverse justify-between items-center w-full px-2 pb-1.5 border-b border-b-[#e4e4e5]">
              <h2 className="text-xl font-semibold">ناونیشانەکانم</h2>
              <button
                onClick={() => setShowAddAddressModal(!showAddAddressModal)}
                className="bg-[#FF6F00] text-black sm:rounded-md rounded-full p-2 transform transition-all duration-100 ease-in-out hover:text-white active:scale-95"
              >
                <p className="sm:flex hidden">زیادکردنی ناونیشانی نوێ</p>
                <span
                  title="زیادکردنی ناونیشانی نوێ"
                  className="sm:hidden flex"
                >
                  <IoIosAdd size={30} />
                </span>
              </button>

              {showAddAddressModal && (
                <AddAddressModal
                  showAddAddressModal={showAddAddressModal}
                  setShowAddAddressModal={setShowAddAddressModal}
                  userEmail={user?.email}
                  countries={countries}
                />
              )}
            </div>

            <div className="address flex flex-row-reverse flex-wrap justify-start items-end gap-4 p-2">
              {address.map((address, index) => (
                <div
                  key={index}
                  className="address-card w-[250px] p-2 border border-[#e4e4e5] rounded-md flex flex-col justify-end items-end gap-2.5"
                >
                  <div className="flex flex-row-reverse justify-between items-center w-full">
                    <button
                      title="دەستکاری کردنی ناونیشان"
                      onClick={() =>
                        setShowEditAddressModal(!showEditAddressModal)
                      }
                      className="bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700 active:scale-95 transform transition-all ease-in-out duration-100"
                    >
                      <BiEdit size={25} />
                    </button>

                    {showEditAddressModal && (
                      <EditAddressModal
                        showEditAddressModal={showEditAddressModal}
                        setShowEditAddressModal={setShowEditAddressModal}
                        userEmail={user.email}
                        addressInfo={address}
                        countries={countries}
                      />
                    )}

                    <button
                      title="سڕینەوەی ناونیشان"
                      onClick={() => deleteAddress(user.email, address.id)}
                      className="bg-red-600 text-white p-1 rounded-full hover:bg-red-700 active:scale-95 transform transition-all ease-in-out duration-100"
                    >
                      <PiTrash size={25} />
                    </button>
                  </div>

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
                </div>
              ))}
            </div>
          </div>
        </main>
      ) : (
        <div
          className="absolute top-0 left-0 w-full h-full flex flex-col gap-2 justify-center items-center bg-black/50 backdrop-blur-sm"
          style={{ zIndex: 999 }}
        >
          <div className="loader"></div>
          <p>...چاوەڕێ بە</p>
        </div>
      )}
    </>
  );
};

export default AddressPage;
