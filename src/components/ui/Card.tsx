import type { ReactNode, ReactElement } from "react";

interface CardProps {
  title?: string;
  subtitle?: string;
  value?: string | number;
  color?: string; // tailwind classes for background (can be gradient)
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export default function Card({
  title,
  subtitle,
  value,
  color = "bg-white",
  icon,
  className,
  children,
}: CardProps): ReactElement {
  // simple heuristic: if color contains bg- or from- assume dark background
  const darkBg = /bg-|from-|to-/.test(color);
  const textColor = darkBg ? "text-white" : "text-gray-800";

  return (
    <div className={`relative rounded-xl p-5 shadow-soft flex flex-col justify-between ${color} ${className || ""}`} style={{minHeight: 160}}>
      {/* Title top left */}
      {title && (
        <h3 className={`text-sm font-semibold ${textColor} absolute left-5 top-4`}>{title}</h3>
      )}

      {/* Center row: icon left, value right */}
      <div className="flex flex-1 items-center justify-between w-full">
        {icon && (
          <span className="p-2 rounded-md bg-white/20 flex items-center justify-center">
            {icon}
          </span>
        )}
        {value !== undefined && (
          <div className={`text-3xl font-bold ml-4 ${textColor}`}>{value}</div>
        )}
      </div>

      {/* Subtitle bottom left */}
      {subtitle && (
        <p className={`text-xs opacity-80 ${textColor} absolute left-5 bottom-3`}>{subtitle}</p>
      )}

      {children}
    </div>
  );
}
