'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { FaFire } from "react-icons/fa6";
import { Edit, Save } from 'lucide-react';
import axios from 'axios';
import ShowHabits from './show-habits';
import EditHabits from './edit-habits';
import { Habit } from '@/types/next-auth-d';
import { redirect } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import HabitNoxSkeleton from '../skeletons/habit-box-skeleton';

export default function HabitBox() {
  const [editMode, setEditMode] = useState(false)
  const [habits, setHabits] = useState<Habit[]>([])
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading } = useAuth();

  useEffect(() => {
    const fetchHabits = async () => {
      const id = user.$id;
      try {
        const res = await axios.get(`/api/habits?id=${id}`)
        setHabits(res.data.data.habits.documents);
      } catch (error) {
        console.log("Error while fetching habits from habit-box.jsx: ", error);
      } finally {
        setIsLoading(false);
      }
    }
    if (user) {
      fetchHabits();
    }
  }, [user])

  const toggleEdiMode = () => {
    if (editMode && !user) {
      redirect('/auth/login')
    }
    setEditMode(!editMode)
  }

  return (
    <Card className='max-w-lg max-h-[calc(100vh-7rem)]'>
      <CardHeader className="flex justify-between items-center text-2xl font-medium">
        <span>Friday 20, 2025</span>
        <div className='flex items-center gap-1 p-2 rounded-2xl'>
          <FaFire className='text-orange-500' />
          <span>6</span>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className='overflow-y-auto'>
        {isLoading || loading ? (
          <HabitNoxSkeleton />
        ) : habits.length > 0 ? (
          editMode ? (
            <EditHabits habits={habits} setHabits={setHabits} />
          ) : (
            <ShowHabits habits={habits} />
          )
        ) : (
          editMode ? (
            <EditHabits habits={habits} setHabits={setHabits} />
          ) : (
            <div>
              <span className='font-medium text-lg'>No Habits!</span>
              <p className='opacity-50'>Click on edit button to add new habits</p>
            </div>
          )
        )}
      </CardContent>
      <Separator />
      <CardFooter>
        <Button type='button' onClick={toggleEdiMode} className='flex ml-auto cursor-pointer'>
          <span>{editMode ? "Save" : "Edit"}</span>
          {editMode ? <Save /> : <Edit />}
        </Button>
      </CardFooter>
    </Card>
  )
}
