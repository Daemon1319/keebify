import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-zinc-900 mb-6">Register</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded bg-zinc-100 text-zinc-900"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded bg-zinc-100 text-zinc-900"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="p-3 bg-zinc-900 text-white font-bold rounded"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-zinc-500 mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-zinc-900 underline">Login</a>
        </p>
      </div>
    </div>
  )
}

export default Register