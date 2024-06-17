import React, { Suspense, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductsContext";
import { Link, useParams } from "react-router-dom";
import { FormatMoney } from "../utils/FormatMoney";
import { IoIosAdd, IoMdMore } from "react-icons/io";
import { CgMathMinus } from "react-icons/cg";
import { useOrders } from "../context/OrdersContext";
import { ORDERSACTIONS } from "../actions/ordersActions";
import AddToCartModal from "../components/modals/AddToCartModal";
import UserAddressModal from "../components/modals/UserAddressModal";
import { useReviews } from "../context/ReviewsContext";
import { FormatDate } from "../utils/FormatDate";
import { BsStar, BsStarFill } from "react-icons/bs";
import { PiTrash } from "react-icons/pi";
import ReviewActionsModal from "../components/modals/ReviewActionsModal";
import { Helmet } from "react-helmet";

const ProductPage = () => {
  const { productId } = useParams();
  const { user, userExistsInLocalStorage } = useAuth();
  const { products, getUserWishLists, wishLists, toggleWishList, addToCart } =
    useProducts();
  const [product, setProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [showUserAddressModal, setShowUserAddressModal] = useState(false);
  const { reviews, deleteReview } = useReviews();
  const [selectedProductAttributes, setSelectedProductAttributes] = useState(
    () => {
      return product && product.productAttributes
        ? product.productAttributes.map((attr) =>
            attr.subAttributes.length > 0 ? attr.subAttributes[0].label : ""
          )
        : [];
    }
  );
  const [showReviewActionsModal, setShowReviewActionsModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const getProduct = () => {
    const foundProduct = products.find((product) => product.id == productId);
    setProduct(foundProduct);
  };

  useEffect(() => {
    getProduct();
  }, [products, productId]);

  useEffect(() => {
    if (user) {
      getUserWishLists(user);
    }
  }, [user]);

  const isWishList = wishLists.some(
    (wishList) => wishList.product.id == product?.id
  );

  useEffect(() => {
    if (product) {
      const price =
        product.discountType === "Flat"
          ? quantity * product.productPrice - product.productDiscount
          : quantity *
            product.productPrice *
            (1 - product.productDiscount / 100);
      setTotalPrice(price);
    }
  }, [product, quantity]);

  const handleImageSelect = (index) => {
    setSelectedImageIndex(index);
  };

  let decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  let increaseQuantity = () => {
    if (quantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleAttributeChange = (attributeIndex, subAttributeLabel) => {
    const updatedAttributes = [...selectedProductAttributes];
    updatedAttributes[attributeIndex] = subAttributeLabel;
    setSelectedProductAttributes(updatedAttributes);
  };

  // Filter reviews for the specific product
  var stars = reviews
    .filter((review) => review.productId == product?.id)
    .map((review) => review.reviewStar);

  // Calculate the sum of star ratings
  var sum = stars.reduce((sum, item) => sum + item, 0);

  // Calculate the count of reviews
  var count = stars.length;

  // Calculate the average rating
  var averageRating = count > 0 ? sum / count : 0;

  // console.log(averageRating);

  const handleSelectedReview = (selectedReview) => {
    if (showReviewActionsModal == true) {
      setShowReviewActionsModal(false);
    } else {
      setSelectedReview(selectedReview);
      setShowReviewActionsModal(true);
    }
  };

  return (
    <main className="pt-[30px] w-full">
      {product ? (
        <div className="flex flex-col gap-5">
          <Helmet>
            <title>{product.productName} | گەیاندنی خێرا</title>
          </Helmet>

          <div className="product flex flex-wrap justify-between items-start w-full p-3">
            <div className="flex justify-start items-start gap-2">
              <Suspense fallback={<>Loading...</>}>
                <div className="product-images flex flex-row-reverse justify-start items-start gap-2">
                  <div className="product-right-images flex flex-col justify-start items-center gap-2">
                    {product.productImageURLS.map((productImageURL, index) => (
                      <img
                        key={index}
                        src={productImageURL}
                        className={`h-[50px] rounded-md cursor-pointer ${
                          selectedImageIndex === index
                            ? "border-2 border-[#FF6F00]"
                            : ""
                        }`}
                        alt=""
                        onClick={() => handleImageSelect(index)}
                      />
                    ))}
                  </div>

                  <div className="w-full">
                    <img
                      src={product.productImageURLS[selectedImageIndex]}
                      className="product-main-image w-full h-[500px] rounded-md"
                      alt=""
                    />
                  </div>
                </div>
              </Suspense>
            </div>

            <div className="product-info flex flex-col text-right justify-end items-end gap-4">
              <h1 className="text-2xl font-bold">{product.productName}</h1>
              <p className="max-w-[500px]">
                وەسف : {product.productDescription}
              </p>
              <p>
                ماوەی گەیاندن: <strong>{product.shippingDays} ڕۆژ</strong>
              </p>
              <p>
                هاوپۆل:{" "}
                <Link
                  to={`/category/${product.productCategory.categorySlug}`}
                  className="text-[#FF6F00] hover:text-[#FF6F00]/75"
                >
                  {product.productCategory.categoryName}
                </Link>
              </p>
              <p className="flex flex-row-reverse justify-center items-center gap-1">
                :براند
                <img
                  src={product.productBrand.brandImageURL}
                  title={`${product.productBrand.brandName} بڕاندی`}
                  alt=""
                  className="h-10"
                />
              </p>
              <div className="flex justify-center items-center gap-1">
                {product.productDiscount ? (
                  <>
                    {product.discountType == "Flat" ? (
                      <div className="flex flex-col justify-center items-center gap-2">
                        <div className="flex justify-center items-center gap-2">
                          <p className="text-2xl text-[#FF6F00]">
                            {FormatMoney(
                              product.productPrice - product.productDiscount
                            )}
                          </p>
                          <p className="text-[#969393] text-sm line-through">
                            {FormatMoney(product.productDiscount)}IQD
                          </p>
                          : نرخ
                        </div>
                        <p className="text-xl">
                          {FormatMoney(
                            quantity * product.productPrice -
                              product.productDiscount
                          )}{" "}
                          IQD : کۆی گشتی
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
                          : نرخ
                        </div>
                        <p className="text-xl">
                          {FormatMoney(
                            quantity *
                              product.productPrice *
                              (1 - product.productDiscount / 100)
                          )}{" "}
                          IQD : کۆی گشتی
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col justify-center items-center gap-2">
                    <p className="text-xl">
                      {FormatMoney(product.productPrice)} : نرخ
                    </p>
                    <p>
                      {FormatMoney(quantity * product.productPrice)} IQD : کۆی
                      گستی نرخ
                    </p>
                  </div>
                )}{" "}
              </div>
              <p className="flex justify-center items-center gap-2">
                {product.productColors.map((color, index) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: `#${color.colorCode}`,
                      padding: "5px",
                      borderRadius: "8px",
                      width: "40px",
                      height: "40px",
                    }}
                    title={`${color.colorName} ڕەنگی`}
                  ></span>
                ))}
                :رەنگ
              </p>

              <div className="flex flex-col justify-end items-end gap-4">
                {product.productAttributes.map((productAttribute, index) => (
                  <div
                    key={index}
                    className="flex flex-row-reverse justify-center items-center gap-2"
                  >
                    <span>: {productAttribute.attributeName}</span>
                    <div className="flex justify-center items-center gap-2">
                      {productAttribute.subAttributes.map(
                        (subAttribute, subIndex) => (
                          <button
                            key={subIndex}
                            onClick={() =>
                              handleAttributeChange(index, subAttribute.label)
                            }
                            className={`p-1 border rounded-md ${
                              selectedProductAttributes[index] ===
                              subAttribute.label
                                ? "bg-[#FF6F00] text-white"
                                : "bg-white text-black"
                            }`}
                          >
                            {subAttribute.label}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center items-center gap-2">
                {quantity == 1 ? (
                  <button
                    disabled
                    className="bg-[#FF6F00]/50 text-white rounded-full p-1 hover:bg-[#FF6F00]/45 active:scale-95 transform transition-all duration-100 ease-in-out"
                  >
                    <CgMathMinus size={25} />
                  </button>
                ) : (
                  <button
                    onClick={decreaseQuantity}
                    className="bg-[#FF6F00] text-white rounded-full p-1 hover:bg-[#FF6F00]/90 active:scale-95 transform transition-all duration-100 ease-in-out"
                  >
                    <CgMathMinus size={25} />
                  </button>
                )}

                <p>{quantity}</p>

                <button
                  onClick={increaseQuantity}
                  className="bg-[#FF6F00] text-white rounded-full p-1 hover:bg-[#FF6F00]/90 active:scale-95 transform transition-all duration-100 ease-in-out"
                >
                  <IoIosAdd size={25} />
                </button>
                <p>: بڕ</p>
              </div>

              <div className="flex flex-row-reverse flex-wrap justify-center items-center gap-3">
                <button
                  onClick={() =>
                    userExistsInLocalStorage || user
                      ? toggleWishList(user, product)
                      : alert("تکایە سەرەتا بچۆ ژووەرەوە")
                  }
                  className="bg-[#FF6F00] py-2 px-3 text-white rounded-md active:scale-95 transform transition-all ease-in-out duration-100 hover:bg-[#e47017]"
                >
                  {isWishList
                    ? "بیسڕەوە لە لیستی دڵخوازەکان"
                    : "زیادبکە بۆ لیستی دڵخوازەکان"}
                </button>

                <button
                  onClick={() =>
                    userExistsInLocalStorage
                      ? setShowAddToCartModal(!showAddToCartModal)
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
                    product={product}
                  />
                )}

                <button
                  onClick={() =>
                    userExistsInLocalStorage
                      ? user?.userMoney >= totalPrice
                        ? setShowUserAddressModal(!showUserAddressModal)
                        : alert(
                            "ناتوانیت داوای ئەم بەرهەمە بکەیت، چونکە باڵانسی پێویستت نییە"
                          )
                      : alert("تکایە سەرەتا بچۆ ژوورەوە")
                  }
                  className="bg-[#FF6F00] py-2 px-3 text-white rounded-md active:scale-95 transform transition-all ease-in-out duration-100 hover:bg-[#e47017]"
                >
                  داواکردن
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

          <div className="flex flex-col justify-end items-end gap-3 p-2 w-full">
            <h2 className="text-xl font-semibold border-b border-b-[#e4e4e5] w-full py-2 text-right">
              بۆچوونەکان
            </h2>

            <div className="product-reviews flex flex-row-reverse flex-wrap justify-start items-start gap-4 w-full p-2">
              {reviews.filter((review) => review.productId == product.id)
                .length == 0 ? (
                <strong className="text-xl">
                  .هیچ بۆچوونێک دانەنراوە جارێ
                </strong>
              ) : (
                <>
                  <div className="flex flex-auto flex-col justify-center items-center gap-4">
                    {reviews
                      .filter((review) => review.productId == product.id)
                      .map((review, index) => (
                        <div
                          key={index}
                          className="w-full flex flex-row-reverse gap-6 p-2 border-b border-b-[#e4e4e5] last:border-none"
                        >
                          <img
                            src={review.user.userImageURL}
                            className="w-10 h-10 object-cover rounded-full"
                            alt=""
                          />

                          <div className="flex flex-col justify-start items-center gap-2">
                            <div className="flex flex-row-reverse justify-center items-center gap-4">
                              <strong>{review.user.fullName}</strong>
                              <p className="text-[#969393]">
                                {FormatDate(review.createdAt)}
                              </p>

                              {review.user.email == user?.email && (
                                <div className="relative">
                                  <button
                                    onClick={() => handleSelectedReview(review)}
                                    className="text-black p-1 rounded-full hover:bg-[#969393]/15 active:scale-95 transform transition-all ease-in-out duration-100"
                                  >
                                    <IoMdMore size={25} />
                                  </button>

                                  {showReviewActionsModal && (
                                    <ReviewActionsModal
                                      setShowReviewActionsModal={
                                        setShowReviewActionsModal
                                      }
                                      selectedReview={selectedReview}
                                    />
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="flex justify-center items-center gap-2">
                              {[...Array(5)].map((_, starIndex) => (
                                <React.Fragment key={starIndex}>
                                  {starIndex < review.reviewStar ? (
                                    <BsStarFill size={25} color="#FFCD3C" />
                                  ) : (
                                    <BsStar size={25} color="#FFCD3C" />
                                  )}
                                </React.Fragment>
                              ))}
                            </div>

                            <p className="whitespace-pre-wrap">
                              {review.reviewText}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>

                  <div className="flex flex-2 flex-col gap-3">
                    <div className="flex justify-start items-center gap-14 border-b border-b-[#e4e4e5] pb-2">
                      <strong className="text-xl font-sans">
                        {averageRating}
                      </strong>

                      <div className="flex justify-center items-center gap-2">
                        <BsStarFill size={25} color="#FFCD3C" />
                        <BsStarFill size={25} color="#FFCD3C" />
                        <BsStarFill size={25} color="#FFCD3C" />
                        <BsStarFill size={25} color="#FFCD3C" />
                        <BsStarFill size={25} color="#FFCD3C" />
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start gap-2.5 w-full">
                      <div className="flex justify-center items-center gap-3 w-full">
                        <strong className="font-sans">5</strong>

                        <div className="bg-[#EBEBEB] rounded-md w-full h-4 flex justify-start items-center">
                          <div
                            className={`bg-[#FFCD3C] rounded-md h-full`}
                            style={{
                              width: `${
                                reviews.filter(
                                  (review) =>
                                    review.productId == product.id &&
                                    review.reviewStar == 5
                                ).length
                              }%`,
                            }}
                          ></div>
                        </div>

                        <strong className="font-sans">
                          {
                            reviews.filter(
                              (review) =>
                                review.productId == product.id &&
                                review.reviewStar == 5
                            ).length
                          }
                        </strong>
                      </div>

                      <div className="flex justify-center items-center gap-3 w-full">
                        <strong className="font-sans">4</strong>

                        <div className="bg-[#EBEBEB] rounded-md w-full h-4 flex justify-start items-center">
                          <div
                            className={`bg-[#FFCD3C] rounded-md h-full`}
                            style={{
                              width: `${
                                reviews.filter(
                                  (review) =>
                                    review.productId == product.id &&
                                    review.reviewStar == 4
                                ).length
                              }%`,
                            }}
                          ></div>
                        </div>

                        <strong className="font-sans">
                          {
                            reviews.filter(
                              (review) =>
                                review.productId == product.id &&
                                review.reviewStar == 4
                            ).length
                          }
                        </strong>
                      </div>

                      <div className="flex justify-center items-center gap-3 w-full">
                        <strong className="font-sans">3</strong>

                        <div className="bg-[#EBEBEB] rounded-md w-full h-4 flex justify-start items-center">
                          <div
                            className={`bg-[#FFCD3C] rounded-md h-full`}
                            style={{
                              width: `${
                                reviews.filter(
                                  (review) =>
                                    review.productId == product.id &&
                                    review.reviewStar == 3
                                ).length
                              }%`,
                            }}
                          ></div>
                        </div>

                        <strong className="font-sans">
                          {
                            reviews.filter(
                              (review) =>
                                review.productId == product.id &&
                                review.reviewStar == 3
                            ).length
                          }
                        </strong>
                      </div>

                      <div className="flex justify-center items-center gap-3 w-full">
                        <strong className="font-sans">2</strong>

                        <div className="bg-[#EBEBEB] rounded-md w-full h-4 flex justify-start items-center">
                          <div
                            className={`bg-[#FFCD3C] rounded-md h-full`}
                            style={{
                              width: `${
                                reviews.filter(
                                  (review) =>
                                    review.productId == product.id &&
                                    review.reviewStar == 2
                                ).length
                              }%`,
                            }}
                          ></div>
                        </div>

                        <strong className="font-sans">
                          {
                            reviews.filter(
                              (review) =>
                                review.productId == product.id &&
                                review.reviewStar == 2
                            ).length
                          }
                        </strong>
                      </div>

                      <div className="flex justify-center items-center gap-3 w-full">
                        <strong className="font-sans">1</strong>

                        <div className="bg-[#EBEBEB] rounded-md w-full h-4 flex justify-start items-center">
                          <div
                            className={`bg-[#FFCD3C] rounded-md h-full`}
                            style={{
                              width: `${
                                reviews.filter(
                                  (review) =>
                                    review.productId == product.id &&
                                    review.reviewStar == 1
                                ).length
                              }%`,
                            }}
                          ></div>
                        </div>

                        <strong className="font-sans">
                          {
                            reviews.filter(
                              (review) =>
                                review.productId == product.id &&
                                review.reviewStar == 1
                            ).length
                          }
                        </strong>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
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
    </main>
  );
};

export default ProductPage;
