import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ShieldCheck, User, Zap } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { axiosInstance } from "../lib/axios";

const ProfilePage = () => {
  const authUser = useAuthStore((state) => state.authUser);
  const [imageFailed, setImageFailed] = useState(false);
  const [stats, setStats] = useState({ solved: 0, submissions: 0, accepted: 0 });
  const imageUrl = authUser?.image?.trim();

  useEffect(() => {
    setImageFailed(false);
  }, [imageUrl]);

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      const [solvedResult, submissionResult] = await Promise.allSettled([
        axiosInstance.get("/problems/get-solved-problems"),
        axiosInstance.get("/submission/get-all-submissions"),
      ]);

      if (!isMounted) return;

      const solvedProblems =
        solvedResult.status === "fulfilled"
          ? solvedResult.value.data.problelms || []
          : [];
      const submissions =
        submissionResult.status === "fulfilled"
          ? submissionResult.value.data.submissions || []
          : [];

      setStats({
        solved: solvedProblems.length,
        submissions: submissions.length,
        accepted: submissions.filter((submission) => submission.status === "Accepted").length,
      });
    };

    loadStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const initials = authUser?.name
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <main className="min-h-screen w-full px-1 py-8 sm:py-12">
      <section className="mx-auto max-w-5xl">
        <Link to="/" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-base-content/55 transition hover:text-primary">
          <ArrowLeft className="h-4 w-4" />
          Back to problems
        </Link>

        <div className="overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-xl shadow-black/5">
          <div className="relative h-32 bg-gradient-to-r from-primary/90 via-primary/65 to-secondary/80 sm:h-40">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.2),transparent_25rem)]" />
          </div>
          <div className="px-5 pb-8 sm:px-10">
            <div className="-mt-14 flex flex-col gap-5 sm:flex-row sm:items-end">
              <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-base-100 bg-primary/20 text-3xl font-bold text-primary">
                {imageUrl && !imageFailed ? (
                  <img
                    src={imageUrl}
                    alt={`${authUser?.name || "User"} avatar`}
                    className="h-full w-full object-cover"
                    onError={() => setImageFailed(true)}
                  />
                ) : (
                  initials || <User className="h-12 w-12" />
                )}
              </div>
              <div className="pb-2">
                <h1 className="text-3xl font-bold">{authUser?.name || "LeetLab user"}</h1>
                <p className="mt-1 text-base-content/60">Your LeetLab profile</p>
              </div>
              <span className="badge badge-primary mb-3 gap-1 sm:ml-auto">
                <ShieldCheck className="h-3.5 w-3.5" />
                {authUser?.role || "USER"}
              </span>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="stat rounded-2xl border border-base-300 bg-base-200/60">
                <div className="stat-title">Problems solved</div>
                <div className="stat-value text-primary">{stats.solved}</div>
                <div className="stat-desc">Unique problems completed</div>
              </div>
              <div className="stat rounded-2xl border border-base-300 bg-base-200/60">
                <div className="stat-title">Submissions</div>
                <div className="stat-value text-secondary">{stats.submissions}</div>
                <div className="stat-desc">Code runs recorded</div>
              </div>
              <div className="stat rounded-2xl border border-base-300 bg-base-200/60">
                <div className="stat-title">Accepted</div>
                <div className="stat-value text-success">{stats.accepted}</div>
                <div className="stat-desc flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Successful submissions
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                <Zap className="h-5 w-5 text-primary" />
                Account details
              </h2>
              <div className="divide-y divide-base-300 overflow-hidden rounded-2xl border border-base-300 bg-base-200/30">
                <div className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-base-content/60">Name</span>
                  <span className="font-medium">{authUser?.name || "Not provided"}</span>
                </div>
                <div className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-base-content/60">Email</span>
                  <span className="font-medium">{authUser?.email || "Not available"}</span>
                </div>
                <div className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-base-content/60">Role</span>
                  <span className="font-medium">{authUser?.role || "USER"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProfilePage;
