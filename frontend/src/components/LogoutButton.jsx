import react from "react"
import { useAuthStore } from "../store/useAuthStore.js";

const LogoutButton = ({ children, className = "" })=>{
    const {logout} = useAuthStore()
    const onLogout = async()=>{
        await logout();
    }

    return(
        <button className={`btn btn-ghost justify-start font-medium ${className}`} onClick={onLogout}>
            {children}
        </button>
    )
}

export default LogoutButton



















