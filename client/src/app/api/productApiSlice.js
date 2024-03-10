import { apiSlice } from "./apiSlice.js";
import { PRODUCT_URL, UPLOAD_URL } from "../constants.js";

const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword }) => ({
        url: `${PRODUCT_URL}`,
        params: { keyword },
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Product"],
    }),

    getSingleProduct: builder.query({
      query: (id) => `${PRODUCT_URL}/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    getAllProducts: builder.query({
      query: () => `${PRODUCT_URL}/allproducts`,
    }),

    getProductDetails: builder.query({
      query: (id) => ({
        url: `${PRODUCT_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),

    getTopProducts: builder.query({
      query: () => `${PRODUCT_URL}/top`,
      keepUnusedDataFor: 5,
    }),

    getNewProducts: builder.query({
      query: () => `${PRODUCT_URL}/new`,
      keepUnusedDataFor: 5,
    }),

    createProduct: builder.mutation({
      query: (productData) => ({
        url: `${PRODUCT_URL}`,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation({
      query: ({ id, formData }) => ({
        url: `${PRODUCT_URL}/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `${PRODUCT_URL}/${id}`,
        method: "DELETE",
      }),
      providesTags: ["Product"],
    }),

    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}/${data.productId}/reviews`,
        method: "POST",
        body: data,
      }),
    }),

    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateProductMutation,
  useCreateReviewMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useGetAllProductsQuery,
  useGetNewProductsQuery,
  useGetProductDetailsQuery,
  useGetProductsQuery,
  useGetSingleProductQuery,
  useGetTopProductsQuery,
  useUploadProductImageMutation,
} = productApiSlice;
