interface BadgeProps {
  text: string;
  color?: string;
}

export default function Badge({ text, color = "bg-green-100 text-green-700" }: BadgeProps) {
  return (
    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${color}`}>
      {text}
    </span>
  );
}
