import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import SideBar from "../../components/admin/SideBar";
import { IoIosAdd } from "react-icons/io";
import AddBrandModal from "../../components/admin/modals/AddBrandModal";
import { useBrands } from "../../context/BrandsContext";
import { Link } from "react-router-dom";
import { RiDeleteBin4Line } from "react-icons/ri";

const BrandsPage = () => {
  const { user } = useAuth();
  const [showAddBrandModal, setShowAddBrandModal] = useState(false);
  const { brands, deleteBrand } = useBrands();

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
                      Brands ({brands.length})
                    </h2>

                    <button
                      onClick={() => setShowAddBrandModal(!showAddBrandModal)}
                      className="flex justify-center items-center gap-0.5 p-2 hover:bg-[#969393]/25 rounded-md transform transition-all ease-in-out duration-100 active:scale-95"
                    >
                      <IoIosAdd size={25} />
                      Add brand
                    </button>
                  </header>

                  {showAddBrandModal && (
                    <AddBrandModal
                      showAddBrandModal={showAddBrandModal}
                      setShowAddBrandModal={setShowAddBrandModal}
                    />
                  )}
                </div>

                <div className="flex flex-wrap justify-center items-center gap-3">
                  {brands.map((brand, index) => (
                    <div
                      key={index}
                      to={`/admin/brand/${brand.brandSlug}`}
                      title={`${brand.brandName} brand`}
                      className="relative flex justify-center items-center w-[100px] p-2 border border-[#e4e4e5] rounded-md"
                    >
                      <img
                        src={brand.brandImageURL}
                        className="w-10 h-10"
                        alt=""
                      />

                      <button
                        onClick={() => deleteBrand(brand)}
                        className="absolute top-0 left-0 p-1 rounded-full bg-red-700 text-white hover:bg-red-800 transform transition-all ease-in-out duration-100 active:scale-95"
                      >
                        <RiDeleteBin4Line size={25} />
                      </button>
                    </div>
                  ))}
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

export default BrandsPage;
