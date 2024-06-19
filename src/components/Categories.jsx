import React, { useEffect, useState } from "react";
import { useCategories } from "../context/CategoriesContext";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { Link } from "react-router-dom";

const Categories = ({ setShowCategories, openNav, setOpenNav }) => {
  const { categories } = useCategories();

  return (
    <div
      className="md:absolute md:top-10 md:left-0 md:h-14 w-full bg-[#F5E5D7]/95 flex flex-col justify-end items-end gap-3 p-2"
      style={{ zIndex: 999 }}
    >
      <>
        {categories.map((category, index) => (
          <div
            key={index}
            className="flex flex-row-reverse justify-start items-center w-full"
          >
            <Link
              to={`/category/${category.categorySlug}`}
              onClick={() => {
                setShowCategories(false);
                setOpenNav(!openNav);
              }}
            >
              {category.categoryName}
            </Link>
          </div>
        ))}
      </>
    </div>
  );
};

export default Categories;
