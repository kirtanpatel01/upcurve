'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Edit, Save } from 'lucide-react';
import axios from 'axios';
import ShowHabits from './show-habits';
import EditHabits from './edit-habits';
import { Habit } from '@/types/next-auth-d';
import { useAuth } from '@/context/AuthContext';
import HabitNoxSkeleton from '../skeletons/habit-box-skeleton';
import { client } from '@/lib/appwrite';
import { dbId, habitCollectionId } from '@/lib/config';
import { toast } from 'sonner';

export default function HabitBox() {
  const [editMode, setEditMode] = useState(false)
  const [habits, setHabits] = useState<Habit[]>([])
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading } = useAuth();

  const fetchHabits = useCallback(async () => {
    const id = user?.id;
    try {
      const res = await axios.get(`/api/habits?id=${id}`);
      setHabits(res.data.data.habits.documents);
    } catch (error) {
      console.log("Error while fetching habits from habit-box.jsx: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = client.subscribe(
      `databases.${dbId}.collections.${habitCollectionId}.documents`,
      res => {
        if (typeof res.payload === 'object' && res.payload !== null && '$id' in res.payload) {
          const payload = res.payload as Habit;
          // do stuff...
          const isCreate = res.events.some(e => e.includes('create'));
          const isUpdate = res.events.some(e => e.includes('update'));
          const isDelete = res.events.some(e => e.includes('delete'));

          if (isCreate) {
            setHabits(prev => [...prev, payload])
          }

          if (isUpdate) {
            setHabits(prev =>
              prev.map(habit =>
                habit.$id === payload.$id ? { ...habit, ...payload } : habit
              )
            );
          }

          if (isDelete) {
            setHabits(prev =>
              prev.filter(habit => habit.$id !== payload.$id)
            );
          }
        }
      }
    );

    return () => unsubscribe();
  }, [setHabits]);

  useEffect(() => {
    if (loading) return;

    if (user) {
      fetchHabits();
    } else {
      setIsLoading(false)
    }
  }, [user, loading, fetchHabits])

  useEffect(() => {
    if (!user && !loading) {
      setHabits([]);
      setEditMode(false);
    }
  }, [user, loading]);

  const toggleEdiMode = () => {
    if (!user) return toast.error("Please login to edit habits");
    setEditMode(!editMode)
  }

  const date = new Date();
  const formattedDate = `${date.toLocaleDateString('en-US', { weekday: 'long' })} ${date.getDate()}, ${date.getFullYear()}`;

  const completedCount = habits.filter(h => h.isCompleted).length;

  return (
    <Card className='max-w-lg'>
      <CardHeader className="flex justify-between items-center text-2xl font-medium">
        <span>{formattedDate}</span>
        <div className='flex items-center gap-1 p-2 rounded-2xl'>
          {/* <FaFire className='text-orange-500' /> */}
          <span className='py-2 px-3 rounded-md bg-sky-500/10 border border-sky-700'>{completedCount}/{habits.length}</span>
        </div>
      </CardHeader>
      <Separator />
      <CardContent>
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
