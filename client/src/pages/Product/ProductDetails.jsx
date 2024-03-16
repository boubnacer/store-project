import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  useCreateReviewMutation,
  useGetProductDetailsQuery,
} from "../../app/api/productApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import HeartIcon from "../../components/HeartIcon";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import Ratings from "../../components/Ratings";
import ProductReview from "./ProductReview";
import { toast } from "react-toastify";
import { addToCart } from "../../app/features/cart/cartSlice";

function ProductDetails() {
  const { userInfo } = useSelector((state) => state.auth);

  const { id: productId } = useParams();
  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useGetProductDetailsQuery(productId);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setcomment] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({ productId, rating, comment }).unwrap();
      toast.success("Review added successully");
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <>
      <div className="mt-[2rem]">
        <Link
          to="/"
          className="text-white font-semibold hover:underline  ml-[10rem]"
        >
          Go Back
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <>
          <div className="flex flex-wrap relative items-between mt-[2rem] ml-[10rem]">
            <div>
              <img
                src={product.image}
                alt={product.name}
                className="w-full xl:w-[31rem] lg:w-[15rem] md:w-[10rem] sm:w-[10rem] mr-[2rem]"
              />
              <HeartIcon product={product} />
            </div>

            <div className="flex flex-col justify-between">
              <h2 className="text-2xl font-semibold text-white">
                {product.name}
              </h2>
              <p className="my-4 text-[#B0B0B0] xl:w-[35rem]">
                {product.description}
              </p>

              <p className="py-4 font-extrabold text-3xl text-white">
                $ {product.price}
              </p>

              <div className="flex items-center justify-between w-[20rem]">
                <div className="one">
                  <h1 className="flex items-center mb-6 text-white">
                    <FaStore className="mr-2 text-white" /> Brand:{" "}
                    {product.brand}
                  </h1>
                  <h1 className="flex items-center mb-6 text-white">
                    <FaClock className="mr-2 text-white" /> Added:{" "}
                    {moment(product.createdAt).fromNow()}
                  </h1>
                  <h1 className="flex items-center mb-6 text-white">
                    <FaStar className="mr-2 text-white" /> Reviews:{" "}
                    {product.numReviews}
                  </h1>
                </div>

                <div className="two">
                  <h1 className="flex items-center mb-6 text-white">
                    <FaStar className="mr-2 text-white" /> Ratings: {rating}
                  </h1>
                  <h1 className="flex items-center mb-6 text-white">
                    <FaShoppingCart className="mr-2 text-white" /> Quantity:{" "}
                    {product.quantity}
                  </h1>
                  <h1 className="flex items-center mb-6 text-white">
                    <FaBox className="mr-2 text-white" /> In Stock:{" "}
                    {product.countInStock}
                  </h1>
                </div>
              </div>

              <div className="flex justify-between flex-wrap">
                <Ratings
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />

                {product.countInStock > 0 && (
                  <div>
                    <select
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      className="rounded-lg text-block p-2 w-[6rem]"
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="btn-container">
                <button
                  onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                  className="bg-pink-600 text-white py-2 px-4 rounded-lg mt-4 md:mt-0"
                >
                  Add To Cart
                </button>
              </div>
            </div>

            <div className="container flex flex-wrap items-start justify-between mt-[5rem] ml-[10rem]">
              <ProductReview
                loadingProductReview={loadingProductReview}
                userInfo={userInfo}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setcomment={setcomment}
                product={product}
                submitHandler={submitHandler}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ProductDetails;
