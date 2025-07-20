'use client'

import React, { useCallback, useEffect, useState } from 'react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '../ui/command'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '../ui/card'
import { Separator } from '../ui/separator'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog'
import ExerciseAddForm from './ExerciseAddForm'
import { useAuth } from '@/context/AuthContext'
import axios from 'axios'
import { client } from '@/lib/appwrite'
import { dbId, exerciseCol } from '@/lib/config'
import Link from 'next/link'
import { SkeletonExerciseCard } from '../skeletons/exercise-cards'
import { NoData } from '../no-data'

export interface ExerciseCardType {
  $id: string;
  name: string;
  duration: number;
  durationUnit: string;
  reps: number;
  sets: number;
  type: string;
  user: string;
  streak: string;
}

function ExCards() {
  const [fetching, setFetching] = useState(true)
  const [exercise, setExercise] = useState<ExerciseCardType[] | null>(null)
  const { user, loading } = useAuth()

  const fetchExercises = useCallback(async () => {
    if (!user?.id) return
    try {
      const res = await axios.get(`/api/exercise?userId=${user?.id}`)
      setExercise(res.data.exercises ?? [])
    } catch (error) {
      console.log("Error while fetching exercises: ", error)
    } finally {
      setFetching(false)
    }
  }, [user?.id])

  useEffect(() => {
    const unsubscribe = client.subscribe(
      `databases.${dbId}.collections.${exerciseCol}.documents`,
      res => {
        if (typeof res.payload === 'object' && res.payload !== null && '$id' in res.payload) {
          const isUpdated = res.events.some(e => e.includes("create"))
          if (isUpdated) fetchExercises()
        }
      }
    )

    return () => unsubscribe()
  }, [user?.id, fetchExercises])

  useEffect(() => {
    if (user && !loading) fetchExercises()
  }, [user, loading, fetchExercises])

  if (!loading && !user) {
    return (
      <div className="w-full h-[70vh] flex justify-center items-center">
        <NoData
          title="Login to Continue"
          message="Please login to view or create exercises."
        />
      </div>
    )
  }

  console.log(fetching, loading)

  return (
    <Command>
      <div className="flex p-4">
        <CommandInput className="max-w-96" placeholder="Search for exercise..." />
        <Dialog>
          <DialogTrigger className="ml-2 cursor-pointer bg-primary rounded-md p-2 h-9 w-9" asChild>
            <Plus />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Exercise</DialogTitle>
              <DialogDescription>Level up your physique!</DialogDescription>
            </DialogHeader>
            <Separator />
            <ExerciseAddForm />
          </DialogContent>
        </Dialog>
      </div>
      <CommandList className="p-4">
        <CommandGroup>
          {fetching || loading ? (
            <div className="flex flex-wrap gap-4">
              {[...Array(1)].map((_, i) => (
                <SkeletonExerciseCard key={i} />
              ))}
            </div>
          ) : exercise && exercise.length === 0 ? (
            <div className="w-full h-[70vh] flex justify-center items-center">
              <NoData
                title="No Exercises Found"
                message="Start your fitness journey by adding your first exercise!"
              />
            </div>
          ) : (
            <>
              <CommandEmpty>No results found!</CommandEmpty>
              <div className="flex flex-wrap gap-4">
                {exercise?.map((item) => (
                  <Link key={item.$id} href={`/exercise/${item.$id}`}>
                    <div className="w-full sm:w-[240px]">
                      <CommandItem className="border rounded-md w-full">
                        <Card className="sm:gap-4 dark:hover:bg-black/50">
                          <CardHeader>
                            <CardTitle>{item.name}</CardTitle>
                          </CardHeader>
                          <Separator />
                          <CardContent className="flex flex-col gap-1">
                            <span>Last Activity:</span>
                            <span className="text-primary">13 x 15 x 18 Reps</span>
                            <span className="text-xs text-slate-600">21-2-2034</span>
                          </CardContent>
                        </Card>
                      </CommandItem>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </CommandGroup>
      </CommandList>
    </Command>
  )

}

export default ExCards
