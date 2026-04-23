import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { getProductById } from '../lib/products'
import type { Product } from '../types/product'

function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return

    async function loadProduct() {
      try {
        const data = await getProductById(id!)
        setProduct(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product')
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [id])

  if (loading) {
    return (
      <div className="px-8 py-12">
        <p className="text-zinc-500">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-8 py-12">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="px-8 py-12">
        <h1 className="text-2xl font-bold text-zinc-900 mb-4">
          Product not found
        </h1>
        <Link to="/products" className="text-zinc-900 underline">
          Back to products
        </Link>
      </div>
    )
  }

  const outOfStock = product.stock <= 0

  return (
    <div className="px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {/* Image */}
        <div className="w-full aspect-square bg-zinc-100 rounded overflow-hidden">
          {product.image_url && (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">
            {product.name}
          </h1>
          <p className="text-2xl text-zinc-900 mb-6">
            ${product.price.toFixed(2)}
          </p>

          {product.description && (
            <p className="text-zinc-600 mb-6">{product.description}</p>
          )}

          <p className="text-zinc-500 text-sm mb-6">
            {outOfStock ? 'Out of stock' : `${product.stock} in stock`}
          </p>

          <button
            disabled={outOfStock}
            className="px-6 py-3 bg-zinc-900 text-white font-bold rounded hover:bg-zinc-700 disabled:bg-zinc-300 disabled:cursor-not-allowed"
          >
            {outOfStock ? 'Out of stock' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
