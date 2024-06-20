import React, { useRef, useState } from "react";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import ProductCard from "./ProductCard";
import { useProducts } from "../context/ProductsContext";
import AddToCartModal from "./modals/AddToCartModal";

const NewestProducts = () => {
  const swiperRef = useRef(null);
  const { products } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);

  const goNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const goPrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleAddToCart = (selectedProduct) => {
    setSelectedProduct(selectedProduct);
    setShowAddToCartModal(true);
  };

  return (
    <div className="newestProducts pt-[160px] w-[95%] mx-auto">
      <div className="flex flex-col justify-center items-center gap-5 bg-white mainShadow w-full mx-auto rounded-md p-2">
        <div className="flex flex-row-reverse justify-between items-center w-full px-2">
          <h2 className="text-2xl font-semibold text-right">
            نوێترین بەرهەمەکان
          </h2>

          <div className="flex flex-row-reverse justify-center items-center gap-5">
            <button
              className="bg-white rounded-full p-1 mainShadow active:scale-95 transform transition-all ease-in-out duration-100"
              onClick={goNext}
            >
              <MdOutlineKeyboardArrowRight size={35} />
            </button>

            <button
              className="bg-white rounded-full p-1 mainShadow active:scale-95 transform transition-all ease-in-out duration-100"
              onClick={goPrev}
            >
              <MdOutlineKeyboardArrowLeft size={35} />
            </button>
          </div>
        </div>

        <div className="flex justify-center items-center w-full px-3">
          <Swiper
            ref={swiperRef}
            loop
            slidesPerView={5}
            spaceBetween={50}
            width={1300}
          >
            {products.slice(0, 10).map((product, index) => (
              <SwiperSlide key={index}>
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {showAddToCartModal && (
          <AddToCartModal
            showAddToCartModal={showAddToCartModal}
            setShowAddToCartModal={setShowAddToCartModal}
            product={selectedProduct}
          />
        )}
      </div>
    </div>
  );
};

export default NewestProducts;
