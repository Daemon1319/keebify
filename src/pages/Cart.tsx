import { Link } from 'react-router'
import { useCart } from '../context/CartContext'

function Cart() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="px-8 py-12 max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-zinc-900 mb-4">Your cart is empty</h1>
        <p className="text-zinc-500 mb-6">
          Find something you like and add it to your cart.
        </p>
        <Link
          to="/products"
          className="inline-block px-6 py-3 bg-zinc-900 text-white font-bold rounded hover:bg-zinc-700"
        >
          Browse products
        </Link>
      </div>
    )
  }

  return (
    <div className="px-8 py-12 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-zinc-900">
          Cart ({totalItems})
        </h1>
        <button
          onClick={clearCart}
          className="text-zinc-500 hover:text-zinc-900 text-sm"
        >
          Clear cart
        </button>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        {items.map((item) => (
          <div
            key={item.product_id}
            className="flex gap-4 border border-zinc-200 rounded p-4"
          >
            <Link
              to={`/products/${item.product_id}`}
              className="w-24 h-24 bg-zinc-100 rounded overflow-hidden shrink-0"
            >
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              )}
            </Link>

            <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <Link
                  to={`/products/${item.product_id}`}
                  className="font-bold text-zinc-900 hover:underline"
                >
                  {item.name}
                </Link>
                <p className="text-zinc-500 text-sm">
                  ${item.price.toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border border-zinc-200 rounded">
                  <button
                    onClick={() =>
                      updateQuantity(item.product_id, item.quantity - 1)
                    }
                    className="px-3 py-1 text-zinc-600 hover:text-zinc-900"
                  >
                    −
                  </button>
                  <span className="px-3 text-zinc-900">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.product_id, item.quantity + 1)
                    }
                    disabled={item.quantity >= item.stock}
                    className="px-3 py-1 text-zinc-600 hover:text-zinc-900 disabled:text-zinc-300 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>

                <p className="font-bold text-zinc-900 w-20 text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>

                <button
                  onClick={() => removeItem(item.product_id)}
                  className="text-zinc-400 hover:text-red-500"
                  aria-label="Remove item"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="border-t border-zinc-200 pt-6 flex flex-col items-end gap-4">
        <div className="flex items-center gap-6">
          <span className="text-zinc-500">Total</span>
          <span className="text-2xl font-bold text-zinc-900">
            ${totalPrice.toFixed(2)}
          </span>
        </div>
        <Link
          to="/checkout"
          className="px-6 py-3 bg-zinc-900 text-white font-bold rounded hover:bg-zinc-700"
        >
          Checkout
        </Link>
      </div>
    </div>
  )
}

export default Cart
