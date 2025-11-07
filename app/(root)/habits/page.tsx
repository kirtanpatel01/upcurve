'use client'

import HabitList from './components/habit-list'
import { useHabitsByUser } from './hooks/use-habits-by-user'
import { useUser } from '@/utils/supabase/use-user'

function Page() {
  const { user, loading } = useUser();
  const { data: habits, isLoading } = useHabitsByUser(user?.id)

  return (
    <div>
      <div className='p-4'>
        <HabitList habits={habits || []} loading={loading || isLoading} />
      </div>
    </div>
  )
}

export default Page