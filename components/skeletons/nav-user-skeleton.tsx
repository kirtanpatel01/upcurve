import { Skeleton } from "../ui/skeleton";

export function NavUserSkeleton() {
  return (
    <div className="flex items-center gap-1 px-4 py-2 w-full">
      <Skeleton className="h-7 w-9 rounded-full" />
      <div className="flex flex-col gap-1 w-full">
        <Skeleton className="h-2.5 w-3/4" />
        <Skeleton className="h-2.5 w-1/2" />
      </div>
    </div>
  )
}