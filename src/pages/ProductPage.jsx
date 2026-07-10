import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import { addToCart } from "../store/cartSlice";
import { useDispatch } from "react-redux";

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    api
      .get(`/api/v1/product/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product._id,
        title: product.title,
        price: product.price,
        quantity,
        image: product.images?.[0] || "",
      })
    );
  };

  if (!product)
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-shopsy-blue border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-shopsy-gray">Loading...</p>
      </div>
    );

  const images = product.images?.length > 0 ? product.images : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-shopsy-gray mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-shopsy-blue">Home</Link>
        <span>/</span>
        {product.category && (
          <>
            <Link to={`/?category=${product.category}`} className="hover:text-shopsy-blue">
              {product.category}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-shopsy-dark font-medium truncate max-w-[200px]">{product.title}</span>
      </nav>

      <div className="bg-white rounded-sm shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="p-8 border-r border-gray-100">
            <div className="aspect-square bg-white rounded-sm overflow-hidden mb-4 flex items-center justify-center">
              {images[selectedImage] ? (
                <img
                  src={images[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-contain max-h-[400px]"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-shopsy-gray bg-gray-50">
                  <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 border-2 rounded-sm overflow-hidden shrink-0 ${
                      selectedImage === idx ? "border-shopsy-blue" : "border-gray-200"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="p-8">
            <h1 className="text-2xl font-medium text-shopsy-dark mb-2">{product.title}</h1>

            <div className="flex items-center gap-3 mb-4">
              <span className="bg-shopsy-green text-white text-xs font-medium px-2 py-0.5 rounded-sm">
                4.3 ★
              </span>
              <span className="text-sm text-shopsy-gray">1,234 Ratings & 567 Reviews</span>
            </div>

            <div className="bg-shopsy-light p-4 rounded-sm mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-shopsy-dark">${product.price}</span>
                {product.price > 20 && (
                  <>
                    <span className="text-lg text-shopsy-gray line-through">
                      ${(product.price * 1.3).toFixed(0)}
                    </span>
                    <span className="text-shopsy-green text-sm font-medium">30% off</span>
                  </>
                )}
              </div>
              <p className="text-xs text-shopsy-gray mt-1">Inclusive of all taxes</p>
            </div>

            <div className="mb-6">
              <p className="text-sm text-shopsy-dark leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-shopsy-dark mb-2">Category</h3>
              <Link
                to={`/?category=${product.category}`}
                className="inline-block bg-shopsy-light text-shopsy-blue text-sm px-3 py-1 rounded-sm hover:bg-blue-50"
              >
                {product.category}
              </Link>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-shopsy-dark mb-2">Availability</h3>
              {product.stock > 0 ? (
                <span className="text-shopsy-green text-sm font-medium">
                  {product.stock > 5
                    ? "In Stock"
                    : `Only ${product.stock} left in stock`}
                </span>
              ) : (
                <span className="text-red-500 text-sm font-medium">Out of Stock</span>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-lg font-medium text-shopsy-dark hover:bg-gray-50"
                >
                  −
                </button>
                <span className="px-4 py-2 text-sm font-medium border-x border-gray-300 min-w-[40px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 text-lg font-medium text-shopsy-dark hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-shopsy-yellow text-shopsy-dark py-3 rounded-sm font-semibold text-sm hover:bg-amber-400 transition-colors uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
              <button className="flex-1 bg-shopsy-blue text-white py-3 rounded-sm font-semibold text-sm hover:bg-blue-600 transition-colors uppercase">
                Buy Now
              </button>
            </div>

            {/* Product Features */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-shopsy-gray">
                  <svg className="w-5 h-5 text-shopsy-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Secure Payment
                </div>
                <div className="flex items-center gap-2 text-shopsy-gray">
                  <svg className="w-5 h-5 text-shopsy-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Free Delivery
                </div>
                <div className="flex items-center gap-2 text-shopsy-gray">
                  <svg className="w-5 h-5 text-shopsy-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  7 Days Return
                </div>
                <div className="flex items-center gap-2 text-shopsy-gray">
                  <svg className="w-5 h-5 text-shopsy-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Warranty
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
