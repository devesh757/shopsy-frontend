import { useEffect, useState, useCallback } from "react";
import api from "../api";
import { Link, useSearchParams } from "react-router-dom";
import { addToCart } from "../store/cartSlice";
import { useDispatch } from "react-redux";

const categories = [
  { name: "Electronics", icon: "🖥️", color: "from-blue-500 to-blue-700" },
  { name: "Fashion", icon: "👕", color: "from-pink-500 to-rose-600" },
  { name: "Home", icon: "🏠", color: "from-green-500 to-emerald-600" },
  { name: "Books", icon: "📚", color: "from-purple-500 to-violet-600" },
  { name: "Sports", icon: "⚽", color: "from-orange-500 to-red-600" },
  { name: "Beauty", icon: "💄", color: "from-pink-400 to-purple-500" },
];

const heroSlides = [
  {
    title: "Big Billion Days",
    subtitle: "Up to 70% off on Electronics",
    cta: "Shop Now",
    bg: "from-blue-600 via-blue-500 to-indigo-700",
    img: "https://picsum.photos/seed/banner1/800/400",
  },
  {
    title: "Fashion Fest",
    subtitle: "Min 50% off on Top Brands",
    cta: "Explore Fashion",
    bg: "from-pink-600 via-pink-500 to-rose-700",
    img: "https://picsum.photos/seed/banner2/800/400",
  },
  {
    title: "Home Makeover Sale",
    subtitle: "Furniture & Decor starting at 999",
    cta: "View Deals",
    bg: "from-emerald-600 via-emerald-500 to-teal-700",
    img: "https://picsum.photos/seed/banner3/800/400",
  },
];

const deals = [
  { title: "Under $29", desc: "Best deals on fashion", color: "bg-rose-50 border-rose-200" },
  { title: "Electronics", desc: "Up to 60% off", color: "bg-blue-50 border-blue-200" },
  { title: "Free Delivery", desc: "On first order", color: "bg-green-50 border-green-200" },
  { title: "New Launches", desc: "Check out latest", color: "bg-purple-50 border-purple-200" },
];

function HomePage() {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [addingId, setAddingId] = useState(null);

  const dispatch = useDispatch();

  const fetchProducts = useCallback(() => {
    const params = {};
    if (q) params.q = q;
    if (category) params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    api
      .get("/api/v1/product", { params })
      .then((res) => setProducts(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error(err));
  }, [q, category, minPrice, maxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setQ(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleAddToCart = async (product) => {
    setAddingId(product._id);
    dispatch(
      addToCart({
        id: product._id,
        title: product.title,
        price: product.price,
        quantity: 1,
        image: product.images?.[0] || "",
      })
    );
    setTimeout(() => setAddingId(null), 600);
  };

  const goToSlide = (index) => setCurrentSlide(index);

  const slide = heroSlides[currentSlide];

  return (
    <div>
      {/* Hero Carousel */}
      <div className={`relative overflow-hidden bg-gradient-to-r ${slide.bg} text-white`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative z-10 flex items-center min-h-[280px] md:min-h-[340px]">
            <div className="flex-1 py-12 md:py-16 hero-slide">
              <h1 className="text-3xl md:text-5xl font-bold mb-3 leading-tight">{slide.title}</h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">{slide.subtitle}</p>
              <Link
                to="/?q="
                className="inline-block bg-white text-shopsy-dark px-8 py-3 rounded-sm font-semibold text-sm hover:bg-gray-100 transition-colors uppercase shadow-lg"
              >
                {slide.cta}
              </Link>
            </div>
            <div className="hidden md:block w-80 lg:w-96 hero-slide">
              <img src={slide.img} alt="" className="w-full h-64 object-cover rounded-lg shadow-2xl" />
            </div>
          </div>
        </div>
        {/* Slide dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === currentSlide ? "bg-white w-6" : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Deal Tags */}
      <div className="max-w-7xl mx-auto px-4 -mt-6 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {deals.map((deal) => (
            <div key={deal.title} className={`${deal.color} border rounded-sm p-4 text-center bg-white shadow-sm`}>
              <h3 className="font-bold text-shopsy-dark text-sm">{deal.title}</h3>
              <p className="text-xs text-shopsy-gray mt-0.5">{deal.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Category Strip */}
      <div className="bg-white shadow-sm mt-6">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex gap-8 overflow-x-auto pb-2 scrollbar-hide justify-center">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => {
                  setCategory(cat.name === category ? "" : cat.name);
                  fetchProducts();
                }}
                className={`flex flex-col items-center gap-1.5 min-w-[80px] group transition-all ${
                  category === cat.name ? "opacity-100" : "opacity-80 hover:opacity-100"
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform group-hover:shadow-lg ${
                    category === cat.name ? "ring-2 ring-shopsy-blue ring-offset-2 scale-110" : ""
                  }`}
                >
                  {cat.icon}
                </div>
                <span className="text-xs font-medium text-shopsy-dark whitespace-nowrap">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <form onSubmit={handleSearch} className="bg-white p-4 rounded-sm shadow-sm flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-shopsy-gray font-medium block mb-1">Search</label>
            <input
              placeholder="Search products..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-shopsy-blue focus:ring-1 focus:ring-shopsy-blue/20"
            />
          </div>
          <div className="w-36">
            <label className="text-xs text-shopsy-gray font-medium block mb-1">Category</label>
            <input
              placeholder="e.g. Electronics"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-shopsy-blue focus:ring-1 focus:ring-shopsy-blue/20"
            />
          </div>
          <div className="w-28">
            <label className="text-xs text-shopsy-gray font-medium block mb-1">Min Price</label>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-shopsy-blue focus:ring-1 focus:ring-shopsy-blue/20"
            />
          </div>
          <div className="w-28">
            <label className="text-xs text-shopsy-gray font-medium block mb-1">Max Price</label>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-shopsy-blue focus:ring-1 focus:ring-shopsy-blue/20"
            />
          </div>
          <button
            type="submit"
            className="bg-shopsy-blue text-white px-6 py-2 rounded-sm text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            Filter
          </button>
          {(q || category || minPrice || maxPrice) && (
            <button
              type="button"
              onClick={() => {
                setQ("");
                setCategory("");
                setMinPrice("");
                setMaxPrice("");
              }}
              className="text-shopsy-gray text-sm hover:text-shopsy-red transition-colors px-2"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="section-title">
              {q ? `Results for "${q}"` : category ? `${category}` : "Recommended Products"}
            </h2>
            <p className="text-xs text-shopsy-gray -mt-3">Hottest deals picked just for you</p>
          </div>
          <span className="text-sm text-shopsy-gray bg-white px-3 py-1 rounded-sm shadow-sm">
            {products.length} products
          </span>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-sm shadow-sm">
            <svg className="w-20 h-20 mx-auto text-shopsy-gray mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-shopsy-gray text-lg">No products found</p>
            <button
              onClick={() => {
                setQ("");
                setCategory("");
                setMinPrice("");
                setMaxPrice("");
              }}
              className="mt-4 btn-primary"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {products.map((product, idx) => (
              <div
                key={product._id}
                className="product-card group"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <Link to={`/product/${product._id}`}>
                  <div className="aspect-square bg-white overflow-hidden relative">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-contain p-4 product-img"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-shopsy-gray bg-gray-50">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    {product.stock <= 5 && product.stock > 0 && (
                      <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-medium px-2 py-0.5 rounded-sm">
                        Only {product.stock} left
                      </span>
                    )}
                    {product.stock === 0 && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-medium px-2 py-0.5 rounded-sm">
                        Out of stock
                      </span>
                    )}
                    {product.price < 50 && (
                      <span className="absolute top-2 right-2 bg-shopsy-red text-white text-[10px] font-medium px-2 py-0.5 rounded-sm">
                        HOT
                      </span>
                    )}
                  </div>
                </Link>
                <div className="p-3">
                  <Link to={`/product/${product._id}`}>
                    <h3 className="text-sm font-medium text-shopsy-dark truncate group-hover:text-shopsy-blue transition-colors">
                      {product.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-shopsy-gray mt-0.5 truncate">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-shopsy-green bg-green-50 px-1 py-0.5 rounded font-medium">4.3 ★</span>
                    <span className="text-[10px] text-shopsy-gray">(1.2k)</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold text-shopsy-dark">${product.price}</span>
                    {product.price > 20 && (
                      <>
                        <span className="text-xs text-shopsy-gray line-through">${(product.price * 1.3).toFixed(0)}</span>
                        <span className="text-xs text-shopsy-green font-medium">30% off</span>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className={`mt-2 w-full py-1.5 rounded-sm text-xs font-semibold transition-all duration-200 uppercase tracking-wide ${
                      addingId === product._id
                        ? "bg-green-500 text-white scale-95"
                        : "bg-shopsy-yellow text-shopsy-dark hover:bg-amber-400"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {addingId === product._id ? "✓ Added" : product.stock === 0 ? "Sold Out" : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Brand Banner */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="bg-white rounded-sm shadow-sm p-8 text-center">
          <h2 className="text-xl font-medium text-shopsy-dark mb-4">Top Brands Available</h2>
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-60">
            {["Nike", "Apple", "Samsung", "Sony", "Adidas", "Puma", "LG", "Dell"].map((brand) => (
              <span key={brand} className="text-lg font-bold text-shopsy-gray tracking-wider uppercase">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-shopsy-dark mt-12">
        <div className="max-w-7xl mx-auto px-4 py-10 text-center">
          <h2 className="text-white text-xl font-medium mb-2">Stay in the Loop</h2>
          <p className="text-shopsy-gray text-sm mb-6">Subscribe to get the latest deals and offers</p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2.5 rounded-sm text-sm focus:outline-none"
            />
            <button className="bg-shopsy-yellow text-shopsy-dark px-6 py-2.5 rounded-sm font-semibold text-sm hover:bg-amber-400 transition-colors uppercase">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
