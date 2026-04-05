import Onboarding from '@/features/auth/home'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Onboarding,
})
