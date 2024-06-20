import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { useProducts } from "../context/ProductsContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import UserAddressModal from "./modals/UserAddressModal";
import { FormatMoney } from "../utils/FormatMoney";
import { useOrders } from "../context/OrdersContext";
import AddToCartModal from "./modals/AddToCartModal";

const Hero = ({ product }) => {
  const { userExistsInLocalStorage, user } = useAuth();
  const { toggleWishList, getUserWishLists, wishLists } = useProducts();
  const { orders } = useOrders();
  const [totalPrice, setTotalPrice] = useState(0);
  const [showUserAddressModal, setShowUserAddressModal] = useState(false);
  const [selectedProductAttributes, setSelectedProductAttributes] = useState(
    []
  );
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);

  useEffect(() => {
    if (user) {
      getUserWishLists(user);
    }
  }, [user]);

  useEffect(() => {
    if (product) {
      const price =
        product.discountType === "Flat"
          ? product.productPrice - product.productDiscount
          : product.productPrice * (1 - product.productDiscount / 100);
      setTotalPrice(price);
    }

    // Initialize selectedProductAttributes to select the first sub-attribute by default
    const initialAttributes = product.productAttributes
      ? product.productAttributes.map((attr) =>
          attr.subAttributes.length > 0 ? attr.subAttributes[0] : ""
        )
      : [];
    setSelectedProductAttributes(initialAttributes);
  }, [product]);

  const isWishListed = wishLists.some(
    (wishList) => wishList.product.id == product.id
  );

  const handleAddToCart = (selectedProduct) => {
    setSelectedProduct(selectedProduct);
    setShowAddToCartModal(true);
  };

  return (
    <div className="hero relative bg-[#F5E5D7] w-full h-[600px] flex flex-col justify-center items-center gap-5 pt-48 pb-2">
      <div className="hero flex flex-wrap flex-row-reverse justify-start items-center mx-auto gap-10">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.productThumbnailImageURL}
            className="w-[350px] h-[400px] rounded-md"
            alt=""
          />
        </Link>

        <div className="flex flex-col justify-end items-end gap-3 px-2">
          <Link
            to={`/product/${product.id}`}
            className="max-w-[400px] text-3xl text-right text-wrap font-semibold hover:underline hover:underline-offset-2"
          >
            {product.productName}
          </Link>

          <Link
            to={`/product/${product.id}`}
            className="text-right max-w-[400px] hover:underline hover:underline-offset-2"
          >
            {product.productDescription.slice(0, 300)}
          </Link>

          <div className="flex justify-center items-center gap-1">
            {product.productDiscount ? (
              <>
                {product.discountType == "Flat" ? (
                  <div className="flex flex-col justify-center items-center gap-2">
                    <div className="flex justify-center items-center gap-2">
                      <p className="text-2xl text-[#FF6F00]">
                        {FormatMoney(
                          product.productPrice - product.productDiscount
                        )}{" "}
                        IQD
                      </p>
                      <p className="text-[#969393] text-sm line-through">
                        {FormatMoney(product.productDiscount)}IQD
                      </p>
                    </div>
                    <p className="text-xl">
                      {FormatMoney(
                        product.productPrice - product.productDiscount
                      )}{" "}
                      IQD
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center gap-2">
                    <div className="flex justify-center items-center gap-2">
                      <p className="text-2xl text-[#FF6F00]">
                        {FormatMoney(
                          product.productPrice *
                            (1 - product.productDiscount / 100)
                        )}{" "}
                        IQD
                      </p>
                      <p className="text-[#969393] text-sm line-through">
                        {FormatMoney(product.productPrice)} IQD
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col justify-center items-center gap-2">
                <p className="text-xl">
                  {FormatMoney(product.productPrice)} IQD
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap flex-row-reverse justify-center items-center gap-3">
            <button
              onClick={() =>
                user
                  ? toggleWishList(user, product)
                  : alert("تکایە سەرەتا بچۆ ژوورەوە")
              }
              className="bg-[#FF6F00] py-2 px-3 text-white rounded-md active:scale-95 transform transition-all ease-in-out duration-100 hover:bg-[#e47017]"
            >
              {isWishListed
                ? "بیسڕەوە لە لیستی دڵخوازەکان"
                : "زیادی بکە بۆ لیستی دڵخوازەکان"}
            </button>

            <button
              onClick={() =>
                user
                  ? handleAddToCart(product)
                  : alert("تکایە سەرەتا بچۆ ژوورەوە")
              }
              className="bg-[#FF6F00] py-2 px-3 text-white rounded-md active:scale-95 transform transition-all ease-in-out duration-100 hover:bg-[#e47017]"
            >
              زیادبکە بۆ سەبەتەی کڕین
            </button>

            {showAddToCartModal && (
              <AddToCartModal
                showAddToCartModal={showAddToCartModal}
                setShowAddToCartModal={setShowAddToCartModal}
                product={selectedProduct}
              />
            )}

            <button
              onClick={() =>
                userExistsInLocalStorage
                  ? user?.userMoney >= totalPrice
                    ? setShowUserAddressModal(!showUserAddressModal)
                    : alert("باڵانسی پێویستت نییە بۆ داواکردنی ئەم بەرهەمە")
                  : alert("تکایە سەرەتا بچۆ ژوورەوە")
              }
              className="bg-[#FF6F00] py-2 px-3 text-white rounded-md active:scale-95 transform transition-all ease-in-out duration-100 hover:bg-[#e47017]"
            >
              ئێستا بیکڕە
            </button>

            {showUserAddressModal && (
              <UserAddressModal
                showUserAddressModal={showUserAddressModal}
                setShowUserAddressModal={setShowUserAddressModal}
                user={user}
                cart={[
                  {
                    product,
                    selectedProductAttributes,
                    totalPrice,
                    quantity: 1,
                  },
                ]}
                orderNote={""}
                totalMoney={totalPrice}
                isFromCart={false}
              />
            )}
          </div>
        </div>
      </div>

      <div className="relative flex flex-col justify-end items-end gap-3">
        <h2 className="text-xl font-semibold">مامەڵەکانی ئەمڕۆ</h2>

        <div className="flex flex-row-reverse flex-wrap justify-center items-center gap-4">
          {orders
            .filter((order) => order.orderType == "Product")
            .slice(0, 3)
            .flatMap((productOrder, index) => (
              <ProductCard
                key={index}
                product={productOrder.product.product}
                onAddToCart={handleAddToCart}
              />
            ))}
        </div>

        {showAddToCartModal && (
          <AddToCartModal
            showAddToCartModal={showAddToCartModal}
            setShowAddToCartModal={setShowAddToCartModal}
            product={selectedProduct}
          />
        )}
      </div>
    </div>
  );
};

export default Hero;
