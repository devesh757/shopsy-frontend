import { useEffect, useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    api
      .get("/api/v1/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrders(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-green-100 text-green-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-shopsy-blue border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-shopsy-gray">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium text-shopsy-dark">My Orders</h1>
          <p className="text-sm text-shopsy-gray mt-1">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          to="/"
          className="bg-shopsy-blue text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-sm shadow-sm p-16 text-center">
          <svg className="w-24 h-24 mx-auto text-shopsy-gray mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h2 className="text-xl font-medium text-shopsy-dark mb-2">No orders yet</h2>
          <p className="text-shopsy-gray mb-6">Start shopping to see your orders here</p>
          <Link
            to="/"
            className="inline-block bg-shopsy-blue text-white px-8 py-3 rounded-sm font-medium text-sm hover:bg-blue-600 transition-colors uppercase"
          >
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-sm shadow-sm overflow-hidden">
              {/* Order Header */}
              <div className="bg-shopsy-light px-6 py-3 flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm">
                  <span className="text-shopsy-gray">Order #</span>
                  <span className="font-medium text-shopsy-dark ml-1">{order._id.slice(-8).toUpperCase()}</span>
                </div>
                <div className="text-sm">
                  <span className="text-shopsy-gray">Placed on </span>
                  <span className="font-medium text-shopsy-dark">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric"
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full capitalize ${getStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                  <span className="text-sm font-bold text-shopsy-dark">${order.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-6 py-4">
                <div className="space-y-3">
                  {(order.products || []).map((item) => {
                    const product = item.product || {};
                    return (
                      <div key={item._id || product._id} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-sm overflow-hidden shrink-0">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-full h-full object-contain p-1"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-shopsy-gray text-xs">
                              No img
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product/${product._id}`}
                            className="text-sm font-medium text-shopsy-dark hover:text-shopsy-blue truncate block"
                          >
                            {product.title || "Product"}
                          </Link>
                          <p className="text-xs text-shopsy-gray mt-0.5">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-sm font-medium text-shopsy-dark shrink-0">
                          ${(product.price || 0).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Footer */}
              <div className="border-t border-gray-100 px-6 py-3 flex items-center justify-between">
                <span className="text-xs text-shopsy-gray">
                  Ship to: {order.shippingAddress}
                </span>
                <Link
                  to={`/product/${order.products[0]?.product?._id || ""}`}
                  className="text-xs text-shopsy-blue hover:underline font-medium"
                >
                  View Product
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
