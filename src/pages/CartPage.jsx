import { useSelector } from "react-redux";
import { removeFromCart, clearCart } from "../store/cartSlice";
import { useDispatch } from "react-redux";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";

function CartPage() {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const total = (cart.items || []).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleCheckout = async () => {
    try {
      let user = null;
      try { user = JSON.parse(localStorage.getItem("user") || "null"); } catch {};
      const token = localStorage.getItem("token");
      if (!user || !token) {
        alert("Please login to place an order");
        return;
      }
      await api.post(
        "/api/v1/Order",
        {
          user: user.userId,
          products: cart.items?.map((item) => ({
            product: item.id,
            quantity: item.quantity,
          })),
          total: total,
          shippingAddress: "Keshopur, Bihar",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(clearCart());
      navigate("/orders");
    } catch (err) {
      alert("Order failed. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-medium text-shopsy-dark mb-6">
        Shopping Cart
        {cart.items?.length > 0 && (
          <span className="text-sm font-normal text-shopsy-gray ml-2">
            ({cart.items.length} items)
          </span>
        )}
      </h1>

      {cart.items?.length === 0 ? (
        <div className="bg-white rounded-sm shadow-sm p-16 text-center">
          <svg
            className="w-24 h-24 mx-auto text-shopsy-gray mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
            />
          </svg>
          <h2 className="text-xl font-medium text-shopsy-dark mb-2">
            Your cart is empty
          </h2>
          <p className="text-shopsy-gray mb-6">Add items to get started</p>
          <Link
            to="/"
            className="inline-block bg-shopsy-blue text-white px-8 py-3 rounded-sm font-medium text-sm hover:bg-blue-600 transition-colors uppercase"
          >
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {cart.items?.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-sm shadow-sm p-4 flex gap-4 items-center"
              >
                {/* Product Image */}
                <div className="w-20 h-20 bg-gray-50 rounded-sm overflow-hidden shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-shopsy-gray">
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${item.id}`}
                    className="text-sm font-medium text-shopsy-dark hover:text-shopsy-blue truncate block"
                  >
                    {item.title}
                  </Link>
                  <p className="text-xs text-shopsy-gray mt-0.5">
                    Qty: {item.quantity}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-base font-bold text-shopsy-dark">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <span className="text-xs text-shopsy-gray line-through">
                      ${(item.price * item.quantity * 1.3).toFixed(0)}
                    </span>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-shopsy-gray hover:text-red-500 transition-colors p-2"
                  title="Remove"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-sm shadow-sm p-6 h-fit sticky top-24">
            <h2 className="text-base font-medium text-shopsy-dark mb-4 pb-4 border-b border-gray-100">
              Order Summary
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-shopsy-gray">Subtotal ({cart.items.length} items)</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-shopsy-gray">Delivery</span>
                <span className="text-shopsy-green font-medium">FREE</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="font-medium text-shopsy-dark">Total</span>
                <span className="text-xl font-bold text-shopsy-dark">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
            <p className="text-[10px] text-shopsy-gray mt-3">
              You will save ${(total * 0.3).toFixed(2)} on this order
            </p>
            <button
              onClick={handleCheckout}
              className="w-full bg-shopsy-blue text-white py-3 rounded-sm font-semibold text-sm hover:bg-blue-600 transition-colors mt-4 uppercase"
            >
              Place Order
            </button>
            <Link
              to="/"
              className="block text-center text-shopsy-blue text-sm mt-3 hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
