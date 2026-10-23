import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  X,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

const REMEMBER_ME_KEY = 'diretoria_promocoes_remember_email'

export default function Index() {
  const navigate = useNavigate()
  const { user, signIn, resetPassword, loading: authLoading } = useAuth()

  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Validation & error states
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [authError, setAuthError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalEmail, setModalEmail] = useState('')
  const [modalLoading, setModalLoading] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalError, setModalError] = useState('')

  const passwordInputRef = useRef<HTMLInputElement>(null)
  const modalInputRef = useRef<HTMLInputElement>(null)

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, authLoading, navigate])

  // Pre-fill remembered email
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem(REMEMBER_ME_KEY)
      if (savedEmail) {
        setEmail(savedEmail)
        setRememberMe(true)
      }
    } catch {
      // ignore localStorage errors (e.g. private browsing restrictions)
    }
  }, [])

  // Email validation helper
  const validateEmailFormat = (val: string) => {
    if (!val.trim()) return 'E-mail obrigatório'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(val.trim())) return 'E-mail obrigatório'
    return ''
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setEmail(val)
    if (authError) setAuthError('')
    if (emailTouched) {
      setEmailError(validateEmailFormat(val))
    }
  }

  const handleEmailBlur = () => {
    setEmailTouched(true)
    setEmailError(validateEmailFormat(email))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setPassword(val)
    if (authError) setAuthError('')
    if (passwordTouched) {
      setPasswordError(!val ? 'Senha obrigatória' : '')
    }
  }

  const handlePasswordBlur = () => {
    setPasswordTouched(true)
    setPasswordError(!password ? 'Senha obrigatória' : '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const eErr = validateEmailFormat(email)
    const pErr = !password ? 'Senha obrigatória' : ''

    setEmailTouched(true)
    setPasswordTouched(true)
    setEmailError(eErr)
    setPasswordError(pErr)

    if (eErr || pErr) {
      return
    }

    setIsSubmitting(true)
    setAuthError('')

    try {
      const { error } = await signIn(email.trim(), password)

      if (error) {
        setAuthError('E-mail ou senha incorretos. Tente novamente.')
        // Clean and focus password field as requested in spec
        setPassword('')
        setTimeout(() => {
          passwordInputRef.current?.focus()
        }, 50)
      } else {
        // Save or remove remembered email
        try {
          if (rememberMe) {
            localStorage.setItem(REMEMBER_ME_KEY, email.trim())
          } else {
            localStorage.removeItem(REMEMBER_ME_KEY)
          }
        } catch {
          // ignore localStorage failure
        }
        navigate('/dashboard', { replace: true })
      }
    } catch {
      setAuthError('E-mail ou senha incorretos. Tente novamente.')
      setPassword('')
      setTimeout(() => {
        passwordInputRef.current?.focus()
      }, 50)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Open "Esqueci minha senha" modal
  const openForgotModal = () => {
    setModalEmail(email.trim())
    setModalSuccess(false)
    setModalError('')
    setIsModalOpen(true)
  }

  const closeForgotModal = () => {
    setIsModalOpen(false)
    setModalSuccess(false)
    setModalError('')
  }

  // Handle modal submit
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validateEmailFormat(modalEmail)
    if (err) {
      setModalError('E-mail obrigatório')
      return
    }

    setModalLoading(true)
    setModalError('')

    try {
      const { error } = await resetPassword(modalEmail.trim())
      if (error) {
        setModalError(error.message || 'Erro ao enviar e-mail de recuperação.')
      } else {
        setModalSuccess(true)
      }
    } catch {
      setModalError('Erro ao enviar e-mail de recuperação.')
    } finally {
      setModalLoading(false)
    }
  }

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeForgotModal()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen])

  // Focus modal input on open
  useEffect(() => {
    if (isModalOpen && !modalSuccess) {
      setTimeout(() => {
        modalInputRef.current?.focus()
      }, 100)
    }
  }, [isModalOpen, modalSuccess])

  const emailIsValid = emailTouched && !emailError && email.trim().length > 0
  const emailIsInvalid = emailTouched && Boolean(emailError)

  const passwordIsValid = passwordTouched && !passwordError && password.length > 0
  const passwordIsInvalid = passwordTouched && Boolean(passwordError)

  return (
    <div className="w-full flex justify-center">
      {/* Login Card (max-width 400px, 40px padding desktop / 24px mobile) */}
      <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(15,118,110,0.08)] border border-[#D1D5DB]/60 p-6 sm:p-10 transition-all duration-300 animate-slide-up">
        {/* Card Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E] ring-4 ring-teal-500/10 mb-3.5">
            <ShieldCheck className="h-7 w-7" strokeWidth={2.2} />
          </div>
          <h1 className="text-2xl font-bold text-[#1F2937] tracking-tight">Diretoria Promoções</h1>
          <p className="mt-1 text-sm text-[#6B7280]">Acesso restrito ao painel interno</p>
        </div>

        {/* Error Alert (Above form) */}
        {authError && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-2.5 rounded-lg bg-[#EF4444] p-3 text-white shadow-sm transition-all duration-300 animate-slide-down"
          >
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <p className="flex-1 text-xs font-medium leading-relaxed">{authError}</p>
            <button
              type="button"
              onClick={() => setAuthError('')}
              className="rounded p-0.5 text-white/80 hover:bg-black/10 hover:text-white transition-colors focus:outline-none"
              aria-label="Dispensar alerta"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#1F2937] mb-1.5">
              E-mail corporativo
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#6B7280]">
                <Mail className="h-5 w-5" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                placeholder="nome@diretoriapromocoes.com.br"
                autoComplete="email"
                disabled={isSubmitting}
                className={`h-12 w-full rounded-lg bg-[#F9FAFB] pl-11 pr-3 text-sm text-[#1F2937] placeholder:text-[#6B7280]/70 transition-all duration-200 outline-none border ${
                  emailIsInvalid
                    ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20'
                    : emailIsValid
                      ? 'border-[#10B981] focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20'
                      : 'border-[#D1D5DB] focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20'
                }`}
              />
            </div>
            {emailIsInvalid && (
              <p className="mt-1 text-xs text-[#EF4444] font-medium">{emailError}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#1F2937] mb-1.5">
              Senha
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#6B7280]">
                <Lock className="h-5 w-5" />
              </div>
              <input
                id="password"
                ref={passwordInputRef}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={isSubmitting}
                className={`h-12 w-full rounded-lg bg-[#F9FAFB] pl-11 pr-11 text-sm text-[#1F2937] placeholder:text-[#6B7280]/70 transition-all duration-200 outline-none border ${
                  passwordIsInvalid
                    ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20'
                    : passwordIsValid
                      ? 'border-[#10B981] focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20'
                      : 'border-[#D1D5DB] focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20'
                }`}
              />
              <button
                type="button"
                onClick={() => {
                  setShowPassword((prev) => !prev)
                  // keep focus on password field as requested in spec
                  passwordInputRef.current?.focus()
                }}
                disabled={isSubmitting}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#6B7280] hover:text-[#1F2937] transition-colors focus:outline-none"
                aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {passwordIsInvalid && (
              <p className="mt-1 text-xs text-[#EF4444] font-medium">{passwordError}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password row */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isSubmitting}
                className="h-4 w-4 rounded border-[#D1D5DB] text-[#0F766E] accent-[#0F766E] focus:ring-[#0F766E] focus:ring-offset-0 transition"
              />
              <span className="text-xs text-[#1F2937]">Lembrar de mim</span>
            </label>

            <button
              type="button"
              onClick={openForgotModal}
              disabled={isSubmitting}
              className="text-xs font-medium text-[#0F766E] hover:text-[#115E59] hover:underline transition-colors focus:outline-none focus:underline"
            >
              Esqueci minha senha
            </button>
          </div>

          {/* Submit Button (24px spacing from form above) */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-lg bg-[#0F766E] hover:bg-[#115E59] active:scale-[0.98] text-white font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:ring-offset-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <span>Entrar no sistema</span>
              )}
            </button>
          </div>
        </form>

        {/* Security Notice below form */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-[#6B7280]">
          <ShieldCheck className="h-3.5 w-3.5 text-[#0F766E]" />
          <span>Seus dados estão protegidos com criptografia.</span>
        </div>
      </div>

      {/* Forgot Password Modal (Recuperar acesso) */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop with blur & fade */}
          <div
            onClick={closeForgotModal}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in"
          />

          {/* Modal Card with scale + fade animation */}
          <div className="relative z-10 w-full max-w-[420px] rounded-2xl bg-white p-6 sm:p-7 shadow-2xl border border-gray-100 transition-all duration-200 transform scale-100 animate-fade-in-up">
            {/* Close Button X */}
            <button
              type="button"
              onClick={closeForgotModal}
              className="absolute top-4 right-4 rounded-lg p-1.5 text-[#6B7280] hover:bg-gray-100 hover:text-[#1F2937] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20"
              aria-label="Fechar modal"
            >
              <X className="h-5 w-5" />
            </button>

            {modalSuccess ? (
              <div className="py-3 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-[#10B981] ring-4 ring-emerald-500/10">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#1F2937]">
                  Link enviado! Verifique sua caixa de entrada.
                </h3>
                <p className="mt-2 text-xs text-[#6B7280] leading-relaxed">
                  Enviamos as instruções para{' '}
                  <span className="font-semibold text-[#1F2937]">{modalEmail}</span>. Verifique
                  também sua pasta de spam.
                </p>
                <button
                  type="button"
                  onClick={closeForgotModal}
                  className="mt-6 w-full h-11 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-white text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                >
                  Concluir
                </button>
              </div>
            ) : (
              <div>
                <h3 id="modal-title" className="text-lg font-bold text-[#1F2937] pr-8">
                  Recuperar acesso
                </h3>
                <p className="mt-2 text-xs text-[#6B7280] leading-relaxed">
                  Informe seu e-mail corporativo para receber um link de redefinição de senha.
                </p>

                {modalError && (
                  <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-2.5 text-xs text-[#EF4444] font-medium">
                    {modalError}
                  </div>
                )}

                <form onSubmit={handleModalSubmit} className="mt-5 space-y-4">
                  <div>
                    <label
                      htmlFor="modal-email"
                      className="block text-xs font-medium text-[#1F2937] mb-1"
                    >
                      E-mail corporativo
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#6B7280]">
                        <Mail className="h-4 w-4" />
                      </div>
                      <input
                        id="modal-email"
                        ref={modalInputRef}
                        type="email"
                        value={modalEmail}
                        onChange={(e) => {
                          setModalEmail(e.target.value)
                          if (modalError) setModalError('')
                        }}
                        placeholder="nome@diretoriapromocoes.com.br"
                        disabled={modalLoading}
                        className="h-11 w-full rounded-lg bg-[#F9FAFB] pl-10 pr-3 text-sm text-[#1F2937] placeholder:text-[#6B7280]/70 border border-[#D1D5DB] outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-1 flex gap-2">
                    <button
                      type="button"
                      onClick={closeForgotModal}
                      disabled={modalLoading}
                      className="flex-1 h-11 rounded-lg border border-[#D1D5DB] bg-white hover:bg-gray-50 text-xs font-semibold text-[#1F2937] transition-colors focus:outline-none"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={modalLoading}
                      className="flex-[2] h-11 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                    >
                      {modalLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-white" />
                          <span>Enviando...</span>
                        </>
                      ) : (
                        <span>Enviar link de redefinição</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
