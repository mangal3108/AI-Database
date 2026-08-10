'use client'

import Link from 'next/link'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Eye, EyeOff, Mail, Lock, Shield, CheckCircle2, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isGithubLoading, setIsGithubLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      toast.error('Invalid email or password')
      return
    }

    toast.success('Welcome back!')
    router.push('/dashboard')
    router.refresh()
  }

  const handleGoogle = async () => {
    setIsGoogleLoading(true)
    await signIn('google', { callbackUrl: '/dashboard' })
  }

  const handleGitHub = async () => {
    setIsGithubLoading(true)
    await signIn('github', { callbackUrl: '/dashboard' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {/* Glassmorphic Main Card */}
      <div className="bg-[#0D111A]/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl shadow-black/80 relative overflow-hidden group">
        {/* Top subtle gradient border light line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-1.5 mb-5 group-hover:scale-105 transition-transform duration-300">
            <span className="font-extrabold text-2xl tracking-tight select-none font-sans">
              <span className="text-white">INTERN</span>
              <span className="text-[#60A5FA]">ITE</span>
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-[#60A5FA] border border-[#60A5FA]/30 shadow-sm shadow-indigo-500/20">AI</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Welcome back</h1>
          <p className="text-sm text-slate-400 mt-1.5 font-medium">Sign in to continue to your workspace</p>
        </div>

        {/* Social Auth Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleGoogle}
            disabled={isGoogleLoading || isSubmitting}
            className="w-full flex items-center justify-center gap-3 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-2xl py-3.5 px-4 text-sm font-semibold text-slate-200 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
          >
            {isGoogleLoading ? <Loader2 size={18} className="animate-spin text-indigo-400" /> : <GoogleIcon />}
            <span>Continue with Google</span>
          </button>

          <button
            onClick={handleGitHub}
            disabled={isGithubLoading || isSubmitting}
            className="w-full flex items-center justify-center gap-3 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-2xl py-3.5 px-4 text-sm font-semibold text-slate-200 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
          >
            {isGithubLoading ? <Loader2 size={18} className="animate-spin text-indigo-400" /> : <GitHubIcon />}
            <span>Continue with GitHub</span>
          </button>
        </div>

        {/* Styled Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-800 to-slate-800" />
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">or continue with email</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-slate-800 to-slate-800" />
        </div>

        {/* Form Controls */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <Mail size={16} />
              </div>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                className="w-full bg-slate-950/60 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none transition-all duration-200"
                placeholder="you@company.com"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-400 mt-1.5 font-medium">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider" htmlFor="password">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <Lock size={16} />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                {...register('password')}
                className="w-full bg-slate-950/60 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl pl-11 pr-11 py-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none transition-all duration-200"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-rose-400 mt-1.5 font-medium">{errors.password.message}</p>
            )}
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold py-4 rounded-2xl text-sm transition-all duration-200 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 group/btn mt-2"
          >
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin text-white" />
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-slate-400 mt-8 font-medium">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
            Create one
          </Link>
        </p>
      </div>

      {/* Trust & Security Signals Footer */}
      <div className="mt-8 flex items-center justify-center gap-6 text-slate-500 text-xs font-semibold">
        <div className="flex items-center gap-1.5">
          <Shield size={14} className="text-indigo-400" />
          <span>Your data is secure</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-slate-800" />
        <div className="flex items-center gap-1.5">
          <CheckCircle2 size={14} className="text-indigo-400" />
          <span>SOC 2 Compliant</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-slate-800" />
        <div className="flex items-center gap-1.5">
          <Lock size={14} className="text-indigo-400" />
          <span>Privacy First</span>
        </div>
      </div>
    </motion.div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  )
}
