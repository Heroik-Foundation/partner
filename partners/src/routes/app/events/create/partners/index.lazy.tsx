import SelectEventPartner from '@/features/app/events/create/partners'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/app/events/create/partners/')({
  component: SelectEventPartner,
})
