import React, { useRef } from "react";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";

const CategoryProducts = ({ categoryName, categorySlug, products }) => {
  const swiperRef = useRef(null);

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

  // console.log(`Rendering products for category: ${categoryName}`, products);

  return (
    <div className="relative flex flex-col justify-center items-end gap-5 bg-white mainShadow w-[95%] mx-auto rounded-md p-2">
      <h2 className="text-2xl font-semibold text-right">{categoryName}</h2>

      <div className="relative hidden lg:flex flex-row-reverse justify-center items-center w-full gap-5 xl:gap-2.5">
        {products.slice(0, 6).map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>

      <div className="lg:hidden relative flex flex-row-reverse justify-center items-center w-full mx-auto">
        <Swiper
          ref={swiperRef}
          loop
          slidesPerView={5}
          spaceBetween={15}
          width={1300}
        >
          {products.slice(0, 6).map((product, index) => (
            <SwiperSlide key={index}>
              <ProductCard product={product} productOrder={null} />
            </SwiperSlide>
          ))}
        </Swiper>

        <div
          className="absolute top-[50%] left-0 p-2 flex flex-row-reverse justify-between items-center w-full"
          style={{ zIndex: 3 }}
        >
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

      <Link
        to={`/category/${categorySlug}`}
        className="mx-auto text-[#FF6F00] border border-[#FF6F00] rounded-md p-2 hover:bg-[#FF6F00] hover:text-white transform transition-all ease-in-out duration-100"
      >
        بینینی زیاتر
      </Link>
    </div>
  );
};

export default CategoryProducts;
