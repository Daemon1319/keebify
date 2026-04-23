import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import ProductCard from '../components/ProductCard'
import { getAllProducts, getCategories } from '../lib/products'
import type { Product, Category } from '../types/product'

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name-asc'

function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [searchParams, setSearchParams] = useSearchParams()
  const selectedCategory = searchParams.get('category') ?? 'all'
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('newest')

  useEffect(() => {
    async function loadData() {
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
    loadData()
  }, [])

  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category_id === selectedCategory)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((p) => p.name.toLowerCase().includes(q))
    }

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'newest':
      default:
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
    }

    return result
  }, [products, selectedCategory, search, sort])

  function handleCategoryChange(categoryId: string) {
    if (categoryId === 'all') {
      searchParams.delete('category')
    } else {
      searchParams.set('category', categoryId)
    }
    setSearchParams(searchParams)
  }

  return (
    <div className="px-8 py-12">
      <h1 className="text-3xl font-bold text-zinc-900 mb-6">Products</h1>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-3 rounded bg-zinc-100 text-zinc-900"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="p-3 rounded bg-zinc-100 text-zinc-900"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A-Z</option>
        </select>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => handleCategoryChange('all')}
          className={`px-4 py-2 rounded border ${
            selectedCategory === 'all'
              ? 'bg-zinc-900 text-white border-zinc-900'
              : 'bg-white text-zinc-900 border-zinc-200 hover:border-zinc-900'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`px-4 py-2 rounded border ${
              selectedCategory === cat.id
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-white text-zinc-900 border-zinc-200 hover:border-zinc-900'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading && <p className="text-zinc-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && filteredProducts.length === 0 && (
        <p className="text-zinc-500">No products found.</p>
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Products
