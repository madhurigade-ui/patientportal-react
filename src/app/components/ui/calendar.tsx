"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "./utils";
import { buttonVariants } from "./button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      weekStartsOn={0}
      className={cn("p-4", className)}
      classNames={{
        root: "w-full",
        months: "flex flex-col sm:flex-row gap-4 justify-center",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center pt-1 relative items-center mb-4",
        caption_label: "text-base font-semibold text-gray-900 dark:text-white",
        nav: "flex items-center gap-1",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "absolute left-2 size-8 bg-transparent p-0 hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "absolute right-2 size-8 bg-transparent p-0 hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700"
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex justify-between mb-2",
        weekday: "text-gray-500 dark:text-gray-400 font-medium text-sm w-10 text-center",
        week: "flex justify-between mt-1",
        day: "p-0 text-center",
        day_button: cn(
          "inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium transition-colors",
          "hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        ),
        selected: "bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90",
        today: "bg-gray-100 dark:bg-gray-800 font-bold",
        outside: "text-gray-300 dark:text-gray-600",
        disabled: "text-gray-300 dark:text-gray-600 cursor-not-allowed",
        hidden: "invisible",
        range_start: "rounded-l-lg",
        range_end: "rounded-r-lg",
        range_middle: "bg-primary/10 dark:bg-primary/20",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === "left") {
            return <ChevronLeft className="size-4" />;
          }
          return <ChevronRight className="size-4" />;
        },
      }}
      {...props}
    />
  );
}

export { Calendar };
