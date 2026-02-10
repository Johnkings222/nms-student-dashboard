import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

export default function Button({ variant = "primary", className, ...props }: ButtonProps) {
  const base = "px-4 py-2 rounded-md font-medium transition-colors";
  const variants = {
    primary: "bg-green-600 hover:bg-green-700 text-white",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
    danger: "bg-red-500 hover:bg-red-600 text-white",
  };

  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
