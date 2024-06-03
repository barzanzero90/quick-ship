import React, { useRef } from "react";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import ProductCard from "./ProductCard";
import { useProducts } from "../context/ProductsContext";

const NewestProducts = () => {
  const swiperRef = useRef(null);
  const { products } = useProducts();

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

  return (
    <div className="newestProducts pt-[160px]">
      <div className="flex flex-col justify-center items-center gap-5 bg-white mainShadow w-[95%] mx-auto rounded-md p-2">
        <div className="flex flex-row-reverse justify-between items-center w-full px-2">
          <h2 className="text-2xl font-semibold text-right">نوێترین بەرهەمەکان</h2>

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

        <div className="relative flex flex-row-reverse justify-center items-center w-full">
          <Swiper
            ref={swiperRef}
            loop
            slidesPerView={5}
            spaceBetween={15}
            width={1300}
          >
            {products.slice(0, 10).map((product, index) => (
              <SwiperSlide key={index}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default NewestProducts;
