import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { store } from "./store";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import RegisterPage from "./pages/RegisterPage";
import OrdersPage from "./pages/OrdersPage";
import { useState, useEffect } from "react";

function Header() {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const cartCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw || raw === "undefined" || raw === "null") {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
    } else {
      try { setUser(JSON.parse(raw)); } catch { setUser(null); }
    }
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowMore(false);
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/?q=${query}`);
  };

  return (
    <header className={`sticky top-0 z-50 transition-shadow ${scrolled ? "shadow-lg" : "shadow-md"}`}>
      <div className="bg-shopsy-blue">
        <div className="max-w-7xl mx-auto px-4 h-14 md:h-16 flex items-center gap-4 md:gap-6">
          {/* Logo */}
          <Link to="/" className="flex flex-col leading-none shrink-0">
            <span className="text-white text-xl md:text-2xl font-bold italic tracking-wide">Shopsy</span>
            <span className="text-shopsy-yellow text-[10px] font-medium -mt-0.5">
              Explore Plus
              <svg className="inline w-3 h-3 ml-0.5 text-shopsy-yellow" viewBox="0 0 10 10" fill="currentColor">
                <path d="M5 7L1 3h8z" />
              </svg>
            </span>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:flex">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products, brands and more"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-10 pl-4 pr-12 text-sm rounded-sm text-shopsy-dark outline-none shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center text-shopsy-blue hover:text-blue-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* Right side */}
          <div className="flex items-center gap-4 md:gap-6 ml-auto">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="flex items-center gap-1 text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden sm:inline max-w-[100px] truncate">{user.name || "Account"}</span>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${showMore ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showMore && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowMore(false)} />
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-sm shadow-xl border z-20 animate-slide-up">
                      <div className="py-1">
                        <div className="px-4 py-2.5 text-sm text-shopsy-gray border-b">
                          <span className="block font-medium text-shopsy-dark">{user.name}</span>
                          {user.email}
                        </div>
                        <Link
                          to="/orders"
                          onClick={() => setShowMore(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-shopsy-dark hover:bg-shopsy-light transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          My Orders
                        </Link>
                        {user.role === "admin" && (
                          <Link
                            to="/admin"
                            onClick={() => setShowMore(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-shopsy-dark hover:bg-shopsy-light transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm text-shopsy-dark hover:bg-shopsy-light transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-white text-shopsy-blue px-6 py-1.5 text-sm font-semibold rounded-sm hover:bg-gray-100 transition-colors shadow-sm"
              >
                Login
              </Link>
            )}

            <Link
              to="/cart"
              className="relative flex items-center gap-1 text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-shopsy-yellow text-shopsy-dark text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Header />
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Routes>
        </main>
        <footer className="bg-shopsy-dark text-shopsy-gray">
          <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-white text-sm font-medium mb-4 uppercase tracking-wider">About</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/" className="hover:text-white transition-colors">Contact Us</Link></li>
                  <li><Link to="/" className="hover:text-white transition-colors">About Us</Link></li>
                  <li><Link to="/" className="hover:text-white transition-colors">Careers</Link></li>
                  <li><Link to="/" className="hover:text-white transition-colors">Press</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white text-sm font-medium mb-4 uppercase tracking-wider">Help</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/" className="hover:text-white transition-colors">Payments</Link></li>
                  <li><Link to="/" className="hover:text-white transition-colors">Shipping</Link></li>
                  <li><Link to="/" className="hover:text-white transition-colors">Returns</Link></li>
                  <li><Link to="/" className="hover:text-white transition-colors">FAQ</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white text-sm font-medium mb-4 uppercase tracking-wider">Policy</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/" className="hover:text-white transition-colors">Return Policy</Link></li>
                  <li><Link to="/" className="hover:text-white transition-colors">Terms of Use</Link></li>
                  <li><Link to="/" className="hover:text-white transition-colors">Security</Link></li>
                  <li><Link to="/" className="hover:text-white transition-colors">Privacy</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white text-sm font-medium mb-4 uppercase tracking-wider">Mail Us</h3>
                <p className="text-sm leading-relaxed">
                  Shopsy Internet Private Limited,
                  <br />Keshopur, Bihar, India
                </p>
                <div className="mt-4">
                  <h4 className="text-white text-xs font-medium mb-2 uppercase tracking-wider">Social</h4>
                  <div className="flex gap-3">
                    {["F", "T", "I", "Y"].map((s) => (
                      <span key={s} className="w-7 h-7 bg-gray-700 rounded-full flex items-center justify-center text-xs font-bold text-white hover:bg-shopsy-blue transition-colors cursor-pointer">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
              <p>&copy; 2026 Shopsy. All Rights Reserved.</p>
              <div className="flex gap-4">
                <span>Become a Seller</span>
                <span>Advertise</span>
                <span>Gift Cards</span>
                <span>Help Center</span>
              </div>
            </div>
          </div>
        </footer>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
