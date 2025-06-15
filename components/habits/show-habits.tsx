import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form'
import { Checkbox } from '../ui/checkbox'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Habit } from '@/types/next-auth-d'
import axios from 'axios'
import { toast } from 'sonner'
import { useEffect } from 'react'

const FormSchema = z.object({
  items: z.array(z.string())
})

function ShowHabits({
  habits,
}: {
  habits: Habit[];
}) {

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { items: habits.filter(h => h.isCompleted).map(h => h.$id) },
  })

  useEffect(() => {
    const completedIds = habits.filter(h => h.isCompleted).map(h => h.$id)
    form.setValue('items', completedIds)
  }, [habits, form])

  const handleHabitCheck = async ({
    checked,
    habitId,
    field,
  }: {
    checked: boolean;
    habitId: string;
    field: {
      value: string[];
      onChange: (value: string[]) => void;
    };
  }) => {
    field.onChange(
      checked
        ? [...field.value, habitId]
        : field.value?.filter((id) => id !== habitId)
    );

    try {
      if (checked) {
        await axios.post('/api/habits/complete', { id: habitId })
      } else {
        await axios.post('/api/habits/incomplete', { id: habitId })
      }
    } catch (error) {
      toast.error('Failed to update habit!');
      console.log(error)
      field.onChange(
        !checked
          ? [...field.value, habitId]
          : field.value?.filter((id) => id !== habitId)
      )
    }
  }

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name='items'
        render={() => (
          <FormItem>
            {habits.map((habit) => (
              <FormField
                key={habit.$id}
                control={form.control}
                name='items'
                render={({ field }) => {
                  return (
                    <FormItem
                      className='flex flex-row items-center gap-2'
                    >
                      <FormControl>
                        <Checkbox
                          className='size-6 cursor-pointer'
                          checked={field.value?.includes(habit.$id)}
                          onCheckedChange={async (checked) => {
                            handleHabitCheck({ checked: Boolean(checked), habitId: habit.$id, field })
                          }}
                        />
                      </FormControl>
                      <FormLabel className='cursor-pointer'>
                        {habit.title}
                      </FormLabel>
                    </FormItem>
                  )
                }}
              />
            ))}
          </FormItem>
        )}
      />
    </Form>
  )
}

export default ShowHabits