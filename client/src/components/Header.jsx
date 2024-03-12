import { useGetTopProductsQuery } from "../app/api/productApiSlice";
import ProductCarousel from "../pages/Product/ProductCarousel";
import HeaderProducts from "../pages/Product/HeaderProducts";
import Loader from "./Loader";

function Header() {
  const { data, isLoading, error } = useGetTopProductsQuery();
  // taking care of the two errors shown in the console
  if (isLoading) return <Loader />;

  if (error) return <div>Error</div>;

  return (
    <div className="flex justify-around">
      <div className="xl:block lg:hidden md:hidden sm:hidden">
        <div className="grid grid-cols-2">
          {data.map((product) => (
            <div key={product._id}>
              <HeaderProducts product={product} />
            </div>
          ))}
        </div>
      </div>
      <ProductCarousel />
    </div>
  );
}

export default Header;
