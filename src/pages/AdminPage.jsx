import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function AdminPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
    stock: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  let user = null;
  try { user = JSON.parse(localStorage.getItem("user") || "null"); } catch {};

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    api
      .get("/api/v1/product")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const res = await api.post(
        "/api/v1/update",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setForm((prev) => ({ ...prev, imageUrl: res.data.imageUrl }));
      alert("Image uploaded successfully");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await api.post("/api/v1/admin/", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({
        title: "",
        description: "",
        price: "",
        category: "",
        imageUrl: "",
        stock: "",
      });
      setImageFile(null);
      fetchProducts();
      alert("Product created!");
    } catch (err) {
      console.error(err);
      alert("Create failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/api/v1/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-medium text-shopsy-dark">
          Admin Dashboard
        </h1>
        <span className="text-sm text-shopsy-gray bg-shopsy-light px-3 py-1 rounded-sm">
          Manage Products
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Product Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-sm shadow-sm p-6 sticky top-24">
            <h2 className="text-base font-medium text-shopsy-dark mb-4 pb-3 border-b border-gray-100">
              Create Product
            </h2>

            <div className="space-y-3">
              {/* Image Upload */}
              <div>
                <label className="text-xs text-shopsy-gray block mb-1">
                  Product Image
                </label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="text-xs w-full file:mr-2 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-xs file:bg-shopsy-light file:text-shopsy-dark hover:file:bg-gray-200"
                  />
                </div>
                <button
                  onClick={handleImageUpload}
                  disabled={uploading || !imageFile}
                  className="mt-2 w-full bg-gray-100 text-shopsy-dark py-1.5 rounded-sm text-xs font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Upload Image"}
                </button>
                {form.imageUrl && (
                  <p className="text-[10px] text-shopsy-green mt-1 truncate">
                    ✓ Image uploaded
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs text-shopsy-gray block mb-1">
                  Title
                </label>
                <input
                  name="title"
                  placeholder="Product title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-shopsy-blue"
                />
              </div>

              <div>
                <label className="text-xs text-shopsy-gray block mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Product description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-shopsy-blue resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-shopsy-gray block mb-1">
                    Price
                  </label>
                  <input
                    name="price"
                    placeholder="0.00"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-shopsy-blue"
                  />
                </div>
                <div>
                  <label className="text-xs text-shopsy-gray block mb-1">
                    Stock
                  </label>
                  <input
                    name="stock"
                    placeholder="0"
                    value={form.stock}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-shopsy-blue"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-shopsy-gray block mb-1">
                  Category
                </label>
                <input
                  name="category"
                  placeholder="e.g. Electronics"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-shopsy-blue"
                />
              </div>

              <button
                onClick={handleCreate}
                className="w-full bg-shopsy-blue text-white py-2.5 rounded-sm text-sm font-medium hover:bg-blue-600 transition-colors uppercase"
              >
                Create Product
              </button>
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-sm shadow-sm p-6">
            <h2 className="text-base font-medium text-shopsy-dark mb-4 pb-3 border-b border-gray-100">
              Existing Products ({products.length})
            </h2>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-shopsy-blue border-t-transparent rounded-full mx-auto"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 text-shopsy-gray text-sm">
                No products yet. Create your first product.
              </div>
            ) : (
              <div className="space-y-3">
                {products.map((p) => (
                  <div
                    key={p._id}
                    className="flex items-center gap-4 p-3 border border-gray-100 rounded-sm hover:bg-gray-50 transition-colors"
                  >
                    {p.images?.[0] ? (
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-14 h-14 object-contain bg-gray-50 rounded-sm"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gray-50 rounded-sm flex items-center justify-center text-shopsy-gray">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-shopsy-dark truncate">
                        {p.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-shopsy-gray">
                        <span>${p.price}</span>
                        <span className="bg-shopsy-light px-1.5 py-0.5 rounded-sm">
                          {p.category}
                        </span>
                        <span
                          className={
                            p.stock > 0
                              ? "text-shopsy-green"
                              : "text-red-500"
                          }
                        >
                          Stock: {p.stock}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-red-400 hover:text-red-600 transition-colors p-1"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
