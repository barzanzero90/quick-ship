import React, { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";
import { hideScrollBar } from "../../hooks/hideScrollBar";
import { AUTHACTIONS } from "../../actions/authActions";

const EditProfileModal = ({
  showEditProfileModal,
  setShowEditProfileModal,
  user,
}) => {
  hideScrollBar(showEditProfileModal);

  const { editProfile, dispatch } = useAuth();
  const [fullName, setFullName] = useState(user.fullName);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [email, setEmail] = useState(user.email);

  const handleEditProfile = async (e) => {
    e.preventDefault();

    try {
      if (
        fullName.trim() != "" &&
        phoneNumber.trim() != "" &&
        email.trim() != ""
      ) {
        const userData = {
          fullName,
          phoneNumber,
          email,
        };

        await editProfile(userData);
        alert("هەژمارەکەت بەسەرکەوتووی نوێکرایەوە");
        setShowEditProfileModal(false);
      }
    } catch (error) {
      dispatch({ type: AUTHACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  return (
    <div
      className="fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-full h-screen bg-black/50 backdrop-blur-sm"
      onClick={() => setShowEditProfileModal(!showEditProfileModal)}
      style={{ zIndex: 999 }}
    >
      <div
        className="edit-profile absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[260px] bg-white rounded-md flex flex-col justify-start items-start gap-2.5 p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center w-full px-2">
          <span></span>
          <h3 className="text-lg font-semibold">دەستکاری کردنی هەژمار</h3>
          <button
            title="داخستن"
            onClick={() => setShowEditProfileModal(!showEditProfileModal)}
            className="hover:bg-[#969393]/25 rounded-full p-1 active:scale-95 transform transition-all duration-100 ease-in-out"
          >
            <IoCloseOutline size={23} />
          </button>
        </div>

        <form className="flex flex-col justify-center items-center gap-3 w-full">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="ناوی تەواو"
            className="edit-profile-input w-[350px] border border-[#e4e4e5] rounded-md p-2 text-right"
            required
          />

          <input
            type="number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="ژمارەی مۆبایل"
            className="edit-profile-input w-[350px] border border-[#e4e4e5] rounded-md p-2 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            required
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ئیمەیڵ"
            className="edit-profile-input w-[350px] border border-[#e4e4e5] rounded-md p-2 text-right"
            required
          />

          <button
            onClick={handleEditProfile}
            className="edit-profile-btn bg-[#FF6F00] w-[350px] text-black rounded-md p-2 transform transition-all duration-100 ease-in-out hover:text-white active:scale-95"
          >
            دەستکاری کردن
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
