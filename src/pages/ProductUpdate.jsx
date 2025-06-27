import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../slices/productsApiSlice";
import { useGetCategoriesQuery } from "../slices/categoriesApiSlice";
import { toast } from "react-toastify";

// === ENUM OPTIONS ===
const SIZE_OPTIONS = [
  "1-inch",
  "1/2-inch",
  "3/4-inch",
  "0.4x1.5-mm",
  "0.5x1.5-mm",
  "0.5x1.6-mm",
  "6-mm",
  "9-mm",
  "10-mm",
  "12-mm",
];

const VARIANT_OPTIONS = ["100-yd", "150-yd", "35-yd"];

const QUALITY_OPTIONS = ["A++", "A", "B"];

const ProductUpdate = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductByIdQuery(productId, { refetchOnMountOrArgChange: true });
  const { data: categories = [] } = useGetCategoriesQuery();
  const [updateProduct] = useUpdateProductMutation();

  const [formData, setFormData] = useState({
    productType: "",
    category: "",
    size: "",
    variant: "",
    color: "",
    code: "",
    displaySpecs: "",
    sort: 0,
    stock: 0,
    moq: 1,
    isAvailable: true,
    origin: "",
    storageLocation: "",
    price: 0,
    unit: "",
    images: [],
    description: "",
    quality: "",
    isActive: true,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        productType: product.productType || "",
        category: product.category?._id || product.category || "",
        size: product.size || "",
        variant: product.variant || "",
        color: product.color || "",
        code: product.code || "",
        displaySpecs: product.displaySpecs || "",
        sort: product.sort || 0,
        stock: product.stock || 0,
        moq: product.moq || 1,
        isAvailable: product.isAvailable ?? true,
        origin: product.origin || "",
        storageLocation: product.storageLocation || "",
        price: product.price || 0,
        unit: product.unit || "",
        images: product.images || [],
        description: product.description || "",
        quality: product.quality || "",
        isActive: product.isActive ?? true,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };

  const handleRemoveImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };

  const handleAddImage = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({ id: productId, ...formData }).unwrap();
      toast.success("Product updated successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product. Please try again.");
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error loading product</p>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Update Product</h2>
        <button
          onClick={handleSubmit}
          className="p-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>

      <form className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <div>
          <label>Product Type</label>
          <input
            type="text"
            value={formData.productType}
            disabled
            className="w-full border p-2 rounded bg-gray-100"
          />
        </div>

        <div>
          <label>Product Name</label>
          <input
            type="text"
            value={product?.name || ""}
            disabled
            className="w-full border p-2 rounded bg-gray-100"
          />
        </div>

        <div>
          <label>SKU</label>
          <input
            type="text"
            value={product?.sku || ""}
            disabled
            className="w-full border p-2 rounded bg-gray-100"
          />
        </div>

        <div>
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.displayName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Size</label>
          <select
            name="size"
            value={formData.size}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            {SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Variant</label>
          <select
            name="variant"
            value={formData.variant}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Variant</option>
            {VARIANT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Color</label>
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Code</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Sort (for ordering)</label>
          <input
            type="number"
            name="sort"
            value={formData.sort}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="e.g., 117"
          />
        </div>

        <div>
          <label>Quality</label>
          <select
            name="quality"
            value={formData.quality}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Quality</option>
            {QUALITY_OPTIONS.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Display Specs</label>
          <input
            type="text"
            name="displaySpecs"
            value={formData.displaySpecs}
            onChange={handleChange}
            placeholder="Code Quality Length Other ...etc"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>MOQ</label>
          <input
            type="number"
            name="moq"
            value={formData.moq}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Origin</label>
          <input
            type="text"
            name="origin"
            value={formData.origin}
            onChange={handleChange}
            placeholder="Jessie Weifang"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Storage Location</label>
          <input
            type="text"
            name="storageLocation"
            value={formData.storageLocation}
            onChange={handleChange}
            placeholder="ctn:A17 or Other"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Price (AED)</label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Unit</label>
          <input
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            placeholder="Roll, Pack, Piece"
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
            />
            <span>Available</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            <span>Active</span>
          </label>
        </div>

        <div className="md:col-span-3">
          <label className="block mb-1">Images (URLs)</label>
          {formData.images.map((img, idx) => (
            <div key={idx} className="flex items-center gap-3 mb-2">
              <img
                src={img}
                alt={`preview-${idx}`}
                className="w-16 h-16 object-cover border rounded"
              />
              <input
                type="text"
                value={img}
                onChange={(e) => handleImageChange(idx, e.target.value)}
                className="w-full max-w-md border p-2 rounded"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="px-3 py-2 bg-red-500 text-white rounded text-xs"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddImage}
            className="mt-2 p-2 bg-green-500 text-white rounded"
          >
            Add Image URL
          </button>
        </div>

        <div className="md:col-span-3">
          <label>Description</label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
      </form>
    </div>
  );
};

export default ProductUpdate;
