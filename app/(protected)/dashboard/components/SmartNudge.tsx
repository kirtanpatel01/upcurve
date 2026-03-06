"use client";

interface SmartNudgeProps {
  userName: string;
  todoCount: number;
  habitCount: number;
}

export function SmartNudge({ userName, todoCount, habitCount }: SmartNudgeProps) {
  const hour = new Date().getHours();
  let greeting = "Good morning";
  if (hour >= 12 && hour < 17) greeting = "Good afternoon";
  if (hour >= 17) greeting = "Good evening";

  // Dynamic message based on counts
  let message = "Let's make today count.";
  if (todoCount > 5) message = `You've got ${todoCount} tasks on your plate today. One at a time.`;
  else if (todoCount === 0 && habitCount > 0) message = "All todos cleared! Focus on your habits now.";
  else if (habitCount === 0 && todoCount === 0) message = "Clean slate. What's the next big move?";

  return (
    <div className="space-y-1">
      <h1 className="text-xl font-bold tracking-tight text-foreground">
        {greeting}, {userName}.
      </h1>
      <p className="text-muted-foreground">
        {message}
      </p>
    </div>
  );
}
