import { useState, useEffect } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/");
  }, [navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    try {
      const res = await api.post(
        "/api/v1/auth/login",
        { email, password }
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert("Login successful!");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Flipkart-style login split */}
        <div className="bg-white rounded-sm shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-5">
            {/* Left panel - branding */}
            <div className="md:col-span-2 bg-shopsy-blue text-white p-6 flex flex-col justify-between min-h-[200px]">
              <div>
                <h2 className="text-2xl font-bold mb-2">Login</h2>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Get access to your Orders, Wishlist and Recommendations
                </p>
              </div>
              <div className="text-blue-200 text-xs mt-4">
                <svg className="w-16 h-16 opacity-50" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M50 10L60 40H90L65 60L75 90L50 70L25 90L35 60L10 40H40Z" />
                </svg>
              </div>
            </div>

            {/* Right panel - form */}
            <div className="md:col-span-3 p-8">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded-sm mb-4">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    className="w-full border-b-2 border-gray-200 pb-2 text-sm focus:outline-none focus:border-shopsy-blue transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    className="w-full border-b-2 border-gray-200 pb-2 text-sm focus:outline-none focus:border-shopsy-blue transition-colors"
                  />
                </div>

                <p className="text-[10px] text-shopsy-gray leading-relaxed">
                  By continuing, you agree to Shopsy's{" "}
                  <Link to="/" className="text-shopsy-blue hover:underline">
                    Terms of Use
                  </Link>{" "}
                  and{" "}
                  <Link to="/" className="text-shopsy-blue hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>

                <button
                  onClick={handleLogin}
                  className="w-full bg-shopsy-blue text-white py-3 rounded-sm font-semibold text-sm hover:bg-blue-600 transition-colors uppercase"
                >
                  Login
                </button>

                <div className="text-center text-sm text-shopsy-gray">
                  <Link to="/register" className="text-shopsy-blue hover:underline font-medium">
                    New to Shopsy? Create an account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
