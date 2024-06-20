import React, {
  useCallback,
  useEffect,
  useMemo,
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
              <Categories
                setShowCategories={setShowCategories}
                openNav={openNav}
                setOpenNav={setOpenNav}
              />
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
              {user ? (
                <img
                  src={user.userImageURL}
                  loading="lazy"
                  className="w-12 h-12 rounded-full object-cover"
                  alt=""
                />
              ) : (
                <div
                  className="flex justify-center items-center m-auto"
                  style={{ zIndex: 999 }}
                >
                  <div className="loader"></div>
                </div>
              )}
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
                  <Categories
                    setShowCategories={setShowCategories}
                    openNav={openNav}
                    setOpenNav={setOpenNav}
                  />
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
                  isPending={isPending}
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
