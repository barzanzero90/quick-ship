import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { AUTHACTIONS } from "../../actions/authActions";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase/firebaseConfig";

const SignUpPage = () => {
  const { user, signUpUser, dispatch, googleSignIn, facebookSignIn, loading } =
    useAuth();
  const navigate = useNavigate();
  const [userImage, setUserImage] = useState(null);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user && !loading) {
      return navigate("/");
    }
  }, [user, loading, navigate]);

  const handleUploadUserImage = async () => {
    try {
      const storageRef = ref(storage, `${userImage.name}`);
      await uploadBytes(storageRef, userImage);
      const userImageURL = await getDownloadURL(storageRef);
      return userImageURL;
    } catch (error) {
      dispatch({ type: AUTHACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const handleSignUpUser = async () => {
    try {
      if (!userImage) {
        alert("وێنەی هەژمارەکەت دابنێ");
      } else if (fullName.trim() == "") {
        alert("ناوی تەواوت بنووسە");
      } else if (!phoneNumber) {
        alert("ژمارە مۆبایلت بنووسە");
      } else if (email.trim() == "") {
        alert("ئیمەیڵەکەت بنووسە");
      } else if (password.trim() == "") {
        alert("وشەی نهێنیت بنووسە");
      } else {
        let userImageURL = null;
        if (userImage) {
          userImageURL = await handleUploadUserImage();
        }

        const userData = {
          userImageURL,
          fullName,
          phoneNumber,
          email,
          password,
          userMoney: 0,
          isAdmin: false,
          createdAt: new Date(),
          lastLogin: new Date(),
        };

        await signUpUser(userData);
      }
    } catch (error) {
      dispatch({ type: AUTHACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  return (
    <div className="py-[30px]">
      <div className="flex justify-center items-center h-screen">
        {loading ? (
          <div
            className="absolute top-0 left-0 w-full h-full flex flex-col gap-2 justify-center items-center bg-black/50 backdrop-blur-sm"
            style={{ zIndex: 999 }}
          >
            <div className="loader"></div>
            <p>...چاوەڕێ بە</p>
          </div>
        ) : (
          <div className="auth flex flex-col gap-5 py-5 items-center w-[450px] h-[625px] mainShadow rounded-md">
            <h2 className="text-xl font-semibold">خۆتۆمارکردن</h2>

            <div className="w-full flex flex-col justify-center items-center gap-4">
              <input
                type="file"
                accept="images/*"
                onChange={(e) => setUserImage(e.target.files[0])}
                placeholder="وێنەی هەژمار"
                className="auth-input-and-btn w-[400px] p-2 border border-[#e4e4e5] rounded-md text-right"
                required
              />

              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="ناوی تەواو"
                className="auth-input-and-btn w-[400px] p-2 border border-[#e4e4e5] rounded-md text-right"
                required
              />

              <input
                type="number"
                min={0}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="ژمارەی مۆبایل"
                className="auth-input-and-btn w-[400px] p-2 border border-[#e4e4e5] rounded-md text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                required
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ئیمەیڵ"
                className="auth-input-and-btn w-[400px] p-2 border border-[#e4e4e5] rounded-md text-right"
                required
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="وشەی نهێنی"
                className="auth-input-and-btn w-[400px] p-2 border border-[#e4e4e5] rounded-md text-right"
                required
              />

              <button
                onClick={handleSignUpUser}
                className="auth-input-and-btn w-[400px] py-3 rounded-md text-[#fff] bg-[#FF6F00] active:scale-95 transfrom transition-all ease-in-out duration-200"
              >
                خۆتۆمارکردن
              </button>

              <div className="flex justify-center items-center gap-2 w-full">
                <span className="w-full h-0.5 bg-gray-100"></span>
                <p className="text-gray-400">یان</p>
                <span className="w-full h-0.5 bg-gray-100"></span>
              </div>

              <button
                onClick={googleSignIn}
                className="auth-input-and-btn flex flex-row-reverse justify-start items-start gap-2 w-[400px] p-2 rounded-md border border-[#e4e4e5] active:scale-95 transfrom transition-all ease-in-out duration-200"
              >
                <FcGoogle size={30} />
                <p>خۆت تۆماربکە لەڕێگای گوگڵ</p>
              </button>

              <button
                onClick={facebookSignIn}
                className="auth-input-and-btn flex flex-row-reverse justify-start items-start gap-2 w-[400px] p-2 rounded-md border border-[#e4e4e5] active:scale-95 transfrom transition-all ease-in-out duration-200"
              >
                <FaFacebookF size={30} color="blue" />
                <p>خۆت تۆماربکە لەڕێگای فەیسبووک</p>
              </button>

              <p>
                پێشتر خۆت تۆمارکردووە؟{" "}
                <Link to="/login" className="text-[#FF6F00] hover:opacity-70">
                  چوونەژوورەوە
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;
