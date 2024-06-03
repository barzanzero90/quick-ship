import React from "react";
import { useAuth } from "../../context/AuthContext";
import SideBar from "../../components/admin/SideBar";
import { IoIosAdd } from "react-icons/io";
import { Link } from "react-router-dom";
import { useProducts } from "../../context/ProductsContext";
import AdminProductCard from "../../components/admin/AdminProductCard";

const ProductsPage = () => {
  const { user } = useAuth();
  const { products } = useProducts();

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
                      Products ({products.length})
                    </h2>

                    <Link
                      to="/admin/add-product"
                      className="flex justify-center items-center gap-0.5 p-2 hover:bg-[#969393]/25 rounded-md transform transition-all ease-in-out duration-100 active:scale-95"
                    >
                      <IoIosAdd size={25} />
                      Add product
                    </Link>
                  </header>

                  <div className="flex flex-wrap justify-center items-center gap-5">
                    {products.map((product, index) => (
                      <AdminProductCard key={index} product={product} />
                    ))}
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

export default ProductsPage;
