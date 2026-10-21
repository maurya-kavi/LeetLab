import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Layout = () => {
  return (
    <div className="app-shell">
      <Navbar />
      <div className="mx-auto w-full max-w-[1600px] px-3 pb-12 sm:px-5 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
