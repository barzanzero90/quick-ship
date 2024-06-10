import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import DataTable from "react-data-table-component";
import { useOrders } from "../context/OrdersContext";
import { FormatMoney } from "../utils/FormatMoney";
import { Link, useNavigate } from "react-router-dom";
import { FormatDate } from "../utils/FormatDate";
import AddReviewModal from "../components/modals/AddReviewModal";
import { useReviews } from "../context/ReviewsContext";
import { Helmet } from "react-helmet";

// Function to get the status from the orderStatus object
const getStatus = (status) => {
  if (status.isPending) return "لە چاوەڕوانیدا";
  if (status.isConfirmed) return "پەسەندکرا";
  if (status.isOnDelivered) return "لە گەیاندنە";
  if (status.isDelivered) return "هاتە گەیاندن";
  if (status.isCompleted) return "جێ بەجێکرا";
  if (status.isCancelled) return "ڕەتکرایەوە";
};

const MyOrdersPage = () => {
  const { user, userExistsInLocalStorage, loading } = useAuth();
  const { orders, cancelOrder } = useOrders();
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { reviews } = useReviews();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userExistsInLocalStorage && loading) {
      navigate("/");
    }
  }, [userExistsInLocalStorage, loading, navigate]);

  const handleAddReview = (selectedOrder) => {
    setSelectedOrder(selectedOrder);
    setShowAddReviewModal(true);
  };

  const columns = [
    {
      name: "دۆخی گەیاندن",
      cell: (row) => {
        const hasReviewed = reviews.some(
          (review) =>
            review.productId === row.productId &&
            review.user.email === user?.email
        );

        return (
          <div className="flex flex-col justify-center items-center gap-3 p-1">
            <strong className="text-base">{row.status}</strong>

            {!row.orderStatus.isCompleted && !row.orderStatus.isCancelled && (
              <button
                onClick={() => cancelOrder(row.order)}
                className="hover:bg-[#e42727] border border-[#e42727] text-[#e42727] transform transition-all ease-in-out duration-100 hover:text-white active:scale-95 px-1 py-2 rounded-md"
              >
                هەڵوەشاندنەوەی داواکاری
              </button>
            )}

            {!hasReviewed && row.orderStatus.isCompleted && (
              <button
                onClick={() => handleAddReview(row.product)}
                className="bg-[#FF6F00] text-black transform transition-all ease-in-out duration-100 hover:text-white active:scale-95 px-1 py-2 rounded-md"
              >
                بۆچوون زیادبکە
              </button>
            )}
          </div>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
    },
    {
      name: "نرخ",
      selector: (row) => row.totalPrice,
      format: (row) => FormatMoney(row.totalPrice),
      cell: (row) => (
        <strong className="text-base">{FormatMoney(row.totalPrice)} IQD</strong>
      ),
    },
    {
      name: "دانە",
      selector: (row) => row.quantity,
      cell: (row) => <strong className="text-base">{row.quantity}</strong>,
    },
    {
      name: "ڕێککەوت",
      selector: (row) => row.date,
      cell: (row) => <strong className="text-base">{row.date}</strong>,
    },
    {
      name: "ناوی بەرهەم",
      selector: (row) => row.product,
      cell: (row) => (
        <Link
          to={`/product/${row.productId}`}
          className="flex flex-col justify-center items-center gap-2"
        >
          <strong className="text-base hover:underline hover:underline-offset-4">
            {row.product.product.productName}
          </strong>

          <div className="flex justify-center items-center gap-2">
            {row.product.selectedProductAttributes.map(
              (selectedProductAttribute, index) => (
                <p key={index} className="text-[#969393] text-sm">
                  {selectedProductAttribute.label}
                </p>
              )
            )}
          </div>
        </Link>
      ),
    },
  ];

  const data = orders
    .filter(
      (order) =>
        order.orderType === "Product" && order.user.email === user?.email
    )
    .flatMap((order) => ({
      order: order,
      id: order.id,
      product: order.product,
      productId: order.product.product.id,
      productName: order.product.product.productName,
      quantity: order.product.quantity,
      totalPrice: order.product.totalPrice,
      date: FormatDate(order.orderedAt),
      status: getStatus(order.orderStatus),
      orderStatus: order.orderStatus,
      orderedAt: order.orderedAt,
    }));

  // Custom styles for the DataTable
  const customStyles = {
    headCells: {
      style: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "16px",
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
    <>
      {user ? (
        <main className="pt-[30px]">
          <Helmet>
            <title>گەیاندنی خێرا | داواکاریەکانم</title>
          </Helmet>

          <div className="flex flex-col justify-end items-end w-[95%] p-2 rounded-md mainShadow mx-auto">
            <div className="flex flex-row-reverse justify-between items-center w-full px-2 pb-1.5 border-b border-b-[#e4e4e5]">
              <h2 className="text-xl font-semibold">داواکاریەکانم</h2>
            </div>
            <div className="w-full">
              {orders.filter(
                (order) =>
                  order.orderType === "Product" &&
                  order.user.email === user.email
              ).length === 0 ? (
                <strong className="text-2xl p-2 flex justify-center items-center">
                  هیچ داواکاریەکت نەکردووە
                </strong>
              ) : (
                <div className="w-full">
                  <div className="orders">
                    <DataTable
                      columns={columns}
                      data={data}
                      customStyles={customStyles}
                    />
                  </div>

                  <div className="product-orders flex flex-col justify-center items-center gap-2 w-full">
                    {orders
                      .filter(
                        (order) =>
                          order.orderType == "Product" &&
                          order.user.email == user?.email
                      )
                      .map((order, index) => (
                        <div
                          key={index}
                          className="flex flex-row-reverse justify-between items-center w-full p-2 border-b border-b-[#e4e4e5] last:border-none"
                        >
                          <Link
                            to={`/product/${order.product.product.id}`}
                            className="flex flex-row-reverse gap-2"
                          >
                            <img
                              src={
                                order.product.product.productThumbnailImageURL
                              }
                              className="w-14 h-14 object-cover rounded-md"
                              alt=""
                            />

                            <div className="flex flex-col justify-end items-end gap-1">
                              <strong className="text-base">
                                {order.product.product.productName}
                              </strong>

                              <div className="flex justify-center items-center gap-2">
                                {order.product.selectedProductAttributes.map(
                                  (selectedProductAttribute, index) => (
                                    <p
                                      key={index}
                                      className="text-[#969393] text-sm"
                                    >
                                      {selectedProductAttribute.label}
                                    </p>
                                  )
                                )}
                              </div>

                              <div className="product-order-summary flex flex-row-reverse justify-center items-center gap-10">
                                <strong className="text-[#FF6F00]">
                                  {FormatMoney(order.product.totalPrice)} IQD
                                </strong>

                                <p>بڕ : {order.product.quantity}</p>
                              </div>
                            </div>
                          </Link>

                          <div className="flex flex-col justify-center items-center gap-3 p-1">
                            <strong className="text-base">
                              {getStatus(order.orderStatus)}
                            </strong>

                            {!order.orderStatus.isCompleted &&
                              !order.orderStatus.isCancelled && (
                                <button
                                  onClick={() => cancelOrder(order)}
                                  className="hover:bg-[#e42727] border border-[#e42727] text-[#e42727] transform transition-all ease-in-out duration-100 hover:text-white active:scale-95 px-1 py-2 rounded-md"
                                >
                                  هەڵوەشاندنەوەی داواکاری
                                </button>
                              )}

                            {!reviews.some(
                              (review) =>
                                review.productId === order.product.product.id &&
                                review.user.email === user?.email
                            ) &&
                              order.orderStatus.isCompleted && (
                                <button
                                  onClick={() => handleAddReview(order.product)}
                                  className="bg-[#FF6F00] text-black transform transition-all ease-in-out duration-100 hover:text-white active:scale-95 px-1 py-2 rounded-md"
                                >
                                  بۆچوون زیادبکە
                                </button>
                              )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {showAddReviewModal && (
            <AddReviewModal
              showAddReviewModal={showAddReviewModal}
              setShowAddReviewModal={setShowAddReviewModal}
              selectedOrder={selectedOrder}
            />
          )}
        </main>
      ) : (
        <div
          className="absolute top-0 left-0 w-full h-full flex flex-col gap-2 justify-center items-center bg-black/50 backdrop-blur-sm"
          style={{ zIndex: 999 }}
        >
          <div className="loader"></div>
          <p>...چاوەڕێ بە</p>
        </div>
      )}
    </>
  );
};

export default MyOrdersPage;
