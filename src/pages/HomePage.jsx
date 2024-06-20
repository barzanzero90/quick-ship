import React from "react";
import { useAuth } from "../context/AuthContext";
import Hero from "../components/Hero";
import NewestProducts from "../components/NewestProducts";
import CategoryProducts from "../components/CategoryProducts";
import { useProducts } from "../context/ProductsContext";
import { useCategories } from "../context/CategoriesContext";
import { Helmet } from "react-helmet";

const HomePage = () => {
  const { products, loading } = useProducts();
  const { categories } = useCategories();

  const getCategoryProducts = (categoryName) => {
    const filteredProducts = products.filter(
      (product) => product.productCategory.categoryName === categoryName
    );
    // console.log(`Filtered products for ${categoryName}:`, filteredProducts);
    return filteredProducts;
  };

  return (
    <div className="flex flex-col gap-12 w-full pb-3">
      <Helmet>
        <title>گەیاندنی خێرا</title>
      </Helmet>

      {loading ? (
        <div
          className="absolute top-0 left-0 w-full h-screen flex flex-col gap-2 justify-center items-center bg-black/50 backdrop-blur-sm"
          style={{ zIndex: 999 }}
        >
          <div className="loader"></div>
          <p>...چاوەڕێ بە</p>
        </div>
      ) : (
        <>
          <div className="w-full">
            {products.slice(0, 1).map((product, index) => (
              <Hero key={index} product={product} />
            ))}
          </div>

          <div className="w-full">
            <NewestProducts />
          </div>

          {categories.map((category) => {
            let categoryProducts = getCategoryProducts(category.categoryName);
            if (
              ["منداڵان", "ئافرەتان", "پیاوان"].includes(category.categoryName)
            ) {
              return (
                <CategoryProducts
                  key={category.id}
                  categoryName={category.categoryName}
                  categorySlug={category.categorySlug}
                  products={categoryProducts}
                />
              );
            }
            return null;
          })}
        </>
      )}
    </div>
  );
};

export default HomePage;
