import SelectEventCategory from '@/features/app/events/create/category'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/app/events/create/category/')({
  component: SelectEventCategory,
})
