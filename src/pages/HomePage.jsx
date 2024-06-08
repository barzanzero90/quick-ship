import React from "react";
import { useAuth } from "../context/AuthContext";
import Hero from "../components/Hero";
import NewestProducts from "../components/NewestProducts";
import CategoryProducts from "../components/CategoryProducts";
import { useProducts } from "../context/ProductsContext";
import { useCategories } from "../context/CategoriesContext";
import { Helmet } from "react-helmet";

const HomePage = () => {
  const { user, logOutUser } = useAuth();
  const { products } = useProducts();
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

      {products.slice(0, 1).map((product) => (
        <Hero key={product.id} product={product} />
      ))}

      <NewestProducts />

      {categories.map((category) => {
        let categoryProducts = getCategoryProducts(category.categoryName);
        if (["منداڵان", "ئافرەتان", "پیاوان"].includes(category.categoryName)) {
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
    </div>
  );
};

export default HomePage;
