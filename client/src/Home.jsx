import { useParams } from "react-router";
import { useGetProductsQuery } from "./app/api/productApiSlice";
import Header from "./components/Header";
import Loader from "./components/Loader";
import Message from "./components/Message";
import { Link } from "react-router-dom";
import Product from "./pages/Product/Product";

function Home() {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <>
      {!keyword ? <Header /> : null}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          \{isError?.data.message || isError.error}
        </Message>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h1 className="ml-[20rem] mt-[10rem] text-[3rem] text-white">
              Special Products
            </h1>

            <Link
              to="/shop"
              className="bg-pink-600  font-bold rounded-full py-2 px-10 mr-[18rem] mt-[10rem] text-white"
            >
              Shop
            </Link>
          </div>

          <div className="flex justify-center flex-wrap mt-[2rem]">
            {data.products.map((product) => (
              <div key={product._id}>
                <Product product={product} />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default Home;
