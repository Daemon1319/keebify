import { Link } from 'react-router'
import type { Product } from '../types/product'

interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="border border-zinc-200 rounded p-4 block hover:border-zinc-900"
    >
      <div className="w-full h-48 bg-zinc-100 rounded mb-4 overflow-hidden">
        {product.image_url && (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <h3 className="font-bold text-zinc-900">{product.name}</h3>
      <p className="text-zinc-500 text-sm">${product.price.toFixed(2)}</p>
    </Link>
  )
}

export default ProductCard
