import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { parseISO, formatDistanceToNow, isPast } from "date-fns";
import { Timer } from "lucide-react";

export default function RemainingTime({ deadline }: { deadline: Date }) {
  const parsed = parseISO(deadline.toISOString());
  const past = isPast(parsed);
  const timeLeft = formatDistanceToNow(parsed, { addSuffix: true });

  return (
    <Tooltip>
      <TooltipTrigger
        className={`p-1 ${
          past ? "text-red-400" : ""
        }`}
      >
        <Timer size={14} />
      </TooltipTrigger>
      <TooltipContent>
        <p className={`text-xs ${past ? "text-red-400" : ""}`}>
          {past ? `Overdue (${timeLeft})` : `Due ${timeLeft}`}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
