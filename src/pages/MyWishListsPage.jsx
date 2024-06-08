import React, { useEffect, useState } from "react";
import { useProducts } from "../context/ProductsContext";
import { useAuth } from "../context/AuthContext";
import { FiShoppingCart, FiTrash2 } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { FormatMoney } from "../utils/FormatMoney";
import AddToCartModal from "../components/modals/AddToCartModal";
import { Helmet } from "react-helmet";

const MyWishListsPage = () => {
  const { user, loading } = useAuth();
  const { toggleWishList, getUserWishLists, wishLists } = useProducts();
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && loading) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      getUserWishLists(user);
    }
  }, [user]);

  return (
    <div className="pt-[30px]">
      {user ? (
        <div className="flex flex-col justify-center items-center bg-white mainShadow w-[95%] mx-auto rounded-md">
          <Helmet>
            <title>گەیاندنی خێرا | لیستی دڵخوازەکانم</title>
          </Helmet>

          <div className="w-full border-b border-b-[#e4e4e5]">
            <h3 className="w-full flex justify-end items-end text-xl font-semibold p-2">
              لیستی دڵخوازەکانم
            </h3>
          </div>

          <div className="flex flex-row-reverse flex-wrap justify-center items-center gap-4 py-2">
            {wishLists.length == 0 ? (
              <strong className="text-2xl p-2">لیستی دڵخوازەکان بەتاڵە</strong>
            ) : (
              <>
                {wishLists.map((wishList, index) => (
                  <div
                    key={index}
                    className="user-wish-list md:w-[350px] w-[300px] bg-white mainShadow rounded-md flex flex-col justify-center items-center gap-3"
                  >
                    <div className="relative w-full">
                      <Link to={`/product/${wishList.product.id}`}>
                        <img
                          src={wishList.product.productThumbnailImageURL}
                          className="user-wish-list-product-image w-full h-[200px] object-cover rounded-tr-md rounded-tl-md"
                          alt=""
                        />
                      </Link>

                      <button
                        onClick={() => toggleWishList(user, wishList.product)}
                        className="absolute top-2 right-2 rounded-full bg-[#FF0000] text-white p-1 hover:bg-red-600 active:scale-95 transform transition-all duration-100 ease-in-out"
                      >
                        <FiTrash2 size={25} />
                      </button>
                    </div>

                    <Link
                      to={`/product/${wishList.product.id}`}
                      className="flex flex-row-reverse justify-between items-center px-2 w-full"
                    >
                      <p className="text-lg font-semibold hover:underline hover:underline-offset-4">
                        {wishList.product.productName}
                      </p>
                      <p className="text-xl font-bold">
                        {FormatMoney(wishList.product.productPrice)} IQD
                      </p>
                    </Link>

                    <div className="py-2">
                      <button
                        onClick={() =>
                          setShowAddToCartModal(!showAddToCartModal)
                        }
                        className="user-wish-list-add-to-cart-btn flex justify-center items-center gap-2 md:w-[300px] w-[250px] rounded-md p-2 bg-[#FF6F00] text-black hover:text-white transform transition-all duration-100 ease-in-out active:scale-95"
                      >
                        <FiShoppingCart size={25} />
                        زیادبکە بۆ سەبەتەی کڕین
                      </button>
                    </div>

                    {showAddToCartModal && (
                      <AddToCartModal
                        showAddToCartModal={showAddToCartModal}
                        setShowAddToCartModal={setShowAddToCartModal}
                        product={wishList.product}
                      />
                    )}
                  </div>
                ))}
              </>
            )}
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

export default MyWishListsPage;
