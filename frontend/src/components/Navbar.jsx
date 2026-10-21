import { useEffect, useState } from "react";
import { Bookmark, BriefcaseBusiness, ChevronDown, Code2, ListChecks, LogOut, ShieldPlus, UserRound } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import LogoutButton from "./LogoutButton";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const authUser = useAuthStore((state) => state.authUser);
  const [imageFailed, setImageFailed] = useState(false);
  const imageUrl = authUser?.image?.trim();

  useEffect(() => setImageFailed(false), [imageUrl]);

  const initials = authUser?.name
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const navClass = ({ isActive }) =>
    `inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-primary/10 text-primary"
        : "text-base-content/65 hover:bg-base-200 hover:text-base-content"
    }`;

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-base-content/10 bg-base-100/85 px-3 py-2.5 shadow-lg shadow-black/5 backdrop-blur-xl sm:px-5">
        <div className="flex items-center gap-5 lg:gap-10">
          <Link to="/" className="group flex shrink-0 items-center gap-2.5 rounded-xl">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-content shadow-md shadow-primary/20 transition group-hover:rotate-[-4deg] group-hover:scale-105">
              <Code2 className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold tracking-tight sm:text-xl">Leet<span className="text-primary">Lab</span></span>
          </Link>

          <div className="flex items-center gap-1">
            <NavLink to="/" end className={navClass}><ListChecks className="h-4 w-4" /><span className="hidden sm:inline">Problems</span></NavLink>
            <NavLink to="/playlists" className={navClass}><Bookmark className="h-4 w-4" /><span className="hidden sm:inline">Playlists</span></NavLink>
            <NavLink to="/company-prep" className={navClass}><BriefcaseBusiness className="h-4 w-4" /><span className="hidden sm:inline">Company Prep</span></NavLink>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="dropdown dropdown-end">
            <button type="button" tabIndex={0} className="btn btn-ghost h-auto min-h-0 gap-2 rounded-xl px-2 py-1.5 hover:bg-base-200 sm:px-3" aria-label="Open account menu">
              <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary/15 text-sm font-bold text-primary ring-2 ring-base-100">
                {imageUrl && !imageFailed ? (
                  <img src={imageUrl} alt="" className="h-full w-full object-cover" onError={() => setImageFailed(true)} />
                ) : initials || <UserRound className="h-4 w-4" />}
              </span>
              <span className="hidden max-w-28 truncate text-sm font-semibold sm:block">{authUser?.name || "Account"}</span>
              <ChevronDown className="hidden h-4 w-4 text-base-content/45 sm:block" />
            </button>
            <ul tabIndex={0} className="menu dropdown-content z-[60] mt-3 w-60 rounded-2xl border border-base-300 bg-base-100 p-2 shadow-2xl shadow-black/20">
              <li className="pointer-events-none mb-1 px-3 py-2">
                <span className="block truncate text-sm font-semibold text-base-content">{authUser?.name || "LeetLab user"}</span>
                <span className="block truncate text-xs text-base-content/50">{authUser?.email}</span>
              </li>
              <div className="my-1 h-px bg-base-300" />
              <li><Link to="/profile"><UserRound className="h-4 w-4" />My Profile</Link></li>
              <li><Link to="/playlists"><Bookmark className="h-4 w-4" />My Playlists</Link></li>
              {authUser?.role === "ADMIN" && <li><Link to="/add-problem"><ShieldPlus className="h-4 w-4" />Add Problem</Link></li>}
              <li><LogoutButton className="w-full"><LogOut className="h-4 w-4" />Log out</LogoutButton></li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
