import { useSelector } from "react-redux";
import { selectFavorateProduct } from "../../app/features/favorites/favoriteSlice";
import Product from "./Product";

function Favorites() {
  const favorites = useSelector(selectFavorateProduct);
  return (
    <div className="ml-[10rem]">
      <h1 className="text-lg font-bold ml-[3rem] mt-[3rem] text-white">
        FAVORITE PRODUCTS
      </h1>

      <div className="flex flex-wrap">
        {favorites.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Favorites;
