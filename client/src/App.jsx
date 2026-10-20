import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import Login from "./lib/pages/Login";
import OauthVerify from "./lib/pages/OauthVerify";
import Home from "./lib/pages/Home";
import Profile from "./lib/pages/Profile";
import Logs from "./lib/pages/Logs";
import Admin from "./lib/pages/Admin";
import DashboardLayout from "./components/common/DashboardLayout";
import LandingPage from "./pages/landing/LandingPage";
import SolutionsPage from "./pages/landing/SolutionsPage";
import PrivacyPage from "./pages/landing/PrivacyPage";
import TermsPage from "./pages/landing/TermsPage";

const App = () => {
  return (
    <div>
      <Toaster
        position="bottom-right"
        richColors
        closeButton={false}
        duration={3500}
        toastOptions={{
          classNames: {
            toast: "select-none",
          },
        }}
      />
      <Routes>
        {/* Public Landing & Marketing */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/solutions" element={<SolutionsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/oauth-success" element={<OauthVerify />} />

        {/* App Dashboard */}
        <Route element={<DashboardLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/admin" element={<Admin />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
