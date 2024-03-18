import { useDispatch, useSelector } from "react-redux";
import { useFetchCategoriesQuery } from "../app/api/categoryApiSlice";
import {
  useGetAllProductsQuery,
  useGetFilteredProductsQuery,
} from "../app/api/productApiSlice";
import { useEffect, useState } from "react";
import {
  setCategories,
  setChecked,
  setProducts,
} from "../app/features/shop/shopSlice";
import ProductCard from "./Product/ProductCard";
import Loader from "../components/Loader";

function Shop() {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  console.log({ checked, radio });

  const [priceFilter, setPricefilter] = useState("");

  const categoriesQuery = useFetchCategoriesQuery();
  const filteredProductQuery = useGetFilteredProductsQuery({ checked, radio });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductQuery.isLoading) {
        // Filtered products based on both checked categories and pricefilter
        const filteredProducts = filteredProductQuery.data.filter((product) => {
          // check if the product price includes the entered pricefilter value
          return (
            product.price.toString().includes(priceFilter) ||
            product.price === parseInt(priceFilter, 10)
          );
        });
        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductQuery.data, dispatch, priceFilter]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updateChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updateChecked));
  };

  // add "all brands" option to unique brands

  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => setPricefilter(e.target.value);

  return (
    <>
      <div className="container mx-auto">
        <div className="flex md:flex-row">
          <div className="p-3 mt-2 mb-2 ml-[4rem] bg-[#151515]">
            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2 text-white">
              Filter By Categories
            </h2>

            <div className="p-5 w-[15rem]">
              {categories?.map((category) => (
                <div key={category._id} className="mb-2">
                  <div className="flex items-center mr-4">
                    <input
                      type="checkbox"
                      id="red-checkbos"
                      onChange={(e) =>
                        handleCheck(e.target.checked, category._id)
                      }
                      className="w-4 h-4 text-pink-600 focus:ring-pink-500"
                    />
                    <label
                      htmlFor="pink-checkbox"
                      className="ml-2 text-sm font-medium text-white dark:text-gray-600"
                    >
                      {category.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2 text-white">
              Filter By Brand
            </h2>
            <div className="p-5">
              {uniqueBrands?.map((brand) => (
                <div key={brand} className="flex items-center mr-4 mb-5">
                  <input
                    type="radio"
                    id={brand}
                    name="brand"
                    onChange={() => handleBrandClick(brand)}
                  />
                  <label
                    htmlFor="pink-radio"
                    className="ml-2 text-sm font-medium text-white dark:text-gray-600"
                  >
                    {brand}
                  </label>
                </div>
              ))}
            </div>

            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2 text-white">
              Filter By Price
            </h2>
            <div className="p-5 w-[15rem]">
              <input
                type="text"
                placeholder="Enter price"
                value={priceFilter}
                onChange={handlePriceChange}
                className="w-full px-3 py-2 rounded-lg focus:border-pink-500"
              />
            </div>

            <div className="p-5 pt-0">
              <button
                onClick={() => window.location.reload()}
                className="w-full border rounded-full py-4 text-white"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="p-3">
            <h2 className="h4 text-center mb-2 text-white">
              {products?.length} Products
            </h2>

            <div className="flex flex-wrap">
              {products.length === 0 ? (
                <Loader />
              ) : (
                products?.map((product) => (
                  <div key={product._id} className="p-3">
                    <ProductCard product={product} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Shop;
