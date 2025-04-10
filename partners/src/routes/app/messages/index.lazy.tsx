import EventMessages from '@/features/app/home/messages'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/app/messages/')({
  component: EventMessages,
})
