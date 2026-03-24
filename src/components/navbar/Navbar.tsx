import { useState, useEffect } from "react";
import { Menu, Bell, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import Logo from "../../assets/Logo.png";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const studentName = currentUser?.name || currentUser?.firstName
    ? `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim()
    : "Student";
  const studentClass = currentUser?.class?.name || currentUser?.className || "";

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <header
      className="bg-surface border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm w-full"
      style={{
        height: "90px",
        borderBottomWidth: "1px",
        opacity: 1
      }}
    >
      {/* Left: Logo + Menu button */}
      <div className="flex items-center ml-4 sm:ml-8 md:ml-[50px]">
        {/* Logo */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center overflow-hidden">
          <img src={Logo} alt="NMS Logo" className="w-full h-full object-cover" />
        </div>
        {/* Hamburger Menu - 100px gap from logo */}
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 rounded-lg transition ml-6 sm:ml-12 md:ml-[100px]"
        >
          <Menu size={24} className="text-gray-700" />
        </button>
      </div>

      {/* Right: Notifications + Profile */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Bell size={20} className="text-gray-600" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-3 z-50">
              <p className="px-4 pb-2 text-sm font-semibold text-gray-700 border-b">Notifications</p>
              <p className="px-4 py-6 text-sm text-gray-400 text-center">No notifications yet</p>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition"
          >
            <div className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-semibold">
              {studentName.charAt(0)}
            </div>
            <div className="hidden md:block text-left">
              <p
                className="text-gray-800"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "14px",
                  lineHeight: "151%",
                  letterSpacing: "0%"
                }}
              >
                {studentName}
              </p>
              <p
                className="text-gray-500"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "14px",
                  lineHeight: "151%",
                  letterSpacing: "0%"
                }}
              >
                {studentClass}
              </p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate("/profile");
                }}
                style={{ color: "#000" }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#13A541";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#000";
                }}
              >
                <Settings size={18} />
                <span>Profile Setting</span>
              </button>
              <button
                onClick={handleLogout}
                style={{ color: "#000" }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#13A541";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#000";
                }}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
