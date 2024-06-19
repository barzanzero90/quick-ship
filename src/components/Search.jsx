import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FormatMoney } from "../utils/FormatMoney";

const Search = ({
  setShowSearch,
  filteredProducts,
  openNav,
  setOpenNav,
  isPending,
}) => {
  const searchRef = useRef();

  useEffect(() => {
    let handler = (e) => {
      if (!searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return (
    <div
      className="absolute top-12 left-0 w-full h-auto overflow-y-auto bg-white/95 backdrop-blur-sm rounded-bl-md rounded-br-md flex flex-col gap-1"
      style={{ zIndex: 999 }}
      ref={searchRef}
    >
      {isPending ? (
        <div
          className="w-full flex flex-col gap-2 justify-center items-center bg-black/50 backdrop-blur-sm py-3"
          style={{ zIndex: 999 }}
        >
          <div className="loader"></div>
          <p>...چاوەڕێ بە</p>
        </div>
      ) : (
        <>
          {filteredProducts.map((filteredProduct, index) => (
            <Link
              key={index}
              to={`/product/${filteredProduct.id}`}
              onClick={() => {
                console.log(setOpenNav(!openNav));
                setShowSearch(false);
              }}
              className="flex flex-row-reverse justify-between items-center gap-2 p-2 w-full border-b border-b-[#e4e4e5] last:border-none"
            >
              <div className="flex flex-row-reverse justify-center items-center gap-2">
                <img
                  src={filteredProduct.productThumbnailImageURL}
                  loading="lazy"
                  className="w-12 h-12 object-cover rounded-md transform transition-all ease-in-out duration-200 active:scale-95"
                  alt=""
                />

                <strong className="text-lg text-right transform transition-all ease-in-out duration-200 hover:opacity-80 active:opacity-55">
                  {filteredProduct.productName}
                </strong>
              </div>

              <strong className="transform transition-all ease-in-out duration-200 hover:opacity-80 active:opacity-55">
                {filteredProduct.productDiscount ? (
                  <>
                    {filteredProduct.discountType == "Flat" ? (
                      <div className="flex flex-col-reverse justify-center items-center gap-2">
                        <p className="text-base">
                          {FormatMoney(
                            filteredProduct.productPrice -
                              filteredProduct.productDiscount
                          )}{" "}
                          IQD
                        </p>

                        <p className="text-[#969393] text-sm line-through">
                          {FormatMoney(filteredProduct.productDiscount)} IQD
                        </p>

                        <p className="text-base">
                          {FormatMoney(
                            filteredProduct.productPrice -
                              filteredProduct.productDiscount
                          )}{" "}
                          IQD
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col-reverse justify-center items-center gap-0.5">
                        <strong className="text-base">
                          {FormatMoney(
                            filteredProduct.productPrice *
                              (1 - filteredProduct.productDiscount / 100)
                          )}{" "}
                          IQD
                        </strong>
                        <p className="text-[#969393] text-sm line-through">
                          {FormatMoney(filteredProduct.productPrice)} IQD
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="flex justify-center items-center text-lg">
                    {FormatMoney(filteredProduct.productPrice)} IQD
                  </p>
                )}
              </strong>
            </Link>
          ))}
        </>
      )}
    </div>
  );
};

export default Search;
