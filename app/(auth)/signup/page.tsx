import { SignupForm } from '@/components/auth/signup-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account — Internite AI',
}

export default function SignupPage() {
  return <SignupForm />
}
