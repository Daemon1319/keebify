import { Link } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router'

function Navbar() {
  const { user } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <nav className="w-full border-b border-zinc-200 px-8 py-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-zinc-900">
        Keebify
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/products" className="text-zinc-600 hover:text-zinc-900">
          Products
        </Link>
        <Link to="/cart" className="text-zinc-600 hover:text-zinc-900">
          Cart
        </Link>
        {user ? (
          <button
            onClick={handleLogout}
            className="text-zinc-600 hover:text-zinc-900"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 bg-zinc-900 text-white rounded"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar