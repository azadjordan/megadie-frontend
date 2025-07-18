import { useDispatch, useSelector } from "react-redux";
import { useGetCategoriesQuery } from "../slices/categoriesApiSlice";
import {
  setProductType,
  toggleCategoryId,
  resetFilters,
  toggleAttribute,
} from "../slices/filtersSlice";
import { FaBoxOpen, FaFilter, FaLayerGroup, FaEraser } from "react-icons/fa";
import SmartTagSelector from "./SmartTagSelector";

const ShopFilters = () => {
  const dispatch = useDispatch();
  const { selectedProductType, selectedCategoryIds, selectedAttributes } =
    useSelector((state) => state.filters);

  const { data: categories = [], isLoading, error } = useGetCategoriesQuery();

  if (isLoading)
    return <p className="text-sm italic p-4">Loading filters...</p>;
  if (error)
    return <p className="text-sm text-red-500 p-4">Failed to load filters.</p>;

  const productTypes = [...new Set(categories.map((cat) => cat.productType))];
  const relatedCategories = categories.filter(
    (cat) => cat.productType === selectedProductType
  );

  return (
    <div className="bg-white rounded md:rounded-lg shadow-sm border border-gray-300 text-sm divide-gray-300 divide-y">
      {/* Product Types */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-purple-600 flex items-center gap-2">
            <FaBoxOpen /> Product Type
          </h3>
          {(selectedProductType || selectedCategoryIds.length > 0) && (
            <button
              onClick={() => dispatch(resetFilters())}
              className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 hover:cursor-pointer font-medium transition"
            >
              <FaEraser className="w-3 h-3" />
              Clear Filters
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {productTypes.map((type) => (
            <button
              key={type}
              onClick={() => dispatch(setProductType(type))}
              className={`cursor-pointer text-left px-3 py-2 rounded-md text-sm font-medium transition ${
                selectedProductType === type
                  ? "bg-purple-500 text-white"
                  : "hover:bg-purple-100 text-gray-800"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      {selectedProductType && (
        <div className="p-5">
          <h4 className="text-base font-semibold text-purple-600 flex items-center gap-2 mb-3">
            <FaLayerGroup /> Categories
          </h4>
          <div className="flex flex-wrap gap-2">
            {relatedCategories.map((cat) => {
              const isSelected = selectedCategoryIds.includes(cat._id);
              return (
                <span
                  key={cat._id}
                  onClick={() => dispatch(toggleCategoryId(cat._id))}
                  className={`cursor-pointer px-4 py-2 rounded-md text-sm transition ${
                    isSelected
                      ? "bg-purple-200 text-purple-800"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  {cat.displayName || cat.name}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      {selectedProductType && relatedCategories.length > 0 && (
        <div className="p-5 border-t border-gray-200">
          <h4 className="text-base font-semibold text-purple-600 flex items-center gap-2 mb-3">
            <FaFilter /> More Options
          </h4>

          {(() => {
            const allFilters = {};
            relatedCategories.forEach((cat) => {
              cat.filters.forEach((filter) => {
                const key = filter.Key;
                if (!allFilters[key]) {
                  allFilters[key] = {
                    displayName: filter.displayName,
                    values: new Set(),
                    order: filter.order || 0,
                  };
                }
                filter.values.forEach((val) => allFilters[key].values.add(val));
              });
            });

            const filtersArray = Object.entries(allFilters)
              .map(([key, { displayName, values, order }]) => ({
                key,
                displayName,
                values: Array.from(values),
                order,
              }))
              .sort((a, b) => a.order - b.order);

            return filtersArray.map((filter) => {
              const selected = selectedAttributes[filter.key] || [];

              return (
                <div key={filter.key} className="mb-4">
                  <p className="font-medium text-gray-700 mb-2">
                    {filter.displayName}
                  </p>

                  {filter.values.length > 15 ? (
                    <SmartTagSelector
                      label={filter.displayName}
                      values={filter.values}
                      selectedValues={selected}
                      onToggle={(val) =>
                        dispatch(
                          toggleAttribute({ key: filter.key, value: val })
                        )
                      }
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {filter.values.map((val) => {
                        const isSelected = selected.includes(val);
                        return (
                          <span
                            key={val}
                            onClick={() =>
                              dispatch(
                                toggleAttribute({ key: filter.key, value: val })
                              )
                            }
                            className={`px-3 py-1 rounded-md cursor-pointer text-xs transition ${
                              isSelected
                                ? "bg-purple-200 text-purple-900"
                                : "bg-gray-100 hover:bg-purple-100 text-gray-800"
                            }`}
                          >
                            {val}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            });
          })()}
        </div>
      )}
    </div>
  );
};

export default ShopFilters;
