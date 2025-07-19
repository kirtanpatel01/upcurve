import HabitBox from "@/components/habits/habit-box"
import HabitChart from "@/components/habits/habit-chart"
import { Separator } from "@/components/ui/separator"

function Page() {
  return (
    <div className='p-4 sm:p-6 min-h-[calc(100vh-10rem)] w-full flex flex-col xl:flex-row justify-evenly items-center gap-6'>
      <HabitBox />
      <Separator orientation="vertical" className="hidden xl:visible"  />
      <HabitChart />
    </div>
  )
}

export default Page
