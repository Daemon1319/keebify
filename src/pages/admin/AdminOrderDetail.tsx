import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { getOrderById, updateOrderStatus } from '../../lib/orders'
import { ORDER_STATUSES, type OrderStatus, type OrderWithItems } from '../../types/order'

function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<OrderWithItems | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingStatus, setSavingStatus] = useState(false)

  useEffect(() => {
    if (!id) return
    async function load() {
      try {
        const data = await getOrderById(id!)
        setOrder(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  async function handleStatusChange(newStatus: OrderStatus) {
    if (!order) return
    setSavingStatus(true)
    setError('')
    try {
      const updated = await updateOrderStatus(order.id, newStatus)
      setOrder({ ...order, ...updated })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update')
    } finally {
      setSavingStatus(false)
    }
  }

  if (loading) {
    return <p className="px-8 py-12 text-zinc-500">Loading...</p>
  }

  if (!order) {
    return (
      <div className="px-8 py-12">
        <h1 className="text-2xl font-bold text-zinc-900 mb-4">Order not found</h1>
        <Link to="/admin/orders" className="text-zinc-900 underline">
          Back to orders
        </Link>
      </div>
    )
  }

  return (
    <div className="px-8 py-12 max-w-4xl mx-auto">
      <Link
        to="/admin/orders"
        className="text-zinc-500 hover:text-zinc-900 text-sm mb-4 inline-block"
      >
        ← Back to orders
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">
            Order #{order.id.slice(0, 8)}
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-zinc-600">Status</span>
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
            disabled={savingStatus}
            className="p-2 rounded bg-zinc-100 text-zinc-900 capitalize"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Customer info */}
      <section className="border border-zinc-200 rounded p-6 mb-6">
        <h2 className="font-bold text-zinc-900 mb-3">Customer</h2>
        <p className="text-zinc-600">
          <span className="text-zinc-500 text-sm">Email: </span>
          {order.email ?? '—'}
        </p>
        <p className="text-zinc-600">
          <span className="text-zinc-500 text-sm">User ID: </span>
          {order.user_id ?? 'Guest'}
        </p>
      </section>

      {/* Items */}
      <section className="border border-zinc-200 rounded p-6 mb-6">
        <h2 className="font-bold text-zinc-900 mb-3">Items</h2>
        {order.items.length === 0 ? (
          <p className="text-zinc-500">No items.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="w-16 h-16 bg-zinc-100 rounded overflow-hidden shrink-0">
                  {item.product_image_url && (
                    <img
                      src={item.product_image_url}
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-zinc-900">{item.product_name}</p>
                  <p className="text-zinc-500 text-sm">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <p className="font-bold text-zinc-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Shipping */}
      {order.shipping_address && (
        <section className="border border-zinc-200 rounded p-6 mb-6">
          <h2 className="font-bold text-zinc-900 mb-3">Shipping</h2>
          <pre className="text-zinc-600 text-sm whitespace-pre-wrap">
            {JSON.stringify(order.shipping_address, null, 2)}
          </pre>
        </section>
      )}

      {/* Total */}
      <section className="flex justify-end">
        <div className="flex items-center gap-6">
          <span className="text-zinc-500">Total</span>
          <span className="text-2xl font-bold text-zinc-900">
            ${order.total.toFixed(2)}
          </span>
        </div>
      </section>
    </div>
  )
}

export default AdminOrderDetail
