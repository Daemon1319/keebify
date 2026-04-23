import { useEffect, useState } from 'react'
import {
  getAllProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  type ProductInput,
} from '../../lib/products'
import type { Product, Category } from '../../types/product'

const emptyForm: ProductInput = {
  name: '',
  description: '',
  price: 0,
  image_url: '',
  stock: 0,
  category_id: null,
}

function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [editingId, setEditingId] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState<ProductInput>(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    setError('')
    try {
      const [productsData, categoriesData] = await Promise.all([
        getAllProducts(),
        getCategories(),
      ])
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  function startNew() {
    setEditingId(null)
    setForm(emptyForm)
    setFormOpen(true)
  }

  function startEdit(product: Product) {
    setEditingId(product.id)
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url,
      stock: product.stock,
      category_id: product.category_id,
    })
    setFormOpen(true)
  }

  function cancelForm() {
    setFormOpen(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload: ProductInput = {
        ...form,
        description: form.description?.trim() || null,
        image_url: form.image_url?.trim() || null,
      }
      if (editingId) {
        await updateProduct(editingId, payload)
      } else {
        await createProduct(payload)
      }
      await loadData()
      cancelForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(product: Product) {
    if (!window.confirm(`Delete "${product.name}"?`)) return
    try {
      await deleteProduct(product.id)
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  return (
    <div className="px-8 py-12 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-zinc-900">Admin · Products</h1>
        {!formOpen && (
          <button
            onClick={startNew}
            className="px-4 py-2 bg-zinc-900 text-white font-bold rounded hover:bg-zinc-700"
          >
            New product
          </button>
        )}
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {formOpen && (
        <form
          onSubmit={handleSave}
          className="border border-zinc-200 rounded p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <h2 className="md:col-span-2 text-xl font-bold text-zinc-900">
            {editingId ? 'Edit product' : 'New product'}
          </h2>

          <label className="flex flex-col gap-1 md:col-span-2">
            <span className="text-sm text-zinc-600">Name</span>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="p-2 rounded bg-zinc-100 text-zinc-900"
            />
          </label>

          <label className="flex flex-col gap-1 md:col-span-2">
            <span className="text-sm text-zinc-600">Description</span>
            <textarea
              value={form.description ?? ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="p-2 rounded bg-zinc-100 text-zinc-900"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-zinc-600">Price</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              required
              className="p-2 rounded bg-zinc-100 text-zinc-900"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-zinc-600">Stock</span>
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
              required
              className="p-2 rounded bg-zinc-100 text-zinc-900"
            />
          </label>

          <label className="flex flex-col gap-1 md:col-span-2">
            <span className="text-sm text-zinc-600">Image URL</span>
            <input
              type="url"
              value={form.image_url ?? ''}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="https://..."
              className="p-2 rounded bg-zinc-100 text-zinc-900"
            />
          </label>

          <label className="flex flex-col gap-1 md:col-span-2">
            <span className="text-sm text-zinc-600">Category</span>
            <select
              value={form.category_id ?? ''}
              onChange={(e) =>
                setForm({ ...form, category_id: e.target.value || null })
              }
              className="p-2 rounded bg-zinc-100 text-zinc-900"
            >
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>

          <div className="md:col-span-2 flex gap-2 justify-end">
            <button
              type="button"
              onClick={cancelForm}
              className="px-4 py-2 border border-zinc-200 rounded hover:border-zinc-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-zinc-900 text-white font-bold rounded hover:bg-zinc-700 disabled:bg-zinc-300"
            >
              {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-zinc-500">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-zinc-500">No products yet.</p>
      ) : (
        <div className="border border-zinc-200 rounded overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 text-left text-sm text-zinc-600">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const cat = categories.find((c) => c.id === product.category_id)
                return (
                  <tr
                    key={product.id}
                    className="border-t border-zinc-200 text-zinc-900"
                  >
                    <td className="p-3">{product.name}</td>
                    <td className="p-3">${product.price.toFixed(2)}</td>
                    <td className="p-3">{product.stock}</td>
                    <td className="p-3 text-zinc-500">{cat?.name ?? '—'}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => startEdit(product)}
                        className="text-zinc-600 hover:text-zinc-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminProducts
