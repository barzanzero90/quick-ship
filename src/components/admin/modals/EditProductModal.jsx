import React, { useState } from "react";
import { hideScrollBar } from "../../../hooks/hideScrollBar";
import { CgClose } from "react-icons/cg";

const EditProductModal = ({
  showEditProductModal,
  setShowEditProductModal,
  product,
}) => {
  hideScrollBar(showEditProductModal);
  const [productName, setProductName] = useState(product?.productName);
  const [productCategory, setProductCategory] = useState(product?.productCategory);

  return (
    <div
      onClick={() => setShowEditProductModal(!showEditProductModal)}
      className="fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 h-screen w-full bg-black/50 backdrop-blur-sm"
      style={{ zIndex: 999 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[95%] h-[95vh] rounded-md bg-white flex flex-col justify-start items-start gap-4 p-1"
      >
        <div className="flex justify-between items-center w-full">
          <button
            title="Close"
            onClick={() => setShowEditProductModal(!showEditProductModal)}
            className="hover:bg-[#969393]/25 rounded-full p-1 active:scale-95 transform transition-all ease-in-out duration-100"
          >
            <CgClose size={25} />
          </button>

          <h3 className="text-lg">
            Edit <strong>{product.productName}</strong> product
          </h3>
          <span></span>
        </div>

        <div className="flex flex-wrap justify-between items-center w-full">
          <div className="flex flex-col justify-start items-start gap-5 w-[600px]">
            <div className="flex flex-col justify-start items-start gap-3 mainShadow rounded-md p-2 w-full">
              <h3 className="text-lg font-semibold">Product Information</h3>

              <div className="flex flex-col justify-start items-start gap-2 w-full">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full p-2 border border-[#e4e4e5] rounded-md"
                />

                <select name="" id="" value={productCategory}>
                    <option value={productCategory.id} selected>{productCategory.categoryName}</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-start items-start gap-5 w-[600px] border border-red-500"></div>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
