import { useDispatch, useSelector } from "react-redux";
import {
  addToFavorites,
  removeFromFavorites,
  selectFavorateProduct,
  setFavorites,
} from "../app/features/favorites/favoriteSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useEffect } from "react";
import {
  addFavoriteToLocalStorage,
  deleteFavoriteFromLocalStorage,
  getFavoritesFromLocalStorage,
} from "../utils/localStorage";

const HeartIcon = ({ product }) => {
  const dispatch = useDispatch();

  const favorites = useSelector(selectFavorateProduct) || [];

  const isFavorited = favorites.some((p) => p._id === product._id);

  console.log(isFavorited);

  useEffect(() => {
    const favoritesFromLocalStorage = getFavoritesFromLocalStorage();
    dispatch(setFavorites(favoritesFromLocalStorage));
  }, []);

  const toggleFavorites = () => {
    if (isFavorited) {
      dispatch(removeFromFavorites(product));
      deleteFavoriteFromLocalStorage(product._id);
    } else {
      dispatch(addToFavorites(product));
      addFavoriteToLocalStorage(product);
    }
  };

  return (
    <button
      onClick={toggleFavorites}
      className="absolute top-2 right-5 cursor-pointer"
    >
      {isFavorited ? (
        <FaHeart className="text-pink-500" />
      ) : (
        <FaRegHeart className="text-white" />
      )}
    </button>
  );
};

export default HeartIcon;
