"use client";

import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";

function Page() {
  return (
    <div className="min-h-screen flex justify-center items-center p-4">
      <div className="w-full max-w-96 flex flex-col">
        {/* Button to open modal */}
        <button
          className="self-end btn btn-primary"
          onClick={() => {
            const el = document.getElementById("add_todo_modal");
            if (el instanceof HTMLDialogElement) el.showModal();
          }}
        >
          Add New Todo
        </button>

        {/* List of all todos */}
        <TodoList />
      </div>

      {/* Invisible Modal to add todo  */}
      <TodoForm />
    </div>
  );
}

export default Page;
