import { useAuthStore } from "../store/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";
import { LoaderCircle } from "lucide-react";

const AdminRoute = () => {
    const {authUser , isCheckingAuth} = useAuthStore();

    if(isCheckingAuth){
        return <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-base-200 text-base-content">
            <LoaderCircle className="size-8 animate-spin text-primary"/>
            <p className="text-sm text-base-content/60">Checking access…</p>
        </div>
    }
    if (!authUser || authUser.role !== "ADMIN") return <Navigate to="/" replace />;

  return <Outlet/>
}

export default AdminRoute
