import { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!email || !password || !name) {
      setError("Please fill in all fields");
      return;
    }
    try {
      const res = await api.post(
        "/api/v1/auth/register",
        { email, password, name }
      );
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
      alert("Registration successful!");
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-sm shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-5">
            {/* Left panel - branding */}
            <div className="md:col-span-2 bg-shopsy-blue text-white p-6 flex flex-col justify-between min-h-[200px]">
              <div>
                <h2 className="text-2xl font-bold mb-2">Sign Up</h2>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Create your account to start shopping
                </p>
              </div>
              <div className="text-blue-200 text-xs mt-4">
                <svg className="w-16 h-16 opacity-50" viewBox="0 0 100 100" fill="currentColor">
                  <rect x="20" y="20" width="60" height="60" rx="5" />
                  <circle cx="50" cy="45" r="10" />
                  <path d="M30 70 Q50 55 70 70" />
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
                    type="text"
                    placeholder="Enter Name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError("");
                    }}
                    className="w-full border-b-2 border-gray-200 pb-2 text-sm focus:outline-none focus:border-shopsy-blue transition-colors"
                  />
                </div>
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
                  onClick={handleRegister}
                  className="w-full bg-shopsy-blue text-white py-3 rounded-sm font-semibold text-sm hover:bg-blue-600 transition-colors uppercase"
                >
                  Register
                </button>

                <div className="text-center text-sm text-shopsy-gray">
                  <Link
                    to="/login"
                    className="text-shopsy-blue hover:underline font-medium"
                  >
                    Already have an account? Login
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

export default RegisterPage;
