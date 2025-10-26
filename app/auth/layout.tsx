import ThemeController from "@/components/theme-controller";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div
        className="tooltip tooltip-left absolute top-4 right-4"
        data-tip="Change theme"
      >
        <ThemeController />
      </div>
      {children}
    </div>
  );
}

export default layout;
