import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { AUTHACTIONS } from "../../actions/authActions";

const ForgotPassword = () => {
  const { user, forgotPassword, dispatch } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      return navigate("/");
    }
  }, [user, navigate]);

  const handleForgotPassword = async () => {
    try {
      if (email.trim() == "") {
        alert("ئیمەیڵەکەت بنووسە");
      } else {
        await forgotPassword(email);
      }
    } catch (error) {
      dispatch({ type: AUTHACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="auth flex flex-col gap-5 py-5 items-center w-[450px] mainShadow rounded-md">
        <div className="flex flex-col justify-center items-center gap-2.5">
          <div className="flex justify-between items-center w-full px-2">
            <Link to="/login" className="forgot-password-back-btn text-center">گەڕانەوە بۆ چوونەژوورەوە</Link>
            <h2 className="forgot-password-text text-xl text-center font-semibold">وشەی نهێنیت لەبیر کردووە؟</h2>
            <span></span>
          </div>
          <p className="text-center px-4">
            تکایە ئیمەیڵەکەت بنووسە ئێمە بەسترێکت بۆ دەنێرین بۆ گەڕانەوە بۆ
            هەژمارەکەت لە ئیمەیڵەکەدا
          </p>
        </div>

        <div className="w-full flex flex-col justify-center items-center gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ئیمەیڵ"
            className="auth-input-and-btn w-[400px] p-2 border border-[#e4e4e5] rounded-md text-right"
            required
          />
          <button
            onClick={handleForgotPassword}
            className="auth-input-and-btn w-[400px] py-3 rounded-md text-[#fff] bg-[#FF6F00] active:scale-95 transfrom transition-all ease-in-out duration-200"
          >
            لینکی ڕێستکردنی وشەی نهێنی بنێرە
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
