import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { LogOut } from 'lucide-react'
import { auth } from '../../services/firebase'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

const MESSAGES = {
  'auth/invalid-credential': 'Correo o contraseña incorrectos',
  'auth/invalid-email': 'Ese correo no es válido',
  'auth/too-many-requests': 'Demasiados intentos, espera un momento',
}

export function LoginGate({ children }) {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [signing, setSigning] = useState(false)

  useEffect(() => onAuthStateChanged(auth, (next) => {
    setUser(next)
    setChecking(false)
  }), [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSigning(true)
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
    } catch (err) {
      setError(MESSAGES[err.code] || 'No se pudo iniciar sesión')
    } finally {
      setSigning(false)
    }
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f2ec] text-sm text-slate-400">
        Cargando...
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f2ec] p-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          <div className="rounded-2xl border border-linen-deep bg-white p-8 shadow-[0_1px_2px_rgba(63,58,54,0.04),0_18px_40px_-18px_rgba(63,58,54,0.3)]">
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-olive">
                Panel privado
              </p>
              <h1 className="mt-3 font-serif text-3xl text-ink">Bito &amp; Coni</h1>
              <div className="mx-auto my-5 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Correo"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Contraseña"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && <p className="text-center text-sm text-red-600">{error}</p>}

              <Button type="submit" className="w-full bg-olive py-3 shadow-olive/30 hover:bg-olive-deep" disabled={signing}>
                {signing ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      {children}
      <button
        type="button"
        onClick={() => signOut(auth)}
        className="fixed bottom-5 right-5 inline-flex items-center gap-2 rounded-xl border border-linen-deep bg-white px-4 py-2.5 text-xs font-medium text-slate-600 shadow-lg transition hover:-translate-y-0.5 hover:text-ink"
      >
        <LogOut className="h-3.5 w-3.5" />
        Salir
      </button>
    </>
  )
}
