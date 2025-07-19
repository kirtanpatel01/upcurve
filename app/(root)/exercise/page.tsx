import ExCards from '@/components/exercise/ExCards'
// import Graphchart from '@/components/exercise/Graphchart'
// import Hashmap from '@/components/exercise/Hashmap'
// import { Separator } from '@/components/ui/separator'

function page() {
  return (
    <div className='w-full min-h-[calc(100vh-3rem)]'>
      {/* <div className='grid grid-rows-[1fr_auto_1fr]'>
        <Hashmap />
        <Separator />
        <Graphchart />
      </div> */}
      {/* <Separator orientation='vertical' /> */}
      <ExCards />
    </div>
  )
}

export default page