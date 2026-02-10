import { useState } from "react";
import type { ReactElement } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import Navbar from "../components/navbar/Navbar";

export default function DashboardLayout(): ReactElement {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background text-gray-900">
      {/* Top Navbar - Full Width */}
      <Navbar onMenuClick={() => setSidebarOpen(prev => !prev)} />

      <div className="flex">
        {/* Sidebar (controlled by hamburger) */}
        {sidebarOpen && (
          <>
            {/* Desktop Sidebar */}
            <aside
              className="hidden md:block min-h-[calc(100vh-64px)]"
              style={{ width: "350px" }}
            >
              <Sidebar />
            </aside>

            {/* Mobile Sidebar (overlay) */}
            <div
              className="fixed inset-0 z-50 bg-black/50 md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <aside
                className="absolute left-0 top-0 h-full shadow-lg"
                style={{ width: "350px" }}
                onClick={(e) => e.stopPropagation()}
              >
                <Sidebar closeSidebar={() => setSidebarOpen(false)} />
              </aside>
            </div>
          </>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 bg-gray-50 min-h-[calc(100vh-90px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
