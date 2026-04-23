import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import { getFeaturedProducts, getCategories } from '../lib/products'
import type { Product, Category } from '../types/product'

function Home() {
  const [featured, setFeatured] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const [featuredData, categoriesData] = await Promise.all([
          getFeaturedProducts(3),
          getCategories(),
        ])
        setFeatured(featuredData)
        setCategories(categoriesData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-8 py-24">
        <h1 className="text-5xl font-bold text-zinc-900 mb-4">
          Build your perfect setup.
        </h1>
        <p className="text-zinc-500 text-lg mb-8 max-w-md">
          Premium mechanical keyboards, switches, and accessories for enthusiasts.
        </p>
        <Link
          to="/products"
          className="px-6 py-3 bg-zinc-900 text-white font-bold rounded hover:bg-zinc-700"
        >
          Shop now
        </Link>
      </section>

      {/* Featured products */}
      <section className="px-8 py-12 border-t border-zinc-100">
        <h2 className="text-2xl font-bold text-zinc-900 mb-6">Featured</h2>

        {loading && <p className="text-zinc-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="px-8 py-12 border-t border-zinc-100">
        <h2 className="text-2xl font-bold text-zinc-900 mb-6">Categories</h2>

        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="border border-zinc-200 rounded p-6 text-center hover:border-zinc-900"
              >
                <p className="font-bold text-zinc-900">{cat.name}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 px-8 py-6 mt-12">
        <p className="text-zinc-400 text-sm text-center">
          © {new Date().getFullYear()} Keebify. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

export default Home
