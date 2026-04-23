import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../context/AuthContext'

function AdminRoute() {
  const { user, isAdmin, loading, profile } = useAuth()

  if (loading) {
    return <p className="p-8 text-zinc-500">Loading...</p>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (profile && !isAdmin) {
    return <Navigate to="/" replace />
  }

  if (!profile) {
    return <p className="p-8 text-zinc-500">Checking permissions...</p>
  }

  return <Outlet />
}

export default AdminRoute
