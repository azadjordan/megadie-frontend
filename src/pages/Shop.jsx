import { useSelector } from "react-redux";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import ProductCard from "../components/ProductCard";
import ShopFilters from "../components/ShopFilters";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaFilter, FaChevronDown, FaChevronUp } from "react-icons/fa";

const Shop = () => {
  const location = useLocation();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    if (location.state?.fromHome) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.state]);

  const { selectedProductType, selectedCategoryIds, selectedAttributes } = useSelector((state) => state.filters);

  const query = {
    ...(selectedProductType && { productType: selectedProductType }),
    ...(selectedCategoryIds.length > 0 && { categoryIds: selectedCategoryIds }),
    ...(Object.keys(selectedAttributes).length > 0 && { attributes: selectedAttributes }),
  };

  const {
    data: products = [],
    isLoading,
    error,
  } = useGetProductsQuery(query);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedProductType]);

  return (
    <div className="w-full text-gray-800 bg-gray-50 mt-6">
      <div className="flex flex-col md:flex-row gap-4 mx-auto pb-10 px-4 sm:px-6">

        {/* 🔹 Desktop Filter Sidebar */}
        <aside className="hidden md:block w-full md:w-1/4 h-fit">
          <ShopFilters />
        </aside>

        {/* 🔹 Main Content */}
        <main className="w-full md:w-3/4">

          {/* 🔹 Mobile Filter Toggle Button */}
          <div className="md:hidden pb-2 flex">
            <button
              onClick={() => setShowMobileFilters((prev) => !prev)}
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded border transition 
                ${
                  showMobileFilters
                    ? " border-purple-300 text-purple-800"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
            >
              <FaFilter className={showMobileFilters ? "text-purple-600" : "text-gray-500"} />
              {showMobileFilters ? "Hide Filters" : "Show Filters"}
              {showMobileFilters ? (
                <FaChevronUp className="ml-1 text-xs" />
              ) : (
                <FaChevronDown className="ml-1 text-xs" />
              )}
            </button>
          </div>

          {/* 🔹 Mobile Collapsible Filter Panel */}
          {showMobileFilters && (
            <div className="md:hidden mb-4 transition-all duration-300">
              <ShopFilters />
            </div>
          )}

          {/* 🔹 Product Grid */}
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
