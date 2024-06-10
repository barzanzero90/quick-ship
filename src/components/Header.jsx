import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import Logo from "../assets/img/logo.png";
import { IoIosArrowDown } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CiHeart, CiSearch } from "react-icons/ci";
import { FiShoppingCart } from "react-icons/fi";
import Categories from "./Categories";
import { useProducts } from "../context/ProductsContext";
import { BiMenuAltRight } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import Search from "./Search";

const Header = () => {
  const { user, userExistsInLocalStorage } = useAuth();
  const { products, getUserWishLists, wishLists, getUserCart, cart } =
    useProducts();
  const [showCategories, setShowCategories] = useState(false);
  const location = useLocation();
  const [openNav, setOpenNav] = useState(false);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isPending, startTransition] = useTransition();

  if (location.pathname.includes("/admin")) return null;

  const searchProduct = useCallback(() => {
    try {
      if (search.length > 0) {
        setShowSearch(true);
        startTransition(() => {
          const filteredProducts = products.filter((product) =>
            product.productName.toLowerCase().includes(search.toLowerCase())
          );
          setFilteredProducts(filteredProducts);
        });
      } else {
        setShowSearch(false);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error(error.message);
    }
  }, [search, products]);

  useEffect(() => {
    searchProduct();
  }, [searchProduct]);

  useEffect(() => {
    if (user) {
      getUserWishLists(user);
      getUserCart(user);
    }
  }, [user]);

  const memorizedWishListsLength = useMemo(() => {
    return wishLists.length;
  }, [wishLists]);

  const memorizedCartLength = useMemo(() => {
    return cart.length;
  }, [cart]);

  return (
    <header
      className="sticky top-0 left-0 w-full h-16 bg-[#F5E5D7]/95 backdrop-blur-sm flex flex-row-reverse justify-between items-center px-2 gap-3"
      style={{ zIndex: 999 }}
    >
      <div className="flex justify-center items-center gap-2">
        <Link to="/" className="text-2xl font-bold">
          <img src={Logo} className="h-[100px]" alt="" />
        </Link>

        <button onClick={() => setOpenNav(!openNav)} className="md:hidden flex">
          {openNav ? <CgClose size={30} /> : <BiMenuAltRight size={30} />}
        </button>
      </div>

      <div className="relative md:flex hidden flex-row-reverse justify-center items-center gap-3">
        <div className="relative flex flex-row-reverse justify-center items-center gap-1 xl:w-[800px] w-[400px] lg:w-[500px] bg-white/75 rounded-md py-2.5 px-2">
          <CiSearch size={30} />
          <input
            type="text"
            placeholder="گەڕان"
            className="w-full bg-transparent text-right"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {showSearch && (
            <Search
              setShowSearch={setShowSearch}
              filteredProducts={filteredProducts}
              setOpenNav={setOpenNav}
              isPending={isPending}
            />
          )}
        </div>

        <div className="relative">
          <button
            onMouseEnter={() => setShowCategories(true)}
            onMouseLeave={() => setShowCategories(false)}
            className="flex flex-row-reverse justify-center items-center gap-1 w-full"
          >
            بەشەکان
            <IoIosArrowDown size={25} />
            {/* Show categories when mouse hover */}
            {showCategories && (
              <Categories setShowCategories={setShowCategories} />
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-row-reverse justify-center items-center gap-5">
        <div className="md:flex flex-row-reverse justify-center items-center gap-5 hidden">
          <div className="relative">
            <p className="absolute -top-4 left-0 w-5 h-5 rounded-full flex justify-center items-center text-center bg-red-600 text-white">
              {memorizedWishListsLength}
            </p>
            <Link to={`${user ? "/wishlists" : "/login"}`}>
              <CiHeart size={30} title="لیستی دڵخوازەکان" />
            </Link>
          </div>

          <div className="relative">
            <p className="absolute -top-[19px] left-0 w-5 h-5 rounded-full flex justify-center items-center text-center bg-red-600 text-white">
              {memorizedCartLength}
            </p>

            <Link to={`${user ? "/cart" : "/login"}`}>
              <FiShoppingCart size={25} title="سەبەتە" />
            </Link>
          </div>
        </div>

        <div className="flex">
          {userExistsInLocalStorage || user ? (
            <Link to="/profile">
              <img
                src={
                  user
                    ? user.userImageURL
                    : "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAmwMBIgACEQEDEQH/xAAbAAEAAwEBAQEAAAAAAAAAAAAABAUGAQMCB//EAC8QAQACAQIEAwcDBQAAAAAAAAABAgMEEQUSITFBUXETIjJCUmGBFMHRJGKSsbL/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A/SQAAAAAAAAAAAAAAAAAAAAAAAAOvaI3AjunabhuTJtbJPJX06peg0MYojJliJyeHlVPBEx8O01Pkm0+dpe36fDHbFT/ABh6gI99Fpr98Nfx0Q8/Co23w32n6bfytAGayYr4r8uSsxL4aLU6emopy5I9J8YUWpwX0+Scdo6d4nzB5AAAAAAAAAALDhOni95zXjpWfd9Vf6tDo8fstNjrt123n1B7wAAAAAAja/TxqMExHx161SXJ7AzAka/H7PV5IjtM80flHAAAAAAAAB2sb2iPOWnZeJ2mJ8mnrO8RMeIOgAAAAAAApuMx/U0nzp+8oCdxe2+qiPprCCAAAAAAAAAveGZva6WsTO9qe7KiSNDqf0+befgnpaAaAcrMWrExO8T1h0AAAABy0xWJmekR1l1W8V1XLX2FJ963xT5QCt1GSc2a+TwtO8ejzAAAAAAAAAAH1ix3y3imOs2mfIErQ66dPMUvvOP/AJXWPJXLSL0nes9pQdJw2mPa2ba9vLwhPiIjsDoAAAK/XcQrj3x4euTtM/Sp5mZnee892g1OlxaiPfrtP1R3VGq0eTTTvMc1PC0eHqCMAAAAAAAAD20uC2oyxSOkfNbygHdLpb6m+1elY72ntC802DHp6cuOu3nPjLuHFTDjrTHG1YegAAAAAADloiYmJjeJ8HQFRr+H8m+XBHu+NPL0VzUKniej5N8+KOnzx+4K0AAAAACImZiIjeZnbZoNFp40+GK97d7T91XwrF7TVc3y0jf8+C8AAAAAAAAAAAcmN46ugM/rtP8Ap88xHwW61R13xXD7TTTaI96nX8eKkAAAABccHpy6eb7fFb/SweGiryaXFH9u73AAAAAAAAAAAAB83rFqzWe0xszV68l7V+mdmnZ/iFeTWZY++4I4ADkgDT44iMddvKH0AAAAAAAAAAAAACj4v01k/esACGAD/9k="
                }
                loading="lazy"
                className="w-12 h-12 rounded-full object-cover"
                alt=""
              />
            </Link>
          ) : (
            <Link to="/login">چوونەژوورەوە</Link>
          )}
        </div>
      </div>

      {openNav && (
        <div className="absolute top-14 left-0 w-full bg-[#F5E5D7]/95 p-2 md:hidden flex flex-col justify-end items-end gap-4">
          <nav className="">
            <ul className="flex flex-col justify-end items-end gap-4">
              <li onClick={() => setOpenNav(!openNav)}>
                <Link to="/">سەرەتا</Link>
              </li>

              <li className="flex flex-col justify-center items-center gap-2">
                <button
                  onClick={() => setShowCategories(!showCategories)}
                  className="flex flex-row-reverse justify-center items-center gap-1"
                >
                  بەشەکان
                  <IoIosArrowDown size={25} />
                </button>

                {showCategories && (
                  <Categories setShowCategories={setShowCategories} />
                )}
              </li>
            </ul>
          </nav>

          <div className="flex flex-col justify-end items-end gap-7 w-full">
            <div className="relative">
              <p className="absolute -top-4 right-0 w-5 h-5 rounded-full flex justify-center items-center text-center bg-red-600 text-white">
                {memorizedWishListsLength}
              </p>
              <Link
                onClick={() => setOpenNav(!openNav)}
                to={`${user ? "/wishlists" : "/login"}`}
                className="flex flex-row-reverse justify-center items-center gap-2"
              >
                <CiHeart size={30} title="لیستی دڵخوازەکان" />
                <p>لیستی دڵخوازەکان</p>
              </Link>
            </div>

            <div className="relative">
              <p className="absolute -top-4 right-0 w-5 h-5 rounded-full flex justify-center items-center text-center bg-red-600 text-white">
                {memorizedCartLength}
              </p>

              <Link
                onClick={() => setOpenNav(!openNav)}
                to={`${user ? "/cart" : "/login"}`}
                className="flex flex-row-reverse justify-center items-center gap-2"
              >
                <FiShoppingCart size={25} title="سەبەتە" />
                <p>سەبەتە</p>
              </Link>
            </div>

            <div className="relative w-full flex flex-row-reverse justify-center items-center gap-1 bg-white/75 rounded-md py-2.5 px-2">
              <CiSearch size={30} />
              <input
                type="text"
                placeholder="گەڕان"
                className="w-full bg-transparent text-right"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {showSearch && (
                <Search
                  setShowSearch={setShowSearch}
                  filteredProducts={filteredProducts}
                  setOpenNav={setOpenNav}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
