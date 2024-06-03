import React, { useState } from "react";
import { hideScrollBar } from "../../../hooks/hideScrollBar";
import { IoCloseOutline } from "react-icons/io5";
import { useCategories } from "../../../context/CategoriesContext";
import { CATEGORIESACTIONS } from "../../../actions/categoriesActions";

const AddCategoryModal = ({
  showAddCategoryModal,
  setShowAddCategoryModal,
}) => {
  const { addCategory, dispatch } = useCategories();
  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");

  hideScrollBar(showAddCategoryModal);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      if (categoryName.trim() == "") {
        return alert("Please add category name");
      } else if (categorySlug.trim() == "") {
        return alert("Please add category slug");
      } else {
        const categoryData = {
          categoryName,
          categorySlug,
          createdAt: new Date(),
        };

        await addCategory(categoryData);
        alert(`${categorySlug} category added successfully!`);
        setShowAddCategoryModal(false);
      }
    } catch (error) {
      dispatch({ type: CATEGORIESACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  return (
    <div
      onClick={() => setShowAddCategoryModal(!showAddCategoryModal)}
      className="fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 h-screen w-full bg-black/50 backdrop-blur-sm"
      style={{ zIndex: 999 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[210px] rounded-md bg-white flex flex-col items-center gap-4 p-1"
      >
        <div className="flex justify-between items-center w-full">
          <span></span>
          <h3 className="text-lg font-semibold">Add category</h3>
          <button
            title="Close"
            onClick={() => setShowAddCategoryModal(!showAddCategoryModal)}
            className="hover:bg-[#969393]/25 rounded-full p-1 transform transition-all ease-in-out duration-100 active:scale-95"
          >
            <IoCloseOutline size={25} />
          </button>
        </div>

        <form
          onSubmit={handleAddCategory}
          className="flex flex-col justify-center items-center gap-3"
        >
          <input
            type="text"
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-[270px] p-2 border border-[#e4e4e5] rounded-md"
          />

          <input
            type="text"
            placeholder="Category Slug"
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            className="w-[270px] p-2 border border-[#e4e4e5] rounded-md"
          />

          <button className="w-[270px] p-2 bg-blue-700 text-white hover:bg-blue-800 rounded-md transform transition-all ease-in-out duration-100 active:scale-95">
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
