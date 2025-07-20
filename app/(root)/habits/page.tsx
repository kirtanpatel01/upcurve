import HabitBox from "@/components/habits/habit-box"
import HabitChart from "@/components/habits/habit-chart"

function Page() {
  return (
    <div className='p-4 sm:p-6 min-h-[calc(100vh-10rem)] w-full flex flex-col xl:flex-row justify-evenly items-center gap-6'>
      <HabitBox />
      <HabitChart />
    </div>
  )
}

export default Page
