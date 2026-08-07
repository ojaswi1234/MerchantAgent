import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' | 'ghost' | 'secondary' }>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-base font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:pointer-events-none disabled:opacity-50 h-12 px-6 py-2",
          "border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] active:translate-y-1 active:translate-x-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] dark:active:shadow-[0px_0px_0px_0px_rgba(255,255,255,1)]",
          {
            "bg-[#3B82F6] text-white": variant === 'default',
            "bg-[#FFE66D] text-black": variant === 'secondary',
            "bg-white text-black dark:bg-[#252830] dark:text-white": variant === 'outline',
            "bg-transparent border-transparent shadow-none hover:shadow-none hover:-translate-y-0 active:translate-y-0 active:translate-x-0 dark:shadow-none dark:hover:shadow-none dark:active:shadow-none hover:bg-black/5 dark:hover:bg-white/10": variant === 'ghost',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-2xl border-2 border-black bg-white text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:bg-[#252830] dark:text-white overflow-hidden", className)} {...props} />
));
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6 border-b-2 border-black bg-[#FAF7F2] dark:bg-[#2F333D]", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("font-bold text-2xl leading-none tracking-tight", className)} {...props} />
));
CardTitle.displayName = "CardTitle";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const Badge = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("inline-flex items-center rounded-full border-2 border-black px-3 py-1 text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]", className)} {...props} />
));
Badge.displayName = "Badge";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex min-h-[80px] w-full rounded-xl border-2 border-black bg-white px-4 py-3 text-base font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-gray-400 placeholder:font-bold focus-visible:outline-none focus-visible:ring-0 focus-visible:border-[#3B82F6] dark:bg-[#252830] dark:text-white disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
      className
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    className={cn(
      "flex h-12 w-full rounded-xl border-2 border-black bg-white px-4 py-2 text-base font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-gray-400 placeholder:font-bold focus-visible:outline-none focus-visible:ring-0 focus-visible:border-[#3B82F6] dark:bg-[#252830] dark:text-white disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
      className
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";
