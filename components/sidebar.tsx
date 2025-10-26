"use client";
import { Brain, ChartSpline, Dumbbell, Home, ListTodo } from "lucide-react";
import React from "react";
import Link from "next/link";
import SignoutBtn from "@/components/signout-btn";
import ThemeController from "./theme-controller";

function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="drawer md:drawer-open">
      {/* Drawer toggle (hidden on large screens) */}
      <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main content area */}
      <div className="drawer-content flex flex-col">
        {/* Button to open drawer on mobile */}
        <div className="p-2 md:hidden">
          <label
            htmlFor="sidebar-drawer"
            className="btn btn-ghost btn-circle drawer-button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 5.25h16.5M3.75 12h16.5m-16.5 6.75h16.5"
              />
            </svg>
          </label>
        </div>

        {/* Page content */}
        <div className="p-4">{children}</div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="sidebar-drawer" className="drawer-overlay"></label>

        <div className="min-h-full bg-base-200 flex flex-col">
          {/* Logo / Title */}
          <div className="flex items-center gap-2 px-4 py-3">
            <ChartSpline size={22} />
            <span className="text-lg font-semibold">Upcurve</span>
          </div>

          <div className="divider my-0" />

          {/* Nav Items */}
          <ul className="menu flex-1">
            <li>
              <Link href="/dashboard">
                <Home size={16} />
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/todos">
                <ListTodo size={16} />
                To-Do
              </Link>
            </li>
            <li>
              <Link href="/habits">
                <Brain size={16} />
                Habits
              </Link>
            </li>
            <li>
              <Link href="/exercise">
                <Dumbbell size={16} />
                Exercise
              </Link>
            </li>

            <div className="divider my-0" />

            <li>
              <ThemeController />
            </li>
            <li className="hover:bg-red-500 text-red-600 hover:text-red-50 rounded-lg transition-all duration-300">
              <SignoutBtn />
            </li>
          </ul>

        </div>
      </div>
    </div>
  );
}

export default Sidebar;
