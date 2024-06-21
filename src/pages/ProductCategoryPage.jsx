import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCategories } from "../context/CategoriesContext";
import { useProducts } from "../context/ProductsContext";
import ProductCard from "../components/ProductCard";
import { Helmet } from "react-helmet";
import AddToCartModal from "../components/modals/AddToCartModal";

const ProductCategoryPage = () => {
  const { categorySlug } = useParams();
  const { categories, getSubCategories, subCategories } = useCategories();
  const { products } = useProducts();
  const [category, setCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);

  const getProductsByCategory = () => {
    const foundCategory = categories.find(
      (category) =>
        category.categorySlug === categorySlug && getSubCategories(category.id)
    );
    setCategory(foundCategory);
  };

  useEffect(() => {
    getProductsByCategory();
  }, [categories, categorySlug, getSubCategories, subCategories]);

   // Reset the selectedSubCategory when categorySlug changes
  useEffect(() => {
    setSelectedSubCategory(null);
  }, [categorySlug]);

  const filteredProducts = selectedSubCategory
    ? products.filter(
        (product) =>
          product.productSubCategory.subCategoryName ===
            selectedSubCategory.subCategoryName &&
          product.productCategory.categoryName === category?.categoryName
      )
    : products.filter(
        (product) =>
          product.productCategory.categoryName === category?.categoryName
      );

  const handleSelectedSubCategory = (subCategory) => {
    setSelectedSubCategory(subCategory);
  };

  const handleShowAllProducts = () => {
    setSelectedSubCategory(null);
  };

  const handleAddToCart = (selectedProduct) => {
    setSelectedProduct(selectedProduct);
    setShowAddToCartModal(true);
  };

  return (
    <>
      {category ? (
        <div className="grid grid-cols-3 gap-5 p-3 w-full">
          <Helmet>
            <title>گەیاندنی خێرا | بەرهەمەکانی {category.categoryName}</title>
          </Helmet>

          <div className="col-span-2">
            <div className="flex flex-row-reverse flex-wrap justify-center items-center gap-4">
              {filteredProducts.map((product, index) => (
                <div key={index}>
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                </div>
              ))}

              {showAddToCartModal && (
                <AddToCartModal
                  showAddToCartModal={showAddToCartModal}
                  setShowAddToCartModal={setShowAddToCartModal}
                  product={selectedProduct}
                />
              )}
            </div>
          </div>

          <div className="sticky right-0 flex flex-col justify-start items-start gap-5 w-full">
            <div className="flex flex-col justify-end items-end p-2 gap-3 mainShadow rounded-md w-full">
              <strong className="text-lg">{category.categoryName}</strong>
              <div className="flex flex-col justify-end items-end gap-2">
                <button
                  onClick={handleShowAllProducts}
                  className={`text-lg cursor-pointer hover:text-[#FF6F00] transform transition-all ease-in-out duration-100 active:scale-95 ${
                    selectedSubCategory == null ? "text-[#FF6F00]" : ""
                  }`}
                >
                  هەموو
                </button>
              </div>
              {subCategories.map((subCategory, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-end items-end gap-2"
                >
                  <button
                    onClick={() => handleSelectedSubCategory(subCategory)}
                    className={`text-lg cursor-pointer hover:text-[#FF6F00] transform transition-all ease-in-out duration-100 active:scale-95 ${
                      selectedSubCategory?.subCategoryName ===
                      subCategory.subCategoryName
                        ? "text-[#FF6F00]"
                        : ""
                    }`}
                  >
                    {subCategory.subCategoryName}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div
          className="absolute top-0 left-0 w-full h-screen flex flex-col gap-2 justify-center items-center bg-black/50 backdrop-blur-sm"
          style={{ zIndex: 999 }}
        >
          <div className="loader"></div>
          <p>...چاوەڕێ بە</p>
        </div>
      )}
    </>
  );
};

export default ProductCategoryPage;
