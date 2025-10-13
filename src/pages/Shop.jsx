// src/pages/Shop.jsx
import { useSelector } from "react-redux";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import ProductCard from "../components/ProductCard";
import ShopFilters from "../components/ShopFilters";
import PaginationBar from "../components/PaginationBar";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

const DEFAULT_LIMIT = 48;

const Shop = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // hydrate page from URL so refresh/back keeps the page
  const initialPage = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
  const [page, setPage] = useState(initialPage);
  const limit = DEFAULT_LIMIT;

  const { selectedProductType, selectedCategoryIds, selectedAttributes } =
    useSelector((state) => state.filters);

  useEffect(() => {
    if (location.state?.fromHome) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.state]);

  // reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedProductType, selectedCategoryIds, selectedAttributes]);

  const query = useMemo(
    () => ({
      ...(selectedProductType && { productType: selectedProductType }),
      ...(selectedCategoryIds.length > 0 && { categoryIds: selectedCategoryIds }),
      ...(Object.keys(selectedAttributes).length > 0 && { attributes: selectedAttributes }),
      page,
      limit,
    }),
    [selectedProductType, selectedCategoryIds, selectedAttributes, page, limit]
  );

  const { data, isLoading, error, isFetching } = useGetProductsQuery(query);

  const products = data?.data ?? [];
  const pagination = data?.pagination;

  // scroll + update URL when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const next = new URLSearchParams(searchParams);
    next.set("page", String(page));
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div className="w-full text-gray-800 bg-gray-50 mt-6">
      <div className="flex flex-col md:flex-row gap-4 mx-auto pb-10 px-4 sm:px-6">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4">
          <div className="sticky top-20">
            <ShopFilters />
          </div>
        </aside>

        {/* Main */}
        <main className="w-full md:w-3/4">
          {isLoading ? (
            <p className="text-gray-500 italic">Loading products...</p>
          ) : error ? (
            <p className="text-red-500">Error loading products.</p>
          ) : products.length === 0 ? (
            <p className="text-gray-600 italic">No products found.</p>
          ) : (
            <>
              {pagination && (
                <div className="mb-2 text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-medium">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>{" "}
                  –{" "}
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>{" "}
                  of <span className="font-medium">{pagination.total}</span> items
                </div>
              )}

              {isFetching && (
                <p className="text-xs text-gray-400 mb-2">Updating…</p>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              <PaginationBar
                page={pagination?.page ?? 1}
                totalPages={pagination?.totalPages ?? 1}
                onPageChange={setPage}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
