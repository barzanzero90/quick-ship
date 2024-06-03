import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { AUTHACTIONS } from "../../actions/authActions";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";

const LoginPage = () => {
  const { user, loginUser, dispatch, googleSignIn, facebookSignIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      return navigate("/");
    }
  }, [user, navigate]);

  const handleLoginUser = async () => {
    try {
      if (email.trim() == "") {
        alert("ئیمەیڵەکەت بنووسە");
      } else if (password.trim() == "") {
        alert("وشەی نهێنیت بنووسە");
      } else {
        const userData = {
          email,
          password,
        };

        await loginUser(userData);
      }
    } catch (error) {
      dispatch({ type: AUTHACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col gap-5 py-5 items-center w-[450px] h-[525px] mainShadow rounded-md">
        <h2 className="text-xl font-semibold">چوونەژوورەوە</h2>

        <div className="flex flex-col justify-center items-center gap-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ئیمەیڵ"
            className="w-[400px] p-2 border border-[#e4e4e5] rounded-md text-right"
            required
          />

          <div className="flex flex-col justify-start items-start gap-1">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="وشەی نهێنی"
              className="w-[400px] p-2 border border-[#e4e4e5] rounded-md text-right"
              required
            />

            <Link to="/forgot-password" className="text-gray-400">
              وشەی نهێنیت لەبیر کردووە؟
            </Link>
          </div>

          <button
            onClick={handleLoginUser}
            className="w-[400px] py-3 rounded-md text-[#fff] bg-[#FF6F00] active:scale-95 transfrom transition-all ease-in-out duration-200"
          >
            چوونەژوورەوە
          </button>

          <div className="flex justify-center items-center gap-2 w-full">
            <span className="w-full h-0.5 bg-gray-100"></span>
            <p className="text-gray-400">یان</p>
            <span className="w-full h-0.5 bg-gray-100"></span>
          </div>

          <button
            onClick={googleSignIn}
            className="flex flex-row-reverse justify-start items-start gap-2 w-[400px] p-2 rounded-md border border-[#e4e4e5] active:scale-95 transfrom transition-all ease-in-out duration-200"
          >
            <FcGoogle size={30} />
            <p>بچۆ ژوورەوە لەڕێگای گوگڵ</p>
          </button>

          <button
            onClick={facebookSignIn}
            className="flex flex-row-reverse justify-start items-start gap-2 w-[400px] p-2 rounded-md border border-[#e4e4e5] active:scale-95 transfrom transition-all ease-in-out duration-200"
          >
            <FaFacebookF size={30} color="blue" />
            <p>بچۆ ژوورەوە لەڕێگای فەیسبووک</p>
          </button>

          <p>
            هەژمارت نییە؟{" "}
            <Link to="/signup" className="text-[#FF6F00] hover:opacity-70">
              خۆت تۆماربکە
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
