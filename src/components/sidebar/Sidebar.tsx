import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  BookOpen,
  MessageSquare,
  Video,
  FileCheck,
  ClipboardCheck,
  BarChart3,
  X,
} from "lucide-react";

interface SidebarProps {
  closeSidebar?: () => void;
}

const menuItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/rules", label: "Rules and Regulation", icon: FileCheck },
  { path: "/assignment", label: "Assignment", icon: FileText },
  { path: "/timetable", label: "Time Table", icon: Calendar },
  { path: "/message", label: "Message", icon: MessageSquare },
  { path: "/live-class", label: "Live Class", icon: Video },
  { path: "/exam", label: "Exam", icon: BookOpen },
  { path: "/class-test", label: "Class Test", icon: ClipboardCheck },
  { path: "/report", label: "Report", icon: BarChart3 },
];

export default function Sidebar({ closeSidebar }: SidebarProps) {
  const location = useLocation();

  return (
    <div
      className="flex flex-col h-full"
      style={{
        backgroundColor: "#F2F2F2",
        borderRight: "1px solid #D9D9D9",
        opacity: 1
      }}
    >
      {/* Mobile close button */}
      {closeSidebar && (
        <div className="flex justify-end p-4 md:hidden">
          <button
            onClick={closeSidebar}
            className="text-gray-700 hover:bg-gray-200 p-2 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>
      )}

      {/* Logo Section - Removed */}

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6 ml-[50px]">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
              style={{
                backgroundColor: isActive ? "#13A541" : "transparent",
                color: isActive ? "#ffffff" : "#374151"
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.setProperty("background-color", "#13A541", "important");
                  e.currentTarget.style.setProperty("color", "#ffffff", "important");
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.setProperty("background-color", "transparent", "important");
                  e.currentTarget.style.setProperty("color", "#374151", "important");
                }
              }}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
}
