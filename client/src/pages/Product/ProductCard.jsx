import { Link } from "react-router-dom";
import HeartIcon from "../../components/HeartIcon";
import { FaArrowRight } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../app/features/cart/cartSlice";
import { toast } from "react-toastify";

function ProductCard({ product }) {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added to Cart", {
      autoClose: 2000,
    });
  };

  return (
    <div className="max-w-sm relative rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 bg-[#1A1A1A] ">
      <section className="relative">
        <Link to={`/product/${product._id}`}>
          <span className="absolute bottom-3 right-3 bg-pink-100 text-pink-800 text-sm font-medium mr-2 px-2 5 py-0 5 rounded-full dark:bg-pink-900 dark:text-pink-300">
            {product.brand}
          </span>
          <img
            src={product.image}
            alt={product.name}
            className="cursor-pointer w-full"
            style={{ height: "170px", objectFit: "cover" }}
          />
        </Link>
        <HeartIcon product={product} />
      </section>

      <div className="p-5">
        <div className="flex justify-between">
          <h5 className="mb-2 text-xl text-white dark:text-white">
            {product.name}
          </h5>

          <p className="text-black font-semibold text-pink-500">
            {product?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>
        <p className="mb-3 font-normal text-[#CFCFCF]">
          {product?.description?.substring(0, 30)} ...
        </p>

        <section className="flex justify-between items-center ">
          <Link
            to={`/product/${product._id}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center gap-2 text-white bg-pink-700 rounded-lg hover:bg-pink-800 "
          >
            Read More <FaArrowRight />
          </Link>

          <button
            onClick={() => addToCartHandler(product, 1)}
            className="p-2 rounded-full"
          >
            <AiOutlineShoppingCart size={25} className="text-white" />
          </button>
        </section>
      </div>
    </div>
  );
}

export default ProductCard;
