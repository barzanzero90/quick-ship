import React, { Suspense, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { IoIosArrowBack } from "react-icons/io";
import { useParams } from "react-router-dom";
import { useProducts } from "../../context/ProductsContext";
import { FiEdit2, FiMoreVertical } from "react-icons/fi";
import { PiTrashThin } from "react-icons/pi";
import DeleteProduct from "../../components/admin/modals/DeleteProduct";
import { FormatMoney } from "../../utils/FormatMoney";
import EditProductModal from "../../components/admin/modals/EditProductModal";
import { useOrders } from "../../context/OrdersContext";
import { FormatDate } from "../../utils/FormatDate";
import OrderActions from "../../components/admin/OrderActions";

const getStatus = (status) => {
  if (status.isPending) return "Pending";
  if (status.isConfirmed) return "Confirmed";
  if (status.isOnDelivered) return "On delivery";
  if (status.isDelivered) return "Delivered";
  if (status.isCompleted) return "Completed";
  if (status.isCancelled) return "Cancelled";
};

const AdminProductPage = () => {
  const { user } = useAuth();
  const { productId } = useParams();
  const { products } = useProducts();
  const [product, setProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // State to track the index of the selected image
  // const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);
  const { orders } = useOrders();
  const [showOrderActions, setShowOrderActions] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const getProduct = () => {
    const foundProduct = products.find((product) => product.id === productId);
    setProduct(foundProduct);
  };

  useEffect(() => {
    getProduct();
  }, [products, productId]);

  const handleImageSelect = (index) => {
    setSelectedImageIndex(index);
  };

  const handleSelectedOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderActions(true);
  };

  return (
    <>
      {user ? (
        <>
          {user.isAdmin ? (
            <>
              {product ? (
                <div className="flex flex-col justify-center items-center gap-10 w-full">
                  <header className="flex justify-between items-center w-full h-12 px-2 mainShadow">
                    <button
                      title="Back"
                      onClick={() => history.back()}
                      className="hover:bg-[#969393]/25 rounded-full p-1 active:scale-95 transform transition-all ease-in-out duration-100"
                    >
                      <IoIosArrowBack size={25} />
                    </button>

                    <h3 className="text-lg font-semibold">
                      {product.productName} product
                    </h3>

                    <div className="flex justify-center items-center gap-3">
                      {/*  <button
                        onClick={() =>
                          setShowEditProductModal(!showEditProductModal)
                        }
                        className="flex justify-center items-center gap-1 bg-blue-700 hover:bg-blue-800 p-1 text-white rounded-md active:scale-95 transform transition-all ease-in-out duration-100"
                      >
                        <FiEdit2 size={20} />
                        Edit product
                      </button> */}

                      <button
                        onClick={() =>
                          setShowDeleteProductModal(!showDeleteProductModal)
                        }
                        className="flex justify-center items-center gap-1 bg-red-700 hover:bg-red-800 p-1 text-white rounded-md active:scale-95 transform transition-all ease-in-out duration-100"
                      >
                        <PiTrashThin size={25} />
                        Delete product
                      </button>
                    </div>
                  </header>

                  {/*  {showEditProductModal && (
                    <EditProductModal
                      showEditProductModal={showEditProductModal}
                      setShowEditProductModal={setShowEditProductModal}
                      product={product}
                    />
                  )} */}

                  {showDeleteProductModal && (
                    <DeleteProduct
                      showDeleteProductModal={showDeleteProductModal}
                      setShowDeleteProductModal={setShowDeleteProductModal}
                      product={product}
                    />
                  )}

                  <div className="flex flex-wrap justify-around items-start w-full px-2 border-b border-b[#969393] pb-3">
                    <Suspense fallback={<>Loading...</>}>
                      <div className="flex justify-start items-start gap-2">
                        <div className="flex flex-col justify-start items-center gap-2">
                          {product.productImageURLS.map(
                            (productImageURL, index) => (
                              <img
                                key={index}
                                src={productImageURL}
                                className={`h-[50px] rounded-md cursor-pointer ${
                                  selectedImageIndex === index
                                    ? "border-2 border-blue-500"
                                    : ""
                                }`}
                                alt=""
                                onClick={() => handleImageSelect(index)}
                              />
                            )
                          )}
                        </div>

                        <div>
                          <img
                            src={product.productImageURLS[selectedImageIndex]}
                            className="w-full h-[300px] rounded-md"
                            alt=""
                          />
                        </div>
                      </div>
                    </Suspense>

                    <div className="flex flex-col justify-start items-start gap-4">
                      <h1 className="text-2xl font-bold">
                        Name: {product.productName}
                      </h1>
                      <p className="w-[400px] whitespace-pre-wrap">
                        Description: {product.productDescription}
                      </p>
                      <p>
                        Estimate Shipping Time :{" "}
                        <strong>{product.shippingDays} days</strong>
                      </p>
                      <p>Category: {product.productCategory.categoryName}</p>
                      <p className="flex justify-center items-center gap-1">
                        Brand:{" "}
                        <img
                          src={product.productBrand.brandImageURL}
                          title={`${product.productBrand.brandName} brand`}
                          alt=""
                          className="h-10"
                        />
                      </p>
                      <p>Price: {FormatMoney(product.productPrice)}IQD</p>
                      <p className="flex justify-center items-center gap-2">
                        Colors:{" "}
                        {product.productColors.map((color) => (
                          <span
                            style={{
                              backgroundColor: `#${color.colorCode}`,
                              padding: "5px",
                              borderRadius: "8px",
                              width: "40px",
                              height: "40px",
                            }}
                            title={`${color.colorName} color`}
                          ></span>
                        ))}
                      </p>

                      <div>
                        {product.productAttributes.map(
                          (productAttribute, index) => (
                            <div
                              key={index}
                              className="flex justify-start items-center gap-6"
                            >
                              {productAttribute.attributeName}:
                              {productAttribute.subAttributes.map(
                                (subAttribute, index) => (
                                  <div key={index}>{subAttribute.label}</div>
                                )
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex flex-col justify-start items-start gap-4 p-2">
                    <h2 className="text-xl font-semibold">
                      Orders for this product
                    </h2>

                    <div className="flex flex-wrap justify-center items-center mx-auto gap-4 p-2">
                      {orders
                        .filter(
                          (order) =>
                            order.orderType == "Product" &&
                            order.product.product.id == product.id
                        )
                        .map((order) => (
                          <div className="relative flex flex-col justify-start items-start gap-4 w-[300px] rounded-md border border-[#e4e4e5] text-right p-2">
                            <button
                              title="Order actions"
                              onClick={() => handleSelectedOrder(order)}
                              className="absolute top-1 right-1 transform transition-all ease-in-out duration-100 p-1 hover:bg-[#969393]/15 rounded-full active:scale-95"
                            >
                              <FiMoreVertical size={25} />
                            </button>

                            {showOrderActions && selectedOrder === order && (
                              <OrderActions
                                setShowOrderActions={setShowOrderActions}
                                order={selectedOrder}
                              />
                            )}

                            <strong className="text-lg">
                              Order type : {order.orderType}
                            </strong>

                            <strong className="text-lg">
                              Prodcut name : {order.product.product.productName}
                            </strong>

                            <strong className="text-lg">
                              Date : {FormatDate(order.orderedAt)}
                            </strong>

                            <strong className="text-lg">
                              Quantity : {order.product.quantity}
                            </strong>

                            <strong className="text-lg">
                              Price : {FormatMoney(order.product.totalPrice)}{" "}
                              IQD
                            </strong>

                            <strong className="text-lg">
                              Status : {getStatus(order.orderStatus)}
                            </strong>

                            <strong className="text-lg flex justify-center items-center gap-0.5">
                              By :
                              <div className="flex justify-center items-center gap-1">
                                <img
                                  src={order.user.userImageURL}
                                  className="w-8 h-8 rounded-full object-cover"
                                  alt=""
                                />
                                <p>{order.user.fullName}</p>{" "}
                              </div>
                            </strong>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>Product not found</>
              )}
            </>
          ) : (
            <>404</>
          )}
        </>
      ) : (
        <>Loading...</>
      )}
    </>
  );
};

export default AdminProductPage;
