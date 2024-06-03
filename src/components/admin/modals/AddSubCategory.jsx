import React, { useState } from "react";
import { hideScrollBar } from "../../../hooks/hideScrollBar";
import { IoCloseOutline } from "react-icons/io5";
import { useCategories } from "../../../context/CategoriesContext";
import { CATEGORIESACTIONS } from "../../../actions/categoriesActions";

const AddSubCategory = ({
  showAddSubCategoryModal,
  setShowAddSubCategoryModal,
  category,
}) => {
  const { addSubCategory, dispatch } = useCategories();
  const [subCategoryName, setSubCategoryName] = useState("");
  const [subCategorySlug, setSubCategorySlug] = useState("");
  hideScrollBar(showAddSubCategoryModal);

  const handleAddSubCategory = async (e) => {
    e.preventDefault();

    try {
      if (subCategoryName.trim() == "") {
        return alert("Please write sub category name");
      } else if (subCategorySlug.trim() == "") {
        return alert("Please write sub category slug");
      } else {
        const subCategoryData = {
          subCategoryName,
          subCategorySlug,
          createdAt: new Date(),
        };

        addSubCategory(category.id, subCategoryData);
        alert(`${subCategorySlug} sub category added successfully!`);
        setShowAddSubCategoryModal(false);
      }
    } catch (error) {
      dispatch({ type: CATEGORIESACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  return (
    <div
      onClick={() => setShowAddSubCategoryModal(!showAddSubCategoryModal)}
      className="fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 h-screen w-full bg-black/50 backdrop-blur-sm"
      style={{ zIndex: 999 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[210px] rounded-md bg-white flex flex-col items-center gap-4 p-1"
      >
        <div className="flex justify-between items-center w-full">
          <span></span>
          <h3 className="text-lg font-semibold">Add sub category</h3>
          <button
            title="Close"
            onClick={() => setShowAddSubCategoryModal(!showAddSubCategoryModal)}
            className="hover:bg-[#969393]/25 rounded-full p-1 transform transition-all ease-in-out duration-100 active:scale-95"
          >
            <IoCloseOutline size={25} />
          </button>
        </div>

        <form
          onSubmit={handleAddSubCategory}
          className="flex flex-col justify-center items-center gap-3"
        >
          <input
            type="text"
            placeholder="Sub Category Name"
            value={subCategoryName}
            onChange={(e) => setSubCategoryName(e.target.value)}
            className="w-[270px] p-2 border border-[#e4e4e5] rounded-md"
          />

          <input
            type="text"
            placeholder="Sub Category Slug"
            value={subCategorySlug}
            onChange={(e) => setSubCategorySlug(e.target.value)}
            className="w-[270px] p-2 border border-[#e4e4e5] rounded-md"
          />

          <button className="w-[270px] p-2 bg-blue-700 text-white hover:bg-blue-800 rounded-md transform transition-all ease-in-out duration-100 active:scale-95">
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSubCategory;
