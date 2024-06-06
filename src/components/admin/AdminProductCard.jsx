import React, { Suspense } from "react";
import { Link } from "react-router-dom";
import { FormatMoney } from "../../utils/FormatMoney";

const AdminProductCard = ({ product }) => {
  return (
    <Link
      to={`/admin/product/${product.id}`}
      className="w-[250px] rounded-md bg-white flex flex-col justify-start items-center gap-4 mainShadow hover:-translate-y-1 active:scale-95 transform transition-all duration-200 ease-in-out"
    >
      <Suspense fallback={<>Loading...</>}>
        <img
          src={product.productThumbnailImageURL}
          className="w-full h-[200px] rounded-tr-md rounded-tl-md object-cover"
          alt=""
        />
      </Suspense>

      <div className="flex justify-between items-center w-full p-2">
        <h2 className="text-xl font-semibold w-[125px] text-ellipsis">
          {product.productName}
        </h2>

        <span className="flex justify-end items-end gap-1">
          <strong className="text-2xl">
            {FormatMoney(product.productPrice)}
          </strong>
          <p className="text-sm">IQD</p>
        </span>
      </div>
    </Link>
  );
};

export default AdminProductCard;
