import { useSelector } from "react-redux";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import ProductCard from "../components/ProductCard";
import ShopFilters from "../components/ShopFilters";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Shop = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.fromHome) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.state]);

  const { selectedProductType, selectedCategoryIds, selectedAttributes } =
    useSelector((state) => state.filters);

  const query = {
    ...(selectedProductType && { productType: selectedProductType }),
    ...(selectedCategoryIds.length > 0 && { categoryIds: selectedCategoryIds }),
    ...(Object.keys(selectedAttributes).length > 0 && {
      attributes: selectedAttributes,
    }),
  };

  const { data: products = [], isLoading, error } = useGetProductsQuery(query);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedProductType]);

  return (
    <div className="w-full text-gray-800 bg-gray-50 mt-6">
      <div className="flex flex-col md:flex-row gap-4 mx-auto pb-10 px-4 sm:px-6">
        {/* 🔹 Sticky Filter Sidebar on Desktop */}
        <aside className="w-full md:w-1/4">
          <div className="sticky top-20">
            <ShopFilters />
          </div>
        </aside>

        {/* 🔹 Product Grid */}
        <main className="w-full md:w-3/4">
          {isLoading ? (
            <p className="text-gray-500 italic">Loading products...</p>
          ) : error ? (
            <p className="text-red-500">Error loading products.</p>
          ) : products.length === 0 ? (
            <p className="text-gray-600 italic">No products found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
