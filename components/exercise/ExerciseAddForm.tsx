'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage } 
from "../ui/form"
import { Input } from "../ui/input"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Separator } from "../ui/separator"
import { Button } from "../ui/button"
import { useEffect } from "react"
import { toast } from "sonner"
import axios from "axios"
import { DialogClose } from "../ui/dialog"
import { useAuth } from "@/context/AuthContext"

const formSchema = z
  .object({
    name: z.string().min(1, "Exercise name is required!"),
    sets: z.coerce.number().min(1, "At least 1 set is required!"),
    type: z.enum(["reps", "duration"]),
    reps: z.coerce.number(),
    duration: z.coerce.number(),
    durationUnit: z.string(),
  })
  .refine(
    (data) => data.type === "reps" ? data.reps > 0 : true,
    { message: "Reps must be greater than 0", path: ["reps"] }
  )
  .refine(
    (data) => data.type === "duration" ? data.duration > 0 : true,
    { message: "Duration must be greater than 0", path: ["duration"] }
  )

function ExerciseAddForm() {
  // const [ loading, setLoading ] = useState(false)
  const { user } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      sets: 0,
      type: "reps",
      reps: 0,
      duration: 0,
      durationUnit: 'sec'
    }
  })

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "type") {
        if (value.type === "reps") {
          form.setValue("duration", 0)
        } else {
          form.setValue("reps", 0)
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values)
    try {
      // setLoading(true)
      const res = await axios.post('/api/exercise', { userId: user?.id, ...values })
      if(res.status === 201) {
        console.log(res.data)
        toast.success("Exercise created successfully!")
      }
    } catch (error) {
      console.log(error)
      toast.error("Exercise not created!")
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>

        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exercise Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter exercise name...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='sets'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Sets</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  placeholder='Enter number of sets...'
                  {...field}
                  className='max-w-32'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='type'
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormLabel>Choose exercise type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className='w-fit flex gap-6 border rounded-md p-4 bg-transparent dark:bg-input/30'
                >
                  <FormItem className='flex items-center'>
                    <FormControl>
                      <RadioGroupItem value='reps' />
                    </FormControl>
                    <FormLabel>Reps</FormLabel>
                  </FormItem>
                  <FormItem className='flex items-center'>
                    <FormControl>
                      <RadioGroupItem value='duration' />
                    </FormControl>
                    <FormLabel>Duration</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("type") === 'reps'
          ? (
            <FormField
              control={form.control}
              name="reps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter the number of reps for each set</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Enter number of reps...'
                      {...field}
                      className='max-w-32'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter the time durtion</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Enter duration...'
                        {...field}
                        className='max-w-32'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='durationUnit'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel>Choose time unit</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className='w-fit gap-3 border rounded-md p-4 bg-transparent dark:bg-input/30'
                      >
                        <FormItem className='flex items-center'>
                          <FormControl>
                            <RadioGroupItem value='sec' />
                          </FormControl>
                          <FormLabel>Seconds</FormLabel>
                        </FormItem>
                        <FormItem className='flex items-center'>
                          <FormControl>
                            <RadioGroupItem value='min' />
                          </FormControl>
                          <FormLabel>Minute</FormLabel>
                        </FormItem>
                        <FormItem className='flex items-center'>
                          <FormControl>
                            <RadioGroupItem value='hour' />
                          </FormControl>
                          <FormLabel>Hours</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        <Separator />
        <div className='flex justify-center'>
          <DialogClose>
            <Button type='submit' className="cursor-pointer">Add</Button>
          </DialogClose>
        </div>
      </form>
    </Form>
  )
}

export default ExerciseAddForm