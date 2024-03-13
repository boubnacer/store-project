import React, { useState } from "react";
import { useGetTopProductsQuery } from "../../app/api/productApiSlice";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import Ratings from "../../components/Ratings";
import Product from "./Product";

function ProductReview({
  loadingProductReview,
  userInfo,
  rating,
  setRating,
  comment,
  setcomment,
  product,
  submitHandler,
}) {
  const { data, isLoading } = useGetTopProductsQuery();
  const [activeTab, setActiveTab] = useState(1);

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col md:flex-row">
      <section className="mr-[5rem]">
        <div
          className={`flex-1 p-4 cursor-pointer text-lg text-white ${
            activeTab === 1 ? "font-bold" : ""
          }`}
          onClick={() => setActiveTab(1)}
        >
          Write Your Review
        </div>
        <div
          className={`flex-1 p-4 cursor-pointer text-lg text-white ${
            activeTab === 2 ? "font-bold" : ""
          }`}
          onClick={() => setActiveTab(2)}
        >
          All Reviews
        </div>
        <div
          className={`flex-1 p-4 cursor-pointer text-lg text-white ${
            activeTab === 3 ? "font-bold" : ""
          }`}
          onClick={() => setActiveTab(3)}
        >
          Related Products
        </div>
      </section>

      {/* Add review section */}

      <section>
        {activeTab === 1 && (
          <div className="mt-4 mb-6">
            {userInfo ? (
              <form onSubmit={submitHandler}>
                <div className="my-2">
                  <label
                    htmlFor="rating"
                    className="block text-xl mb-2 text-white"
                  >
                    Rating
                  </label>

                  <select
                    id="rating"
                    required
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="py-2 border rounded-lg text-black xl:w-[30rem]"
                  >
                    <option value="">select</option>
                    <option value="1">Inferior</option>
                    <option value="2">Decent</option>
                    <option value="3">Great</option>
                    <option value="4">Excellent</option>
                    <option value="5">Exceptional</option>
                  </select>
                </div>

                <div className="my-2">
                  <label
                    htmlFor="comment"
                    className="block text-xl mb-2 text-white"
                  >
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    cols="60"
                    required
                    value={comment}
                    onChange={(e) => setcomment(e.target.value)}
                    className="p-2 border rounded-lg text-black"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className="bg-pink-600 text-white py-2 px-4 rounded-lg"
                >
                  Submit
                </button>
              </form>
            ) : (
              <p className="text-white">
                Please{" "}
                <Link to="/login" className="underline">
                  sign in
                </Link>{" "}
                to write a review
              </p>
            )}
          </div>
        )}
      </section>

      {/* list of reviews section */}
      <section>
        {activeTab === 2 && (
          <>
            <div>
              {product.reviews.length === 0 && (
                <p className="text-white">No Reviews</p>
              )}
            </div>

            <div>
              {product.reviews.map((review) => (
                <div
                  key={review._id}
                  className="p-4 rounded-lg bg-[#1A1A1A] ml-[2rem] w-[30rem] mb-5"
                >
                  <div className="flex justify-between">
                    <strong className="text-[#B0B0B0]">{review.name}</strong>
                    <p className="text-[#B0B0B0]">
                      {review.createdAt.substring(0, 10)}
                    </p>
                  </div>

                  <p className="my-4 text-white">{review.comment}</p>
                  <Ratings value={review.rating} />
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* related products  */}

      <section>
        {activeTab === 3 && (
          <section className="flex flex-wrap ml-[4rem]">
            {!data ? (
              <Loader />
            ) : (
              data.map((product) => (
                <div key={product._id}>
                  <Product product={product} />
                </div>
              ))
            )}
          </section>
        )}
      </section>
    </div>
  );
}

export default ProductReview;
