import { Card, CardContent, CardHeader } from "../ui/card";
import { CommandItem } from "../ui/command";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

export function SkeletonExerciseCard({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-wrap gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="w-full sm:w-[240px]">
          <CommandItem className="border rounded-md w-full">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <Separator />
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
              </CardContent>
            </Card>
          </CommandItem>
        </div>
      ))}
    </div>
  )
}