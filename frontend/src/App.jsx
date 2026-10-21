import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import HomePage from "./page/HomePage";
import LoginPage from "./page/LoginPage";
import SignUpPage from "./page/SignUpPage";
import { useAuthStore } from "./store/useAuthStore";
import { LoaderCircle } from "lucide-react";
import Layout from "./layout/Layout";
import AddProblem from "./page/AddProblem";
import AdminRoute from "./components/AdminRoute";
import ProblemPage from "./page/ProblemPage";
import ProfilePage from "./page/ProfilePage";
import PlaylistPage from "./page/PlaylistPage";
import CompanyPrepPage from "./page/CompanyPrepPage";

const App = () => {

  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if(isCheckingAuth && !authUser) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-base-200 text-base-content">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><LoaderCircle className="h-7 w-7 animate-spin" /></span>
        <p className="text-sm font-medium text-base-content/60">Loading your workspace</p>
      </div>
    )
  }

  return (
    
    <div className="app-shell">
      <Toaster
        position="top-right"
        toastOptions={{
          className: "!rounded-xl !border !border-base-300 !bg-base-100 !text-base-content !shadow-xl",
          duration: 3200,
        }}
      />
      <div key={location.pathname} className="route-enter">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={authUser ? <HomePage /> : <Navigate to="/login" />} />
            <Route path="profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
            <Route path="playlists" element={authUser ? <PlaylistPage /> : <Navigate to="/login" />} />
            <Route path="playlists/:playlistId" element={authUser ? <PlaylistPage /> : <Navigate to="/login" />} />
            <Route path="company-prep" element={authUser ? <CompanyPrepPage /> : <Navigate to="/login" />} />
          </Route>
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/problem/:id" element={authUser ? <ProblemPage /> : <Navigate to="/login" />} />
          <Route element={<AdminRoute />}>
            <Route element={<Layout />}>
              <Route path="/add-problem" element={<AddProblem />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </div>
    
  )
}

export default App
