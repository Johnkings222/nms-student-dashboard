import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import RulesAndRegulations from "../pages/RulesAndRegulations/RulesAndRegulations";
import AssignmentPage from "../pages/Assignment/AssignmentPage";
import TimeTable from "../pages/TimeTable/TimeTable";
import UpdateProfile from "../pages/Profile/UpdateProfile";
import Login from "../pages/Auth/Login";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import Verify from "../pages/Auth/Verify";
import Messaging from "../pages/Messaging/Messaging";
import LiveClass from "../pages/LiveClass/LiveClass";
import Exams from "../pages/Exams/Exams";
import ClassTest from "../pages/ClassTest/ClassTest";
import ReportCard from "../pages/ReportCard/ReportCard";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify" element={<Verify />} />

        {/* Dashboard routes */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />

          {/* Rules and Regulations */}
          <Route path="/rules" element={<RulesAndRegulations />} />
          <Route path="/assignment" element={<AssignmentPage />} />
          <Route path="/timetable" element={<TimeTable />} />
          <Route path="/message" element={<Messaging />} />
          <Route path="/live-class" element={<LiveClass />} />
          <Route path="/exam" element={<Exams />} />
          <Route path="/class-test" element={<ClassTest />} />
          <Route path="/report" element={<ReportCard />} />
          <Route path="/profile" element={<UpdateProfile />} />
          <Route path="/settings" element={<UpdateProfile />} />
        </Route>

        {/* Redirect unknown routes to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
