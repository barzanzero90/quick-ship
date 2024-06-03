import React, { useState, useEffect, Suspense } from "react";
import { useAuth } from "../../context/AuthContext";
import { hideScrollBar } from "../../hooks/hideScrollBar";
import { useProducts } from "../../context/ProductsContext";
import { FormatMoney } from "../../utils/FormatMoney";
import { CgClose, CgMathMinus } from "react-icons/cg";
import { IoIosAdd } from "react-icons/io";

const AddToCartModal = ({
  showAddToCartModal,
  setShowAddToCartModal,
  product,
}) => {
  hideScrollBar(showAddToCartModal);
  const { user } = useAuth();
  const { addToCart } = useProducts();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  // Initialize selectedProductAttributes safely
  const [selectedProductAttributes, setSelectedProductAttributes] = useState(
    () => {
      return product && product.productAttributes
        ? product.productAttributes.map((attr) =>
            attr.subAttributes.length > 0 ? attr.subAttributes[0].label : ""
          )
        : [];
    }
  );

  useEffect(() => {
    if (product) {
      const price =
        product.discountType === "Flat"
          ? quantity * product.productPrice - product.productDiscount
          : quantity *
            product.productPrice *
            (1 - product.productDiscount / 100);
      setTotalPrice(price);
    }
  }, [product, quantity]);

  const handleImageSelect = (index) => {
    setSelectedImageIndex(index);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = async () => {
    try {
      const cartData = {
        product,
        quantity,
        selectedProductAttributes: selectedProductAttributes.map((selectedProductAttribute) => ({
          label: selectedProductAttribute,
        })),
        totalPrice,
        addedAt: new Date(),
      };
      await addToCart(user, cartData);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleAttributeChange = (attributeIndex, subAttributeLabel) => {
    const updatedAttributes = [...selectedProductAttributes];
    updatedAttributes[attributeIndex] = subAttributeLabel;
    setSelectedProductAttributes(updatedAttributes);
  };

  return (
    <div
      className="fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-full h-screen bg-black/50 backdrop-blur-sm"
      onClick={() => setShowAddToCartModal(!showAddToCartModal)}
      style={{ zIndex: 999 }}
    >
      <div
        className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[90%] h-[400px] overflow-y-auto bg-white rounded-md flex flex-wrap justify-between items-center gap-2 p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-start items-start gap-2">
          <button
            title="داخستن"
            onClick={() => setShowAddToCartModal(!showAddToCartModal)}
            className="hover:bg-[#969393]/15 p-1 rounded-full active:scale-95 transform transition-all ease-in-out duration-100"
          >
            <CgClose size={25} />
          </button>

          <Suspense fallback={<>Loading...</>}>
            <div className="flex justify-start items-start gap-2">
              <div className="flex flex-col justify-start items-center gap-2">
                {product.productImageURLS.map((productImageURL, index) => (
                  <img
                    key={index}
                    src={productImageURL}
                    className={`h-[50px] rounded-md cursor-pointer ${
                      selectedImageIndex === index
                        ? "border-2 border-[#FF6F00]"
                        : ""
                    }`}
                    alt=""
                    onClick={() => handleImageSelect(index)}
                  />
                ))}
              </div>

              <div>
                <img
                  src={product.productImageURLS[selectedImageIndex]}
                  className="w-full h-[270px] rounded-md"
                  alt=""
                />
              </div>
            </div>
          </Suspense>
        </div>

        <div className="flex flex-col justify-end items-end gap-2.5">
          <h3 className="text-lg font-semibold">{product.productName}</h3>

          <p className="flex justify-center items-center gap-2">
            {product.productColors.map((color, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: `#${color.colorCode}`,
                  padding: "5px",
                  borderRadius: "8px",
                  width: "40px",
                  height: "40px",
                }}
                title={`${color.colorName} ڕەنگی`}
              ></span>
            ))}
            :رەنگ
          </p>

          <div className="flex flex-col justify-end items-end gap-4">
            {product.productAttributes.map((productAttribute, index) => (
              <div key={index} className="flex flex-row-reverse justify-center items-center gap-2">
                <span>: {productAttribute.attributeName}</span>
                <div className="flex justify-center items-center gap-2">
                  {productAttribute.subAttributes.map(
                    (subAttribute, subIndex) => (
                      <button
                        key={subIndex}
                        onClick={() =>
                          handleAttributeChange(index, subAttribute.label)
                        }
                        className={`p-1 border rounded-md ${
                          selectedProductAttributes[index] ===
                          subAttribute.label
                            ? "bg-[#FF6F00] text-white"
                            : "bg-white text-black"
                        }`}
                      >
                        {subAttribute.label}
                      </button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center gap-1">
            {product.productDiscount ? (
              <>
                {product.discountType == "Flat" ? (
                  <div className="flex flex-col justify-center items-center gap-2">
                    <div className="flex justify-center items-center gap-2">
                      <p className="text-2xl text-[#FF6F00]">
                        {FormatMoney(
                          product.productPrice - product.productDiscount
                        )}
                      </p>
                      <p className="text-[#969393] text-sm line-through">
                        {FormatMoney(product.productDiscount)}IQD
                      </p>
                      : نرخ
                    </div>
                    <p className="text-xl">
                      {FormatMoney(
                        quantity * product.productPrice -
                          product.productDiscount
                      )}{" "}
                      IQD : کۆی گشتی
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center gap-2">
                    <div className="flex justify-center items-center gap-2">
                      <p className="text-2xl text-[#FF6F00]">
                        {FormatMoney(
                          product.productPrice *
                            (1 - product.productDiscount / 100)
                        )}{" "}
                        IQD
                      </p>
                      <p className="text-[#969393] text-sm line-through">
                        {FormatMoney(product.productPrice)} IQD
                      </p>
                      : نرخ
                    </div>
                    <p className="text-xl">
                      {FormatMoney(
                        quantity *
                          product.productPrice *
                          (1 - product.productDiscount / 100)
                      )}{" "}
                      IQD : کۆی گشتی
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col justify-center items-center gap-2">
                <p className="text-xl">{FormatMoney(product.productPrice)}</p>
                <p>
                  کۆی گستی نرخ : {FormatMoney(quantity * product.productPrice)}{" "}
                  IQD
                </p>
              </div>
            )}{" "}
          </div>

          <div className="flex justify-center items-center gap-2">
            {quantity == 1 ? (
              <button
                disabled
                className="bg-[#FF6F00]/50 text-white rounded-full p-1 hover:bg-[#FF6F00]/45 active:scale-95 transform transition-all duration-100 ease-in-out"
              >
                <CgMathMinus size={25} />
              </button>
            ) : (
              <button
                onClick={decreaseQuantity}
                className="bg-[#FF6F00] text-white rounded-full p-1 hover:bg-[#FF6F00]/90 active:scale-95 transform transition-all duration-100 ease-in-out"
              >
                <CgMathMinus size={25} />
              </button>
            )}

            <p>{quantity}</p>

            <button
              onClick={increaseQuantity}
              className="bg-[#FF6F00] text-white rounded-full p-1 hover:bg-[#FF6F00]/90 active:scale-95 transform transition-all duration-100 ease-in-out"
            >
              <IoIosAdd size={25} />
            </button>
            <p>: بڕ</p>
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-[#FF6F00] text-white p-2 rounded-md hover:bg-[#FF6F00]/90 active:scale-95 transform transition-all duration-100 ease-in-out"
          >
            زیادبکە بۆ سەبەتەی کڕین
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;
