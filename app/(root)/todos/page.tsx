// page.tsx

"use client";

import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";

function Page() {
  return (
    <div className="p-4">
      <div className="flex flex-col items-center gap-4 rounded-xl max-w-sm p-4 md:p-8 bg-accent">
        <TodoForm />
        <TodoList />
      </div>
    </div>
  );
}

export default Page;
