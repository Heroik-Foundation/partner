import SignUpSuccess from '@/features/auth/signup/success'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/auth/signup/success/')({
  component: SignUpSuccess,
})
