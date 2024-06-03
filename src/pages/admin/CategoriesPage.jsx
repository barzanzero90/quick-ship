import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import SideBar from "../../components/admin/SideBar";
import { Link } from "react-router-dom";
import { IoIosAdd } from "react-icons/io";
import AddCategoryModal from "../../components/admin/modals/AddCategoryModal";
import { useCategories } from "../../context/CategoriesContext";

const CategoriesPage = () => {
  const { user } = useAuth();
  const { categories } = useCategories();
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

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
                      Categories ({categories.length})
                    </h2>

                    <button
                      onClick={() =>
                        setShowAddCategoryModal(!showAddCategoryModal)
                      }
                      className="flex justify-center items-center gap-0.5 p-2 hover:bg-[#969393]/25 rounded-md transform transition-all ease-in-out duration-100 active:scale-95"
                    >
                      <IoIosAdd size={25} />
                      Add category
                    </button>
                  </header>

                  {showAddCategoryModal && (
                    <AddCategoryModal
                      showAddCategoryModal={showAddCategoryModal}
                      setShowAddCategoryModal={setShowAddCategoryModal}
                    />
                  )}

                  <div className="flex flex-wrap justify-center items-center gap-3">
                    {categories.map((category, index) => (
                      <Link
                        key={index}
                        to={`/admin/category/${category.categorySlug}`}
                        className="w-[150px] p-1.5 border border-[#e4e4e5] rounded-md text-center transform transition-all ease-in-out duration-200 hover:-translate-y-1 active:scale-95"
                      >
                        {category.categoryName}
                      </Link>
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

export default CategoriesPage;
