import React from "react";
import { useCategories } from "../context/CategoriesContext";
import { Link } from "react-router-dom";

const Categories = ({ setShowCategories, openNav, setOpenNav }) => {
  const { categories, loading } = useCategories();

  return (
    <div
      className="md:absolute md:top-[30px] md:left-0 md:h-[100px] w-full bg-[#F5E5D7]/95 flex flex-col justify-end items-end gap-3 p-2"
      style={{ zIndex: 999 }}
    >
      {loading ? (
        <div
          className="flex flex-col gap-2 justify-center items-center"
          style={{ zIndex: 999 }}
        >
          <div className="loader"></div>
          <p>...چاوەڕێ بە</p>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default Categories;
