import React from "react";
import Logo from "../../assets/img/logo.png";
import { Link } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { RxDashboard } from "react-icons/rx";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { GrNotes } from "react-icons/gr";
import { PiUsersThree } from "react-icons/pi";
import { CiLocationOn, CiLogout } from "react-icons/ci";
import { useAuth } from "../../context/AuthContext";
import { SiBrandfolder } from "react-icons/si";
import { LuTableProperties } from "react-icons/lu";
import { CiStar } from "react-icons/ci";

const SideBar = () => {
  const { logOutUser } = useAuth();

  return (
    <div className="static top-0 left-0 flex flex-col p-3 justify-between items-start gap-3 mainShadow w-full h-full">

      <div className="flex flex-col gap-6 justify-start items-start">
        <Link to="/admin/home">
          <img src={Logo} className="h-[100px]" alt="Logo" />
        </Link>

        <div className="flex flex-col justify-start items-start gap-3">
          <Link
            to="/admin/home"
            className="flex justify-center items-center gap-1 hover:bg-[#969393]/25 rounded-md active:scale-95 transform transition-all ease-in-out duration-100 p-2"
          >
            <GoHome size={25} />
            Home
          </Link>

          <Link
            to="/admin/categories"
            className="flex justify-center items-center gap-1 hover:bg-[#969393]/25 rounded-md active:scale-95 transform transition-all ease-in-out duration-100 p-2"
          >
            <RxDashboard size={25} /> Categories
          </Link>

          <Link
            to="/admin/brands"
            className="flex justify-center items-center gap-1 hover:bg-[#969393]/25 rounded-md active:scale-95 transform transition-all ease-in-out duration-100 p-2"
          >
            <SiBrandfolder size={25} /> Brands
          </Link>

          <Link
            to="/admin/properties"
            className="flex justify-center items-center gap-1 hover:bg-[#969393]/25 rounded-md active:scale-95 transform transition-all ease-in-out duration-100 p-2"
          >
            <LuTableProperties size={25} /> Properties
          </Link>

          <Link
            to="/admin/products"
            className="flex justify-center items-center gap-1 hover:bg-[#969393]/25 rounded-md active:scale-95 transform transition-all ease-in-out duration-100 p-2"
          >
            <HiOutlineShoppingBag size={25} /> Products
          </Link>

          <Link
            to="/admin/orders"
            className="flex justify-center items-center gap-1 hover:bg-[#969393]/25 rounded-md active:scale-95 transform transition-all ease-in-out duration-100 p-2"
          >
            <GrNotes size={25} /> Orders
          </Link>

          <Link
            to="/admin/customers"
            className="flex justify-center items-center gap-1 hover:bg-[#969393]/25 rounded-md active:scale-95 transform transition-all ease-in-out duration-100 p-2"
          >
            <PiUsersThree size={25} /> Customers
          </Link>

          <Link
            to="/admin/locations"
            className="flex justify-center items-center gap-1 hover:bg-[#969393]/25 rounded-md active:scale-95 transform transition-all ease-in-out duration-100 p-2"
          >
            <CiLocationOn size={25} /> Locations
          </Link>

          <Link
            to="/admin/reviews"
            className="flex justify-center items-center gap-1 hover:bg-[#969393]/25 rounded-md active:scale-95 transform transition-all ease-in-out duration-100 p-2"
          >
            <CiStar size={25} /> Reviews
          </Link>

          <button
            onClick={logOutUser}
            className="flex justify-center items-center gap-1 hover:bg-[#969393]/25 rounded-md active:scale-95 transform transition-all ease-in-out duration-100 p-2"
          >
            <CiLogout size={25} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
