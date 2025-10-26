"use client";

import addTodo from "../action";
import { useActionState, useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/utils/supabase/use-user";
import { useTodoById } from "../hooks/use-todo-by-id";

export default function TodoForm({
  edit,
  id,
  onClose,
}: {
  edit?: boolean;
  id?: number;
  onClose?: () => void;
}) {
  const queryClient = useQueryClient();
  const [state, formAction, isPending] = useActionState(addTodo, {
    fieldErrors: {},
    success: false,
    values: {
      title: "",
      desc: "",
      deadline: "",
      priority: "",
    },
  });

  const closeModal = useCallback(() => {
    const modal = document.getElementById(
      "add_todo_modal"
    ) as HTMLDialogElement;
    modal?.close();
    setTimeout(() => {
      onClose?.();
    }, 200);
  }, [onClose])

  const { user } = useUser();

  useEffect(() => {
    if (state.success) {
      queryClient.invalidateQueries({ queryKey: ["todos", user?.id] });
      setTimeout(closeModal, 200);
    }
  }, [state.success, user?.id, queryClient, closeModal]);

  const { data: todo, isLoading: todoLoading } = useTodoById(
    edit && id ? id : undefined
  );

  const [formValues, setFormValues] = useState({
    title: "",
    desc: "",
    deadline: "",
    priority: "",
  });

  useEffect(() => {
    if (edit && todo) {
      setFormValues({
        title: todo.title || "",
        desc: todo.desc || "",
        deadline: todo.deadline || "",
        priority: todo.priority || "",
      });
    } else if (!edit) {
      setFormValues({
        title: "",
        desc: "",
        deadline: "",
        priority: "",
      });
    }
  }, [todo, edit]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <dialog id="add_todo_modal" className="modal">
      <div className="modal-box max-w-96 space-y-4">
        {edit && todoLoading ? (
          <div className="w-full flex flex-col items-center justify-center py-12">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-sm mt-3 text-gray-500">
              Loading todo details...
            </p>
          </div>
        ) : (
          <>
            <h3 className="font-bold text-lg">
              {edit ? "Edit Todo" : "Add New Todo"}
            </h3>
            <form action={formAction} className="flex flex-col gap-3">
              {/* Title */}
              <label
                className={clsx("flex flex-col gap-1", {
                  "text-red-500": state.fieldErrors?.title,
                })}
              >
                <span className="text-xs ml-1">
                  Title <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  name="title"
                  placeholder={
                    state.fieldErrors?.title
                      ? "Title is required"
                      : "Enter todo title"
                  }
                  defaultValue={formValues?.title || state.values.title}
                  className={clsx(
                    "input input-bordered",
                    state.fieldErrors?.title &&
                      "input-error placeholder-red-400/75"
                  )}
                />
                {state.fieldErrors?.title && (
                  <span className="text-xs text-red-500 ml-1 animate-pulse">
                    {state.fieldErrors.title}
                  </span>
                )}
              </label>

              {/* Description */}
              <label className="flex flex-col gap-1">
                <span className="text-xs ml-1">Description</span>
                <textarea
                  name="desc"
                  defaultValue={formValues?.desc || state.values.desc}
                  placeholder="Short description (optional)"
                  className="textarea textarea-bordered"
                />
              </label>

              {/* Deadline */}
              <label
                className={clsx("flex flex-col gap-1", {
                  "text-red-500": state.fieldErrors?.deadline,
                })}
              >
                <span className="text-xs ml-1">Deadline</span>
                <input
                  type="date"
                  name="deadline"
                  defaultValue={formValues?.deadline || state.values.deadline}
                  className={clsx(
                    "input input-bordered",
                    state.fieldErrors?.deadline && "input-error"
                  )}
                />
                {state.fieldErrors?.deadline && (
                  <span className="text-xs text-red-500 ml-1 animate-pulse">
                    {state.fieldErrors.deadline}
                  </span>
                )}
              </label>

              {/* Priority */}
              <label
                className={clsx("flex flex-col gap-1", {
                  "text-red-500": state.fieldErrors?.priority,
                })}
              >
                <span className="text-xs ml-1">
                  Priority <span className="text-red-500">*</span>
                </span>
                <select
                  name="priority"
                  value={formValues?.priority || state.values.priority}
                  onChange={handleChange}
                  className={clsx(
                    "select select-bordered",
                    state.fieldErrors?.priority && "select-error"
                  )}
                >
                  <option value="">Select priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                {state.fieldErrors?.priority && (
                  <span className="text-xs text-red-500 ml-1 animate-pulse">
                    {state.fieldErrors.priority}
                  </span>
                )}
              </label>

              {/* General or success messages */}
              {state.fieldErrors?.general && (
                <p className="text-sm text-red-500 ml-1 mt-1">
                  {state.fieldErrors.general}
                </p>
              )}
              {state.success && (
                <p className="text-sm text-green-500 mt-1 animate-fade-in">
                  ✅ Todo added successfully!
                </p>
              )}

              <div className="modal-action">
                <button type="button" onClick={closeModal} className="btn">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn btn-primary disabled:opacity-60"
                >
                  {isPending
                    ? edit
                      ? "Updating..."
                      : "Adding..."
                    : edit
                    ? "Update Todo"
                    : "Add Todo"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
}
