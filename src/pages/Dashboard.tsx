import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { ShieldCheck, LogOut, CheckCircle2 } from 'lucide-react'

export default function Dashboard() {
  const { user, signOut, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/', { replace: true })
    }
  }, [user, loading, navigate])

  const handleSignOut = async () => {
    await signOut()
    navigate('/', { replace: true })
  }

  return (
    <div className="w-full max-w-[480px] rounded-2xl bg-white p-6 sm:p-8 shadow-[0_10px_30px_rgba(15,118,110,0.08)] border border-gray-100 text-center animate-fade-in-up">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-[#0F766E] ring-8 ring-teal-50/50">
        <CheckCircle2 className="h-8 w-8" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-medium mb-3">
        <ShieldCheck className="h-3.5 w-3.5 text-[#0F766E]" />
        <span>Sessão Autenticada</span>
      </div>

      <h1 className="text-2xl font-bold text-[#1F2937] tracking-tight">
        Login realizado com sucesso
      </h1>

      <p className="mt-2 text-sm text-[#6B7280]">
        Bem-vindo ao painel interno da{' '}
        <span className="font-semibold text-[#1F2937]">Diretoria Promoções</span>.
      </p>

      {user?.email && (
        <div className="mt-5 rounded-lg bg-[#F9FAFB] border border-[#D1D5DB]/60 p-3 text-xs text-[#1F2937]">
          <span className="text-[#6B7280] block mb-0.5">Usuário conectado:</span>
          <span className="font-mono font-medium text-sm text-[#0F766E]">{user.email}</span>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-3">
        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center justify-center gap-2 w-full h-11 rounded-lg bg-white border border-[#D1D5DB] hover:bg-gray-50 text-sm font-semibold text-[#1F2937] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20"
        >
          <LogOut className="h-4 w-4 text-[#6B7280]" />
          <span>Encerrar sessão</span>
        </button>
      </div>
    </div>
  )
}
