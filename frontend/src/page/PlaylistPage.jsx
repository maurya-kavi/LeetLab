import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Bookmark,
  BookOpen,
  CalendarDays,
  CirclePlus,
  ListChecks,
  Trash2,
} from "lucide-react";
import { usePlaylistStore } from "../store/usePlaylistStore";
import CreatePlaylistModel from "../components/CreatePlaylistModel";

const PlaylistPage = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const {
    playlists,
    currentPlaylist,
    isLoading,
    getAllPlaylists,
    getPlaylistDetails,
    createPlaylist,
    removeProblemFromPlaylist,
    deletePlaylist,
  } = usePlaylistStore();

  useEffect(() => {
    if (playlistId) getPlaylistDetails(playlistId);
    else getAllPlaylists();
  }, [playlistId, getAllPlaylists, getPlaylistDetails]);

  const handleDeletePlaylist = async (id) => {
    await deletePlaylist(id);
    if (playlistId === id) navigate("/playlists");
  };

  const handleCreatePlaylist = async (data) => {
    await createPlaylist(data);
    setIsCreateOpen(false);
  };

  if (isLoading && (playlistId ? !currentPlaylist : playlists.length === 0)) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </main>
    );
  }

  if (playlistId) {
    if (!currentPlaylist || currentPlaylist.id !== playlistId) {
      return (
        <main className="mx-auto min-h-[70vh] max-w-6xl px-4 py-10">
          <Link className="btn btn-ghost mb-6 gap-2" to="/playlists">
            <ArrowLeft className="h-4 w-4" /> My Playlists
          </Link>
          <div className="rounded-2xl border border-base-300 bg-base-100 p-10 text-center shadow-sm">
            <h1 className="text-2xl font-bold">Playlist not found</h1>
            <p className="mt-2 text-base-content/60">It may have been removed or you may not have access to it.</p>
          </div>
        </main>
      );
    }

    const entries = currentPlaylist.problems || [];
    return (
      <main className="min-h-screen bg-base-200/60 px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-6xl">
          <Link className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-base-content/60 transition hover:text-primary" to="/playlists">
            <ArrowLeft className="h-4 w-4" /> All playlists
          </Link>

          <section className="overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm">
            <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent" />
            <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-9">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Bookmark className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Problem collection</p>
                  <h1 className="mt-1 break-words text-3xl font-bold tracking-tight sm:text-4xl">{currentPlaylist.name}</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-base-content/65">{currentPlaylist.description || "A personal collection of problems to practice."}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="badge badge-lg gap-2 border-base-300 bg-base-200/70"><ListChecks className="h-4 w-4" /> {entries.length} {entries.length === 1 ? "problem" : "problems"}</span>
                    <span className="badge badge-lg gap-2 border-base-300 bg-base-200/70"><CalendarDays className="h-4 w-4" /> Created {new Date(currentPlaylist.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm self-start text-error hover:bg-error/10 sm:self-center" onClick={() => handleDeletePlaylist(currentPlaylist.id)}>
                <Trash2 className="h-4 w-4" /> Delete playlist
              </button>
            </div>
          </section>

          <section className="mt-8">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Saved problems</h2>
                <p className="mt-1 text-sm text-base-content/60">Open a problem to continue practicing.</p>
              </div>
            </div>
            {entries.length ? (
              <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead><tr className="border-b border-base-300 text-xs uppercase tracking-wide text-base-content/50"><th className="py-4">Problem</th><th>Difficulty</th><th className="hidden sm:table-cell">Added</th><th className="w-16" /></tr></thead>
                    <tbody>
                      {entries.map(({ id, problem, createdAt }, index) => (
                        <tr key={id} className="border-b border-base-200 last:border-0 hover:bg-base-200/50">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-base-200 text-xs font-semibold text-base-content/50">{String(index + 1).padStart(2, "0")}</span>
                              <Link className="font-semibold transition hover:text-primary" to={`/problem/${problem.id}`}>
                                {problem.problemNumber ? <span className="mr-2 text-base-content/45">#{problem.problemNumber}</span> : null}{problem.title}
                              </Link>
                            </div>
                          </td>
                          <td><span className={`badge badge-sm ${problem.difficulty === "EASY" ? "badge-success badge-outline" : problem.difficulty === "MEDIUM" ? "badge-warning badge-outline" : "badge-error badge-outline"}`}>{problem.difficulty}</span></td>
                          <td className="hidden text-sm text-base-content/55 sm:table-cell">{new Date(createdAt || currentPlaylist.createdAt).toLocaleDateString()}</td>
                          <td><button className="btn btn-ghost btn-sm btn-square text-base-content/45 hover:text-error" aria-label={`Remove ${problem.title} from playlist`} title="Remove from playlist" onClick={() => removeProblemFromPlaylist(currentPlaylist.id, [problem.id])}><Trash2 className="h-4 w-4" /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 px-6 py-14 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><BookOpen className="h-7 w-7" /></div>
                <h3 className="mt-4 text-lg font-semibold">Nothing saved here yet</h3>
                <p className="mx-auto mt-1 max-w-md text-sm text-base-content/60">Add problems from the problem list using “Save to Playlist”.</p>
                <Link className="btn btn-primary btn-sm mt-5" to="/">Browse problems <ArrowUpRight className="h-4 w-4" /></Link>
              </div>
            )}
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base-200/60 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link to="/" className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-base-content/55 transition hover:text-primary"><ArrowLeft className="h-4 w-4" /> Problems</Link>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Your workspace</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">My Playlists</h1>
            <p className="mt-2 text-base-content/60">Keep problems organized into focused practice lists.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="btn btn-ghost pointer-events-none gap-2"><ListChecks className="h-4 w-4 text-primary" /> {playlists.length} {playlists.length === 1 ? "playlist" : "playlists"}</span>
            <button className="btn btn-primary gap-2" onClick={() => setIsCreateOpen(true)}><CirclePlus className="h-4 w-4" /> Create playlist</button>
          </div>
        </div>

        {playlists.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {playlists.map((playlist, index) => {
              const problems = playlist.problems || [];
              return (
                <article key={playlist.id} className="group overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                  <div className={`h-1.5 ${index % 3 === 0 ? "bg-primary" : index % 3 === 1 ? "bg-secondary" : "bg-accent"}`} />
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Bookmark className="h-5 w-5" /></div>
                      <button className="btn btn-ghost btn-sm btn-square text-base-content/40 hover:text-error" aria-label={`Delete ${playlist.name}`} title="Delete playlist" onClick={() => handleDeletePlaylist(playlist.id)}><Trash2 className="h-4 w-4" /></button>
                    </div>
                    <Link className="mt-5 block text-xl font-bold transition group-hover:text-primary" to={`/playlists/${playlist.id}`}>{playlist.name}</Link>
                    <p className="mt-2 min-h-10 text-sm leading-5 text-base-content/60">{playlist.description || "A personal collection of problems to practice."}</p>
                    <div className="mt-5 border-t border-base-200 pt-4">
                      <div className="flex items-center justify-between text-xs font-medium text-base-content/55">
                        <span>{problems.length} {problems.length === 1 ? "problem" : "problems"}</span>
                        <span>Created {new Date(playlist.createdAt).toLocaleDateString()}</span>
                      </div>
                      {problems.length ? (
                        <div className="mt-3 space-y-2">
                          {problems.slice(0, 2).map(({ id, problem }) => <Link key={id} className="block truncate text-sm text-base-content/75 hover:text-primary" to={`/problem/${problem.id}`}>{problem.title}</Link>)}
                          {problems.length > 2 && <p className="text-xs text-base-content/45">and {problems.length - 2} more</p>}
                        </div>
                      ) : <p className="mt-3 text-sm text-base-content/45">No problems added yet</p>}
                      <Link className="btn btn-ghost btn-sm mt-4 w-full justify-between px-0 text-primary hover:bg-primary/5" to={`/playlists/${playlist.id}`}>Open playlist <ArrowUpRight className="h-4 w-4" /></Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-base-300 bg-base-100 px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Bookmark className="h-8 w-8" /></div>
            <h2 className="mt-5 text-xl font-bold">Start your first playlist</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-base-content/60">Create a collection for interview prep, a topic, or problems you want to revisit.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button className="btn btn-primary gap-2" onClick={() => setIsCreateOpen(true)}><CirclePlus className="h-4 w-4" /> Create playlist</button>
              <Link className="btn btn-ghost" to="/">Browse problems</Link>
            </div>
          </div>
        )}
      </div>
      <CreatePlaylistModel isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSubmit={handleCreatePlaylist} />
    </main>
  );
};

export default PlaylistPage;
