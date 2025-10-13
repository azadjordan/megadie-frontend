// src/slices/productsApiSlice.js
import { PRODUCTS_URL } from "../constants";
import apiSlice from "./apiSlice";

const buildQS = ({
  productType,
  categoryIds = [],
  attributes = {},
  page = 1,
  limit = 24,
} = {}) => {
  const params = new URLSearchParams();

  if (productType) params.append("productType", productType);

  (Array.isArray(categoryIds) ? categoryIds : [categoryIds])
    .filter(Boolean)
    .forEach((id) => params.append("categoryIds", id));

  if (attributes && typeof attributes === "object") {
    Object.entries(attributes).forEach(([key, values]) => {
      (Array.isArray(values) ? values : [values])
        .filter((v) => v !== undefined && v !== null && v !== "")
        .forEach((v) => params.append(`attributes[${key}]`, v));
    });
  }

  params.append("page", String(page));
  params.append("limit", String(limit));

  return params.toString();
};

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      // args must include page & limit
      query: (args = {}) => `${PRODUCTS_URL}?${buildQS(args)}`,
      // ensure it re-fetches when args change (page/filters)
      refetchOnMountOrArgChange: true,
    }),

    getProductsAdmin: builder.query({
      query: (args = {}) => `/api/products/admin?${buildQS(args)}`,
      refetchOnMountOrArgChange: true,
    }),

    getProductById: builder.query({
      query: (id) => `${PRODUCTS_URL}/${id}`,
    }),

    createProduct: builder.mutation({
      query: (data) => ({ url: PRODUCTS_URL, method: "POST", body: data }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${PRODUCTS_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (r, e, { id }) => [{ type: "Product", id }],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({ url: `${PRODUCTS_URL}/${id}`, method: "DELETE" }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductsAdminQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApiSlice;
