import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { IoIosArrowBack } from "react-icons/io";
import { useOrders } from "../../context/OrdersContext";
import { FormatDate } from "../../utils/FormatDate";
import { FormatMoney } from "../../utils/FormatMoney";
import OrderActions from "../../components/admin/OrderActions";
import { FiMoreVertical } from "react-icons/fi";
import EditCustomerModal from "../../components/admin/modals/EditCustomerModal";

const getStatus = (status) => {
  if (status.isPending) return "Pending";
  if (status.isConfirmed) return "Confirmed";
  if (status.isOnDelivered) return "On delivery";
  if (status.isDelivered) return "Delivered";
  if (status.isCompleted) return "Completed";
  if (status.isCancelled) return "Cancelled";
};

const CustomerPage = () => {
  const { user, users, deleteUser } = useAuth();
  const { customerEmail } = useParams();
  const [customer, setCustomer] = useState(null);
  const { orders } = useOrders();
  const [showOrderActions, setShowOrderActions] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showEditCustomerModal, setShowEditCustomerModal] = useState(false);

  const getCustomer = () => {
    const foundCustomer = users.find(
      (customer) => customer.email == customerEmail
    );
    setCustomer(foundCustomer);
  };

  useEffect(() => {
    getCustomer();
  }, [users, customerEmail]);

  const handleSelectedOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderActions(true);
  };

  const customerOrders = orders.filter(
    (order) => order.user.email == customer?.email
  );

  return (
    <>
      {user ? (
        <>
          {user.isAdmin ? (
            <>
              {customer ? (
                <div className="font-sans flex flex-col justify-center items-center gap-10">
                  <header
                    className="sticky top-0 left-0 bg-white w-full h-12 mainShadow flex justify-between items-center px-2"
                    style={{ zIndex: 999 }}
                  >
                    <button
                      title="Back"
                      onClick={() => history.back()}
                      className="hover:bg-[#969393]/15 rounded-full p-1 transform transition-all ease-in-out duration-100 active:scale-95"
                    >
                      <IoIosArrowBack size={25} />
                    </button>

                    <h3 className="text-lg font-semibold">Customer info</h3>

                    <div className="flex justify-center items-center gap-3">
                      <button
                        onClick={() =>
                          setShowEditCustomerModal(!showEditCustomerModal)
                        }
                        className="bg-blue-700 text-white transform transition-all ease-in-out duration-100 hover:bg-blue-800 rounded-md p-2 active:scale-95"
                      >
                        Edit customer
                      </button>

                      {showEditCustomerModal && (
                        <EditCustomerModal
                          showEditCustomerModal={showEditCustomerModal}
                          setShowEditCustomerModal={setShowEditCustomerModal}
                          customer={customer}
                        />
                      )}

                      <button
                        onClick={() => {
                          deleteUser(customer.email);
                          return (window.location.href = "/admin/customers");
                        }}
                        className="bg-red-700 text-white transform transition-all ease-in-out duration-100 hover:bg-red-800 rounded-md p-2 active:scale-95"
                      >
                        Delete customer
                      </button>
                    </div>
                  </header>

                  <div className="flex flex-col justify-center items-center gap-4 w-full py-3 border-b border-b-[#e4e4e5]">
                    <img
                      src={customer.userImageURL}
                      className="w-14 h-14 rounded-full object-cover"
                      alt=""
                    />
                    <strong>{customer.fullName}</strong>
                    <p>{customer.email}</p>
                    <p>{customer.phoneNumber}</p>
                    <p>Customer role: {customer.isAdmin ? "Admin" : "User"}</p>
                    <div className="flex flex-wrap justify-center items-center gap-3">
                      <div className="flex justify-center items-center p-2 border border-[#e4e4e5] rounded-md">
                        <p>
                          Customer balance: {FormatMoney(customer.userMoney)}{" "}
                          IQD
                        </p>
                      </div>

                      <div className="flex justify-center items-center p-2 border border-[#e4e4e5] rounded-md">
                        <p>
                          Customer balance spent:{" "}
                          {FormatMoney(customer.userMoneySpent)} IQD
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center items-center gap-4">
                    <h2 className="text-xl font-bold">
                      Customer orders (
                      {
                        orders.filter(
                          (order) => order.user.email == customer.email
                        ).length
                      }
                      )
                    </h2>

                    <div className="flex flex-wrap justify-center items-center gap-3 p-2">
                      {orders.filter(
                        (order) => order.user.email == customer.email
                      ).length == 0 ? (
                        <strong>No orders yet!</strong>
                      ) : (
                        <>
                          {orders
                            .filter(
                              (order) => order.user.email == customer.email
                            )
                            .map((order, index) => (
                              <React.Fragment key={index}>
                                {order.orderType === "Balance" ? (
                                  <Link
                                    to={`/admin/order/${order.id}`}
                                    className="flex flex-col justify-start items-start gap-4 w-[300px] rounded-md border border-[#e4e4e5] text-right p-2 transform transition-all ease-in-out duration-200 hover:shadow-lg hover:-translate-y-2 active:scale-95"
                                  >
                                    <strong className="text-lg">
                                      Order type : {order.orderType}
                                    </strong>

                                    <strong className="text-lg">
                                      Balance type :{" "}
                                      {order.paymentMethod.paymentName}
                                    </strong>

                                    <strong className="text-lg">
                                      Date : {FormatDate(order.orderedAt)}
                                    </strong>

                                    <strong className="text-lg">
                                      Phone number : {order.phoneNumber}
                                    </strong>

                                    <strong className="text-lg">
                                      Value : {FormatMoney(order.balanceValue)}{" "}
                                      IQD
                                    </strong>

                                    <strong className="text-lg">
                                      Status :{" "}
                                      {order.isActive ? "Active" : "Pending"}
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
                                  </Link>
                                ) : (
                                  <div className="relative flex flex-col justify-start items-start gap-4 w-[300px] rounded-md border border-[#e4e4e5] text-right p-2">
                                    <button
                                      title="Order actions"
                                      onClick={() => handleSelectedOrder(order)}
                                      className="absolute top-1 right-1 transform transition-all ease-in-out duration-100 p-1 hover:bg-[#969393]/15 rounded-full active:scale-95"
                                    >
                                      <FiMoreVertical size={25} />
                                    </button>

                                    {showOrderActions &&
                                      selectedOrder === order && (
                                        <OrderActions
                                          setShowOrderActions={
                                            setShowOrderActions
                                          }
                                          order={selectedOrder}
                                        />
                                      )}

                                    <strong className="text-lg">
                                      Order type : {order.orderType}
                                    </strong>

                                    <strong className="text-lg">
                                      Prodcut name :{" "}
                                      {order.product.product.productName}
                                    </strong>

                                    <strong className="text-lg">
                                      Date : {FormatDate(order.orderedAt)}
                                    </strong>

                                    <strong className="text-lg">
                                      Quantity : {order.product.quantity}
                                    </strong>

                                    <strong className="text-lg">
                                      Price :{" "}
                                      {FormatMoney(order.product.totalPrice)}{" "}
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
                                )}
                              </React.Fragment>
                            ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <>Customer not found</>
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

export default CustomerPage;
