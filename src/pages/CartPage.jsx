import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductsContext";
import { CgClose, CgMathMinus } from "react-icons/cg";
import { IoIosAdd } from "react-icons/io";
import { FormatMoney } from "../utils/FormatMoney";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import UserAddressModal from "../components/modals/UserAddressModal";
import { Helmet } from "react-helmet";

const CartPage = () => {
  const { user, userExistsInLocalStorage, loading } = useAuth();
  const { getUserCart, cart, deleteProductFromCart } = useProducts();
  const [orderNote, setOrderNote] = useState("");
  const [showUserAddressModal, setShowUserAddressModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userExistsInLocalStorage && loading) {
      navigate("/");
    }
  }, [userExistsInLocalStorage, loading, navigate]);

  useEffect(() => {
    if (user) {
      getUserCart(user);
    }
  }, [user]);

  let decreaseQuantity = async (cartId, quantity, unitPrice) => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      const newTotalPrice = newQuantity * unitPrice;
      const productDoc = doc(db, `users/${user.email}/cart`, cartId);
      await updateDoc(productDoc, {
        quantity: newQuantity,
        totalPrice: newTotalPrice,
      });
      getUserCart(user);
    }
  };

  let increaseQuantity = async (cartId, quantity, unitPrice) => {
    if (quantity) {
      const newQuantity = quantity + 1;
      const newTotalPrice = newQuantity * unitPrice;
      const productDoc = doc(db, `users/${user.email}/cart`, cartId);
      await updateDoc(productDoc, {
        quantity: newQuantity,
        totalPrice: newTotalPrice,
      });
      getUserCart(user);
    }
  };

  const columns = [
    {
      cell: (row) => (
        <button
          title="سرینەوە"
          onClick={() => deleteProductFromCart(user.email, row.id)}
          className="hover:bg-[#969393]/15 rounded-full p-1 active:scale-95 transform transition-all ease-in-out duration-100"
        >
          <CgClose size={20} />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "کۆی گشتی",
      selector: (row) => row.newTotalPrice,
      format: (row) => FormatMoney(row.newTotalPrice),
      cell: (row) => (
        <strong className="text-lg">{FormatMoney(row.newTotalPrice)} IQD</strong>
      ),
    },
    {
      name: "نرخ",
      selector: (row) => row.product,
      format: (row) => FormatMoney(row.product),
      cell: (row) => (
        <div className="">
          {row.product.productDiscount ? (
            <>
              {row.product.discountType == "Flat" ? (
                <div className="flex flex-col justify-center items-center gap-2">
                  <p className="text-2xl">
                    {FormatMoney(
                      row.product.productPrice - row.product.productDiscount
                    )}{" "}
                    IQD
                  </p>
                  <p className="text-[#969393] text-sm line-through">
                    {FormatMoney(row.product.productDiscount)} IQD
                  </p>
                  <p className="text-xl">
                    {FormatMoney(
                      row.product.productPrice - row.product.productDiscount
                    )}{" "}
                    IQD
                  </p>
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center gap-2">
                  <strong className="text-xl">
                    {FormatMoney(
                      row.product.productPrice *
                        (1 - row.product.productDiscount / 100)
                    )}{" "}
                    IQD
                  </strong>
                  <p className="text-[#969393] text-lg line-through">
                    {FormatMoney(row.product.productPrice)} IQD
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="flex justify-center items-center gap-2">
              <p className="text-xl">
                {FormatMoney(row.product.productPrice)} IQD
              </p>
            </div>
          )}
        </div>
      ),
    },
    {
      name: "بڕ",
      selector: (row) => row.quantity,
      cell: (row) => (
        <div className="flex justify-center items-center gap-2">
          {row.quantity === 1 ? (
            <button
              disabled
              className="bg-[#FF6F00]/50 text-white rounded-full p-1 hover:bg-[#FF6F00]/45 transform transition-all duration-100 ease-in-out"
            >
              <CgMathMinus size={25} />
            </button>
          ) : (
            <button
              onClick={() =>
                decreaseQuantity(row.id, row.quantity, row.totalPrice)
              }
              className="bg-[#FF6F00] text-white rounded-full p-1 hover:bg-[#FF6F00]/90 active:scale-95 transform transition-all duration-100 ease-in-out"
            >
              <CgMathMinus size={25} />
            </button>
          )}
          <p className="text-lg font-semibold">{row.quantity}</p>
          <button
            onClick={() =>
              increaseQuantity(row.id, row.quantity, row.totalPrice)
            }
            className="bg-[#FF6F00] text-white rounded-full p-1 hover:bg-[#FF6F00]/90 active:scale-95 transform transition-all duration-100 ease-in-out"
          >
            <IoIosAdd size={25} />
          </button>
        </div>
      ),
    },
    {
      name: "بەرهەم",
      selector: (row) => row.productName,
      cell: (row) => (
        <Link
          to={`/product/${row.productId}`}
          className="flex flex-row-reverse justify-center items-center gap-1"
        >
          <img
            src={row.productThumbnailImageURL}
            alt={row.productName}
            className="h-[75px] object-cover"
          />

          <div className="flex flex-col justify-center items-center gap-2">
            <strong className="text-lg hover:underline hover:underline-offset-4">
              {row.productName}
            </strong>

            <p>{row.selectedProductAttributes.join(" - ")}</p>
          </div>
        </Link>
      ),
    },
  ];

  const data = cart.map((cartItem) => ({
    id: cartItem.id, // Ensure this is the correct unique identifier for each cart item
    product: cartItem.product,
    productId: cartItem.product.id,
    productThumbnailImageURL: cartItem.product.productThumbnailImageURL,
    productName: cartItem.product.productName,
    quantity: cartItem.quantity,
    productPrice: cartItem.product.productPrice, // This is the unit price
    totalPrice: cartItem.product.productDiscount
      ? cartItem.product.discountType == "Flat"
        ? cartItem.product.productPrice - cartItem.product.productDiscount
        : cartItem.product.productPrice *
          (1 - cartItem.product.productDiscount / 100)
      : cartItem.product.productPrice,
      newTotalPrice: cartItem.totalPrice,
    selectedProductAttributes: cartItem.selectedProductAttributes.map(
      (selectedProductAttribute) => selectedProductAttribute.label
    ),
  }));

  const totalMoney = cart.reduce(
    (acc, cartItem) => acc + cartItem.totalPrice,
    0
  );

  // Custom styles for the DataTable
  const customStyles = {
    headCells: {
      style: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "18px",
        fontWeight: "bold",
        textAlign: "center",
        width: "100%",
        borderBottom: "1px solid #e4e4e5",
      },
    },
    cells: {
      style: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        marginTop: "10px",
        padding: "10px",
        borderBottom: "1px solid #e4e4e5",
      },
    },
  };

  return (
    <main className="pt-[30px]">
      {user ? (
        <div className="w-[95%] p-2 flex flex-col text-right gap-4 mainShadow rounded-md mx-auto">
          <Helmet>
            <title>گەیاندنی خێرا | سەبەتەکەم</title>
          </Helmet>

          <div className="flex flex-row-reverse justify-between items-center w-full px-2 pb-1.5 border-b border-b-[#e4e4e5]">
            <h2 className="cart-text text-xl font-semibold">سەبەتەکەم</h2>

            <strong className="user-cart-balance text-xl">
              باڵانسەکەم : {FormatMoney(user?.userMoney)} د.ع
            </strong>

            <div className="user-cart-balance-text">
              <strong className="">باڵانسەکەم</strong>
              <div className="flex flex-row-reverse justify-center items-center gap-0.5">
                <strong>{FormatMoney(user?.userMoney)}</strong>
                <strong>د.ع</strong>
              </div>
            </div>
          </div>

          {cart.length > 0 ? (
            <>
              <div className="cart">
                <DataTable
                  columns={columns}
                  data={data}
                  customStyles={customStyles}
                />
              </div>

              <div className="cart-products flex flex-col justify-center items-center gap-1.5 w-full">
                {cart.map((cartItem, index) => (
                  <div
                    key={index}
                    className="flex flex-row-reverse justify-between items-center w-full p-2 border-b border-b-[#e4e4e5]"
                  >
                    <Link
                      to={`/product/${cartItem.product.id}`}
                      className="flex flex-row-reverse justify-end items-center gap-1"
                    >
                      <img
                        src={cartItem.product.productThumbnailImageURL}
                        className="product-image h-[75px] object-cover"
                        alt=""
                      />

                      <div className="flex flex-col justify-end items-end gap-6">
                        <div className="flex flex-col justify-end items-end gap-0.5">
                          <strong className="text-base font-semibold">
                            {cartItem.product.productName}
                          </strong>

                          <div className="flex flex-wrap justify-end items-end gap-2">
                            {cartItem.selectedProductAttributes.map(
                              (selectedProductAttribute, index) => (
                                <div key={index}>
                                  <p className="text-xs">
                                    {selectedProductAttribute.label}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        <strong className="text-base font-semibold">
                          {cartItem.product.productDiscount ? (
                            <>
                              {cartItem.product.discountType == "Flat" ? (
                                <div className="flex flex-col-reverse justify-center items-center gap-2">
                                  <p className="cart-total-price text-base">
                                    {FormatMoney(
                                      cartItem.product.productPrice -
                                        cartItem.product.productDiscount
                                    )}{" "}
                                    IQD
                                  </p>

                                  <p className="text-[#969393] text-sm line-through">
                                    {FormatMoney(
                                      cartItem.product.productDiscount
                                    )}{" "}
                                    IQD
                                  </p>

                                  <p className="cart-total-price text-base">
                                    {FormatMoney(
                                      cartItem.product.productPrice -
                                        cartItem.product.productDiscount
                                    )}{" "}
                                    IQD
                                  </p>
                                </div>
                              ) : (
                                <div className="flex flex-col-reverse justify-center items-center gap-0.5">
                                  <strong className="cart-total-price text-base">
                                    {FormatMoney(
                                      cartItem.product.productPrice *
                                        (1 -
                                          cartItem.product.productDiscount /
                                            100)
                                    )}{" "}
                                    IQD
                                  </strong>
                                  <p className="text-[#969393] text-sm line-through">
                                    {FormatMoney(cartItem.product.productPrice)}{" "}
                                    IQD
                                  </p>
                                </div>
                              )}
                            </>
                          ) : (
                            <p className="cart-total-price text-base">
                              {FormatMoney(cartItem.product.productPrice)} IQD
                            </p>
                          )}
                        </strong>
                      </div>
                    </Link>

                    <div className="flex flex-col justify-center items-center gap-1">
                      <strong className="cart-total-price text-base font-semibold">
                        {FormatMoney(cartItem.totalPrice)} IQD
                      </strong>

                      <div className="flex justify-center items-center gap-2">
                        {cartItem.quantity === 1 ? (
                          <button
                            onClick={() =>
                              deleteProductFromCart(user?.email, cartItem.id)
                            }
                            className="bg-[#FF6F00] text-white rounded-full p-1 hover:bg-[#FF6F00]/90 active:scale-95 transform transition-all duration-100 ease-in-out"
                          >
                            <CgMathMinus size={20} />
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              decreaseQuantity(
                                cartItem.id,
                                cartItem.quantity,
                                cartItem.totalPrice
                              )
                            }
                            className="bg-[#FF6F00] text-white rounded-full p-1 hover:bg-[#FF6F00]/90 active:scale-95 transform transition-all duration-100 ease-in-out"
                          >
                            <CgMathMinus size={20} />
                          </button>
                        )}
                        <p className="text-base font-semibold">
                          {cartItem.quantity}
                        </p>
                        <button
                          onClick={() =>
                            increaseQuantity(
                              cartItem.id,
                              cartItem.quantity,
                              cartItem.totalPrice
                            )
                          }
                          className="bg-[#FF6F00] text-white rounded-full p-1 hover:bg-[#FF6F00]/90 active:scale-95 transform transition-all duration-100 ease-in-out"
                        >
                          <IoIosAdd size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <textarea
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                placeholder="تێبینی ئیختیاری"
                className="text-right w-full border border-[#e4e4e5] rounded-md p-2 resize-none overflow-y-auto"
              ></textarea>

              <div className="flex flex-row-reverse justify-between items-center w-full px-2">
                <strong>کۆی گشتی</strong>
                <strong>{FormatMoney(totalMoney)} IQD</strong>
              </div>

              <div className="flex justify-end items-end">
                <button
                  onClick={() => {
                    user?.userMoney >= totalMoney
                      ? setShowUserAddressModal(!showUserAddressModal)
                      : alert(
                          "باڵانسی پێویستت نییە بۆ داواکردنی ئەم بەرهەمانە"
                        );
                  }}
                  className="bg-[#FF6F00] w-[150px] text-black rounded-md p-2 transform transition-all duration-100 ease-in-out hover:text-white active:scale-95"
                >
                  پشکنین
                </button>

                {showUserAddressModal && (
                  <UserAddressModal
                    showUserAddressModal={showUserAddressModal}
                    setShowUserAddressModal={setShowUserAddressModal}
                    user={user}
                    cart={cart}
                    orderNote={orderNote}
                    totalMoney={totalMoney}
                    isFromCart={true}
                  />
                )}
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center text-center h-full p-3">
              <strong className="text-2xl">سەبەتەی کڕین بەتاڵە</strong>
            </div>
          )}
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

export default CartPage;
