import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { getAllOrders } from '../../lib/orders'
import { ORDER_STATUSES, type Order, type OrderStatus } from '../../types/order'

function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')

  useEffect(() => {
    async function load() {
      try {
        setOrders(await getAllOrders())
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return orders
    return orders.filter((o) => o.status === statusFilter)
  }, [orders, statusFilter])

  return (
    <div className="px-8 py-12 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-zinc-900 mb-6">Admin · Orders</h1>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 rounded border ${
            statusFilter === 'all'
              ? 'bg-zinc-900 text-white border-zinc-900'
              : 'bg-white text-zinc-900 border-zinc-200 hover:border-zinc-900'
          }`}
        >
          All
        </button>
        {ORDER_STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded border capitalize ${
              statusFilter === status
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-white text-zinc-900 border-zinc-200 hover:border-zinc-900'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <p className="text-zinc-500">Loading...</p>
      ) : filteredOrders.length === 0 ? (
        <p className="text-zinc-500">No orders found.</p>
      ) : (
        <div className="border border-zinc-200 rounded overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 text-left text-sm text-zinc-600">
              <tr>
                <th className="p-3">Order</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Date</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-zinc-200 text-zinc-900"
                >
                  <td className="p-3 font-mono text-sm">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="p-3 text-zinc-600">{order.email ?? '—'}</td>
                  <td className="p-3 text-zinc-500 text-sm">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3">${order.total.toFixed(2)}</td>
                  <td className="p-3">
                    <span className="capitalize text-sm">{order.status}</span>
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="text-zinc-600 hover:text-zinc-900"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminOrders
