import { useEffect, useState } from "react";
import LoadingImg from "../../assets/loading.png";

export default function LoadingState() {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev === "..." ? "." : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-24">
      <img src={LoadingImg} alt="Loading" className="w-32 h-32 object-contain" />
      <p className="mt-4 text-gray-500 text-sm font-medium">Loading{dots}</p>
    </div>
  );
}
