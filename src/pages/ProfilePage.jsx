import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FormatMoney } from "../utils/FormatMoney";
import { FiEdit } from "react-icons/fi";
import { IoIosHeartEmpty, IoIosLogOut } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { LiaMoneyCheckAltSolid } from "react-icons/lia";
import { CiCircleList, CiStar } from "react-icons/ci";
import { FaRegAddressCard } from "react-icons/fa";
import EditProfileModal from "../components/modals/EditProfileModal";
import { GrUserAdmin } from "react-icons/gr";
import { Helmet } from "react-helmet";

const ProfilePage = () => {
  const { user, logOutUser, loading } = useAuth();
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && loading) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  return (
    <div className="pt-5">
      {user ? (
        <div className="flex flex-col justify-center items-center gap-5 p-2">
          <Helmet>
            <title>گەیاندنی خێرا | هەژمارەکەم</title>
          </Helmet>

          <div className="mainShadow w-full sm:h-[250px] p-2 flex flex-col gap-7 sm:flex-row-reverse sm:justify-between justify-center sm:items-start items-center rounded-md">
            <div className="flex flex-col sm:justify-end sm:items-end justify-center items-center gap-3">
              <img
                src={user.userImageURL}
                className="w-16 h-16 object-cover rounded-full"
                alt=""
              />
              <h3 className="text-lg font-semibold">{user.fullName}</h3>
              <h3 className="text-lg font-semibold">
                {user.email ? user.email : user.phoneNumber}
              </h3>
              <div className="flex flex-row-reverse justify-center items-center gap-1">
                <p>باڵانس</p>
                <h3 className="text-2xl font-semibold">
                  {FormatMoney(user.userMoney)}
                </h3>
                <p className="pt-3 text-gray-500">د.ع</p>
              </div>
              <h4>
                باڵانسی سەرفکردوو{" "}
                <span className="text-lg font-semibold">
                  {FormatMoney(user.userMoneySpent)}
                </span>{" "}
                د.ع
              </h4>
            </div>

            <div className="flex sm:flex-col flex-row-reverse flex-wrap gap-5 sm:justify-between sm:items-start justify-center items-center h-full">
              <button
                onClick={() => setShowEditProfileModal(!showEditProfileModal)}
                className="flex justify-center items-center gap-2 border border-[#FF6F00] text-[#FF6F00] p-1 rounded-md hover:bg-[#FF6F00] hover:text-white transform transition-all duration-100 ease-in-out active:scale-95"
              >
                <p>دەستکاریکردنی هەژمار</p>
                <FiEdit size={25} />
              </button>

              {showEditProfileModal && (
                <EditProfileModal
                  showEditProfileModal={showEditProfileModal}
                  setShowEditProfileModal={setShowEditProfileModal}
                  user={user}
                />
              )}

              <button
                onClick={logOutUser}
                className="flex justify-center items-center gap-2 border border-[#FF0000] text-[#FF0000] p-1 rounded-md hover:bg-[#FF0000] hover:text-white transform transition-all duration-100 ease-in-out active:scale-95"
              >
                <p>چوونەدەرەوە</p>
                <IoIosLogOut size={25} />
              </button>
            </div>
          </div>

          <div className="flex flex-row-reverse flex-wrap justify-center items-center gap-4">
            {user.isAdmin ? (
              <Link
                to="/admin/home"
                className="user-profile-info flex flex-row-reverse justify-start items-center px-2 gap-5 w-[300px] h-[115px] bg-white rounded-md border border-[#e4e4e5] transform transition-all duration-100 ease-in-out"
              >
                <GrUserAdmin size={30} />
                <h3 className="text-lg">ئەدمین</h3>
              </Link>
            ) : (
              <></>
            )}

            <Link
              to="/add-balance"
              className="user-profile-info flex flex-row-reverse justify-start items-center px-2 gap-5 w-[300px] h-[115px] bg-white rounded-md border border-[#e4e4e5] transform transition-all duration-100 ease-in-out"
            >
              <RiMoneyDollarCircleLine size={30} />
              <h3 className="text-lg">زیادکردنی باڵانس</h3>
            </Link>

            <Link
              to="/balance-orders"
              className="user-profile-info flex flex-row-reverse text-right justify-start items-center px-2 gap-5 w-[300px] h-[115px] bg-white rounded-md border border-[#e4e4e5] transform transition-all duration-100 ease-in-out"
            >
              <LiaMoneyCheckAltSolid size={30} />
              <h3 className="text-lg">داواکاریەکانی زیادکردنی باڵانس</h3>
            </Link>

            <Link
              to="/orders"
              className="user-profile-info flex flex-row-reverse justify-start items-center px-2 gap-5 w-[300px] h-[115px] bg-white rounded-md border border-[#e4e4e5] transform transition-all duration-100 ease-in-out"
            >
              <CiCircleList size={30} />
              <h3 className="text-lg">داواکاریەکانم</h3>
            </Link>

            <Link
              to="/reviews"
              className="user-profile-info flex flex-row-reverse justify-start items-center px-2 gap-5 w-[300px] h-[115px] bg-white rounded-md border border-[#e4e4e5] transform transition-all duration-100 ease-in-out"
            >
              <CiStar size={30} />
              <h3 className="text-lg">بۆچوونەکانم</h3>
            </Link>

            <Link
              to="/wishlists"
              className="user-profile-info flex flex-row-reverse justify-start items-center px-2 gap-5 w-[300px] h-[115px] bg-white rounded-md border border-[#e4e4e5] transform transition-all duration-100 ease-in-out"
            >
              <IoIosHeartEmpty size={30} />
              <h3 className="text-lg">دڵخوازەکانم</h3>
            </Link>

            <Link
              to="/address"
              className="user-profile-info flex flex-row-reverse justify-start items-center px-2 gap-5 w-[300px] h-[115px] bg-white rounded-md border border-[#e4e4e5] transform transition-all duration-100 ease-in-out"
            >
              <FaRegAddressCard size={30} />
              <h3 className="text-lg">ناونیشانەکانم</h3>
            </Link>
          </div>
        </div>
      ) : (
        <div
          className="absolute top-0 left-0 w-full h-full flex flex-col gap-2 justify-center items-center bg-black/50 backdrop-blur-sm"
          style={{ zIndex: 999 }}
        >
          <div className="loader"></div>
          <p>...چاوەڕێ بە</p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
