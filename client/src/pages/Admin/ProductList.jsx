import { Link } from "react-router-dom";
import { useGetAllProductsQuery } from "../../app/api/productApiSlice";
import Loader from "../../components/Loader";
import moment from "moment";
import { FaArrowRight } from "react-icons/fa";
import { useEffect } from "react";

function ProductList() {
  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = useGetAllProductsQuery();

  useEffect(() => {
    refetch();
  }, [products]);

  if (isLoading) return <Loader />;

  if (isError) return <div>Error loading products</div>;

  return (
    <div className="container mx-[9rem]">
      <div className="flex flex-col md:flex-row">
        <div className="p-3">
          <h1 className="text-xl ml-[2rem] font-bold h-12 text-white">
            All products ({products.length})
          </h1>

          <div className="flex flex-wrap justify-around items-center gap-[9rem]">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`admin/product/update/${product._id}`}
                className="block mb-4 overflow-hidden"
              >
                <div className="flex items-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-[5rem]"
                  />

                  <div className="p-4 flex flex-col">
                    <div className="flex justify-between items-center">
                      <h5 className="text-xl font-semibold  text-white">
                        {product?.name}
                      </h5>

                      <p className="text-sm text-gray-400">
                        {moment(product.createdAt).format("MMMM Do YYYY")}
                      </p>
                    </div>

                    <p className="text-gray-400 text-sm mb-4 w-[20rem] ">
                      {product?.description?.substring(0, 160)}...
                    </p>

                    <div className="flex justify-between">
                      <Link
                        to={`/admin/product/update/${product._id}`}
                        className="text-white flex items-center gap-2 bg-pink-500 px-1 rounded"
                      >
                        Update product <FaArrowRight />
                      </Link>
                      <p className="text-white">${product?.price}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductList;
