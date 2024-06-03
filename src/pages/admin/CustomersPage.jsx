import React from "react";
import { useAuth } from "../../context/AuthContext";
import SideBar from "../../components/admin/SideBar";
import { Link } from "react-router-dom";

const CustomersPage = () => {
  const { user, users } = useAuth();

  return (
    <>
      {user ? (
        <>
          {user.isAdmin ? (
            <div className="grid grid-cols-4 gap-5 w-full h-screen">
              <SideBar />

              <div className="col-span-3 p-2 w-full">
                <div className="flex flex-col justify-center items-center gap-5 w-full p-3">
                  <header
                    style={{ zIndex: 999 }}
                    className="sticky top-0 right-0 bg-white flex justify-between items-center w-full border-b border-b-[#969393]/25 pb-2"
                  >
                    <h2 className="text-2xl font-bold">
                      Customers ({users.length})
                    </h2>
                  </header>

                  <div className="flex flex-wrap justify-center items-center gap-10">
                    {users.length > 0 ? (
                      <>
                        {users.map((customer, index) => (
                          <Link
                            key={index}
                            to={`/admin/customer/${customer.email}`}
                            className="flex justify-start items-center gap-2.5 border border-[#e4e4e5] rounded-md p-2 transform transition-all ease-in-out duration-500 hover:-translate-y-2 active:scale-95"
                          >
                            <img
                              src={customer.userImageURL}
                              className="w-10 h-10 rounded-full object-cover"
                              alt=""
                            />

                            <strong>{customer.fullName}</strong>
                          </Link>
                        ))}
                      </>
                    ) : (
                      <>No customers yet!</>
                    )}
                  </div>
                </div>
              </div>
            </div>
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

export default CustomersPage;
