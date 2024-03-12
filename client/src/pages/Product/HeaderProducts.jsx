import React from "react";
import { Link } from "react-router-dom";
import HeartIcon from "../../components/HeartIcon";

function Products({ product }) {
  return (
    <div className="w-[12rem] ml-[2rem] p-3">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="rounded h-auto"
        />
        <HeartIcon product={product} />

        <div className="p-54">
          <Link to={`/product/${product._id}`}>
            <h2 className="flex justify-between items-center">
              <div className="text-white">{product.name}</div>
              <span className="bg-pink-100 px-2 5 py-0 5 rounded-full text-sm font-medium mr-2 text-pink-800">
                ${product.price}
              </span>
            </h2>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Products;
