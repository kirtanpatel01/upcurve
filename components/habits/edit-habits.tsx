import { Habit } from '@/types/next-auth-d'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Dot, Plus, Save, X } from 'lucide-react'
import { Input } from '../ui/input'
import axios from 'axios'
import { toast } from 'sonner'
import { useAuth } from '@/context/AuthContext'

function EditHabits({ 
  habits,
  setHabits 
}: { 
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
}) {
  const [editableHabits, setEditableHabits] = useState<Habit[]>(habits ?? []);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const { user } = useAuth();
  const userId = user?.$id;

  useEffect(() => {
    setEditableHabits(habits);
  }, [habits]);

  const handleChange = (index: number, newTitle: string) => {
    const updated = [...editableHabits];
    updated[index].title = newTitle;
    setEditableHabits(updated);
  };

  const handleSave = async (habit: Habit) => {
    try {
      console.log(habit);
      await axios.put(`/api/habits/${habit.$id}`, { title: habit.title });
    } catch (err) {
      console.log(err);
      toast.error("Failed to update habit");
    }
  };
  
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/habits/${id}`);
      setHabits(prev => prev.filter(h => h.$id !== id));
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete habit");
    }
  };

  const handleAdd = async () => {
    if (!newHabitTitle.trim()) {
      toast.error("Habit title cannot be empty");
      return;
    }

    try {
      const res = await axios.post('/api/habits', {
        userId,
        title: newHabitTitle.trim(),
      });

      const createdHabit = res.data.data.habit;
      setHabits(prev => [...prev, createdHabit]);
      setNewHabitTitle('');
    } catch (error) {
      console.log(error);
      toast.error("Error while storing habit");
    }
  };

  return (
    <div className='space-y-2'>
      <ol className='space-y-2'>
        {editableHabits.map((habit, index) => (
          <li key={habit.$id} className='flex flex-col 2xs:flex-row 2xs:justify-between w-full gap-2'>
            <div className='grid grid-cols-[.07fr_1fr] place-items-center gap-2'>
              <span>{index + 1}. </span>
              <Input
                value={habit.title}
                onChange={(e) => handleChange(index, e.target.value)}
              />
            </div>
            <div className='flex gap-2 self-end 2xs:self-auto'>
              <Button
                variant={'secondary'}
                size={'icon'}
                onClick={() => handleSave(habit)}
                className='cursor-pointer bg-green-500/20'
              >
                <Save className='text-green-500' />
              </Button>
              <Button
                variant={'destructive'}
                size={'icon'}
                onClick={() => handleDelete(habit.$id)}
                className='cursor-pointer'
              >
                <X />
              </Button>
            </div>
          </li>
        ))}
      </ol>
      <div className='flex items-center justify-between gap-2'>
        <div className='grid grid-cols-[.07fr_1fr] place-items-center gap-2'>
          <Dot className='-mx-2 text-primary' />
          <Input
            value={newHabitTitle}
            onChange={(e) => setNewHabitTitle(e.target.value)}
            placeholder='Write new habit...'
            className='w-fit'
          />
        </div>
        <Button size={'icon'} className='cursor-pointer' onClick={handleAdd} disabled={status==='unauthenticated'}>
          <Plus />
        </Button>
      </div>
    </div>
  )
}

export default EditHabits