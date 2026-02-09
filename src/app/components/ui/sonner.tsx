"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";
import { useDarkMode } from "@/app/components/DarkModeContext";

const Toaster = ({ ...props }: ToasterProps) => {
  const { darkMode } = useDarkMode();
  const theme = darkMode ? "dark" : "light";

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
