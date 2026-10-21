import React, { useState, useMemo, useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import {
  Bookmark,
  PencilIcon,
  TrashIcon,
  Plus,
  Loader2,
  Search,
  ChevronDown,
  Building2,
  X,
} from "lucide-react";
import { useActions } from "../store/useAction";
import { usePlaylistStore } from "../store/usePlaylistStore";
import AddToPlaylist from "./AddToPlaylist";
import CreatePlaylistModel from "./CreatePlaylistModel";

const ProblemTable = ({ problems }) => {
  const { authUser } = useAuthStore();

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [selectedTag, setSelectedTags] = useState("ALL");
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [companySearch, setCompanySearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);
  const loadMoreRef = useRef(null);
  const [isCreateModelOpen, setIsCreateModelOpen] = useState(false);
  const [isAddToPlaylistModelOpen, setIsAddToPlaylistModelOpen] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState(null);

  const { createPlaylist } = usePlaylistStore();
  
  const { isDeletingProblem, onDeleteProblem } = useActions();

  const allTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];

    const tagsSet = new Set();
    problems.forEach((p) => p.tags?.forEach((t) => tagsSet.add(t)));

    return Array.from(tagsSet);
  }, [problems]);

  const allCompanies = useMemo(() => {
    const companyCounts = new Map();
    (problems || []).forEach((problem) => {
      [...new Set(problem.companies || [])].forEach((company) => {
        companyCounts.set(company, (companyCounts.get(company) || 0) + 1);
      });
    });
    return [...companyCounts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [problems]);

  const visibleCompanies = useMemo(() => {
    const query = companySearch.trim().toLowerCase();
    return query
      ? allCompanies.filter(({ name }) => name.toLowerCase().includes(query))
      : allCompanies;
  }, [allCompanies, companySearch]);

  const filteredProblems = useMemo(() => {
    return (problems || [])
      .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
      .filter((problem) =>
        difficulty === "ALL" ? true : problem.difficulty === difficulty
      )
      .filter((problem) =>
        selectedTag === "ALL" ? true : problem.tags?.includes(selectedTag)
      )
      .filter((problem) =>
        selectedCompanies.length === 0
          ? true
          : selectedCompanies.some((company) => problem.companies?.includes(company))
      );
  }, [problems, search, difficulty, selectedTag, selectedCompanies]);

  const visibleProblems = useMemo(
    () => filteredProblems.slice(0, visibleCount),
    [filteredProblems, visibleCount]
  );

  useEffect(() => {
    setVisibleCount(20);
  }, [search, difficulty, selectedTag, selectedCompanies]);

  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel || visibleCount >= filteredProblems.length) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisibleCount(filteredProblems.length);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((count) => Math.min(count + 20, filteredProblems.length));
        }
      },
      { rootMargin: "300px 0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [filteredProblems.length, visibleCount]);

  const difficulties = ["EASY", "MEDIUM", "HARD"];

  const handleDelete = (id) => {
    onDeleteProblem(id);
  };

  const handleAddToPlaylist = (problemId) => {
    setSelectedProblemId(problemId);
    setIsAddToPlaylistModelOpen(true)
  };

  const handleCreatePlaylist = async (data) => {
    await createPlaylist(data);
  };

  const toggleCompany = (company) => {
    setSelectedCompanies((current) =>
      current.includes(company)
        ? current.filter((item) => item !== company)
        : [...current, company]
    );
  };

  return (
    <div className="mx-auto mt-8 w-full max-w-7xl">
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">
      <main className="order-2 min-w-0 xl:order-1">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Problems</h2>
          <p className="mt-1 text-sm text-base-content/60">Choose a challenge or organize problems into a playlist.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/playlists" className="btn btn-outline btn-sm sm:btn-md gap-2"><Bookmark className="w-4 h-4" /> My Playlists</Link>
          <button className="btn btn-primary btn-sm sm:btn-md gap-2" onClick={() => setIsCreateModelOpen(true)}>
            <Plus className="w-4 h-4" />
            Create Playlist
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-base-300 bg-base-100 p-3 shadow-sm sm:flex-row sm:items-center">
        <label className="input input-bordered flex min-w-0 flex-1 items-center gap-2 bg-base-200/60">
          <Search className="h-4 w-4 text-base-content/45" />
          <input type="search" placeholder="Search problems" value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
        <select className="select select-bordered w-full bg-base-200/60 sm:w-48" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} aria-label="Filter by difficulty">
          <option value="ALL">All difficulties</option>
          {difficulties.map((diff) => <option key={diff} value={diff}>{diff.charAt(0) + diff.slice(1).toLowerCase()}</option>)}
        </select>
        <select className="select select-bordered w-full bg-base-200/60 sm:w-48" value={selectedTag} onChange={(e) => setSelectedTags(e.target.value)} aria-label="Filter by topic">
          <option value="ALL">All topics</option>
          {allTags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
        <div className="flex items-center justify-between border-b border-base-300 px-4 py-3">
          <p className="text-sm font-semibold">Problem library</p>
          <span className="text-xs text-base-content/50">{filteredProblems.length} {filteredProblems.length === 1 ? "problem" : "problems"}</span>
        </div>
        <div className="overflow-x-auto">
        <table className="table table-sm w-full text-sm text-base-content">
          <thead className="bg-base-200/60 text-xs uppercase tracking-wide text-base-content/50">
            <tr>
              <th className="w-16 px-3 py-2.5 text-center">Solved</th>
              <th className="w-24 px-3 py-2.5">Problem No.</th>
              <th className="min-w-52 px-3 py-2.5">Title</th>
              <th className="min-w-40 px-3 py-2.5">Topics</th>
              <th className="w-28 px-3 py-2.5">Difficulty</th>
              <th className="w-32 px-3 py-2.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleProblems.length > 0 ? (
              visibleProblems.map((problem) => {
                const isSolved = (problem.solvedBy || []).some(
                  (user) => user.userId === authUser?.id
                );
                return (
                  <tr key={problem.id} className="border-b border-base-200 transition-colors hover:bg-base-200/40">
                    <td className="px-3 py-2 text-center align-middle">
                      <input
                        type="checkbox"
                        checked={isSolved}
                        readOnly
                        className="checkbox checkbox-sm"
                      />
                    </td>
                    <td className="px-3 py-2 align-middle">
                      {problem.problemNumber ? (
                        <span className="badge badge-primary badge-sm min-w-8 font-semibold tabular-nums">{problem.problemNumber}</span>
                      ) : <span className="text-base-content/40">—</span>}
                    </td>
                    <td className="px-3 py-2 align-middle">
                      <Link
                        to={`/problem/${problem.id}`}
                        className="text-sm font-medium leading-5 hover:text-primary hover:underline"
                      >
                        {problem.title}
                      </Link>
                    </td>
                    <td className="px-3 py-2 align-middle">
                      <div className="flex flex-wrap items-center gap-1">
                        {(problem.tags || []).map((tag, idx) => (
                          <span
                            key={idx}
                            className="badge badge-outline badge-warning badge-sm h-5 px-1.5 text-[10px] font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-2 align-middle">
                      <span
                        className={`badge badge-sm whitespace-nowrap font-semibold text-xs text-white ${
                          problem.difficulty === "EASY"
                            ? "badge-success"
                            : problem.difficulty === "MEDIUM"
                            ? "badge-warning"
                            : "badge-error"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="px-3 py-2 align-middle">
                      <div className="flex items-center gap-1">
                        {authUser?.role === "ADMIN" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDelete(problem.id)}
                              className="btn btn-xs btn-ghost text-error"
                              aria-label={`Delete ${problem.title}`}
                            >
                              {isDeletingProblem ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <TrashIcon className="w-4 h-4 text-white" />
                              )}
                            </button>
                            <button disabled className="btn btn-xs btn-ghost" aria-label="Edit unavailable">
                              <PencilIcon className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        <button
                          className="btn btn-xs btn-ghost flex items-center gap-1 px-1 text-base-content/60 hover:text-primary"
                          onClick={() => handleAddToPlaylist(problem.id)}
                        >
                          <Bookmark className="w-4 h-4" />
                          <span className="hidden sm:inline">
                            Save to Playlist
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-base-content/55">
                  No problems match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      <div ref={loadMoreRef} className="flex min-h-16 items-center justify-center py-4" aria-live="polite">
        {visibleCount < filteredProblems.length ? (
          <span className="flex items-center gap-2 text-sm text-base-content/55">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading more problems
          </span>
        ) : filteredProblems.length > 0 ? (
          <span className="flex items-center gap-2 text-sm text-base-content/45">
            You have reached the end <ChevronDown className="h-4 w-4" />
          </span>
        ) : null}
      </div>
      <p className="pb-2 text-center text-xs text-base-content/45" aria-live="polite">
        {filteredProblems.length ? `Showing ${visibleProblems.length} of ${filteredProblems.length} problems` : "No results"}
      </p>
      </main>

      <aside className="order-1 self-start rounded-2xl border border-base-300 bg-base-100 p-3 shadow-sm xl:sticky xl:top-24 xl:order-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 text-base font-bold">
              <Building2 className="h-4 w-4 text-primary" /> Companies
            </h3>
            <p className="mt-1 text-xs text-base-content/55">Show problems asked at any selected company.</p>
          </div>
          {selectedCompanies.length > 0 && (
            <button
              type="button"
              className="btn btn-ghost btn-xs gap-1 text-base-content/60"
              onClick={() => setSelectedCompanies([])}
              aria-label="Clear company filters"
            >
              <X className="h-3.5 w-3.5" /> Clear
            </button>
          )}
        </div>

        <label className="input input-bordered mt-4 flex h-10 items-center gap-2 bg-base-200/50">
          <Search className="h-4 w-4 text-base-content/45" />
          <input
            type="search"
            value={companySearch}
            onChange={(event) => setCompanySearch(event.target.value)}
            placeholder="Search companies"
            aria-label="Search companies"
          />
        </label>

        <div className="mt-3 flex items-center justify-between text-xs text-base-content/50">
          <span>{selectedCompanies.length ? `${selectedCompanies.length} selected` : "All companies"}</span>
          <span>{visibleCompanies.length} shown</span>
        </div>

        <div className="mt-2 max-h-[480px] space-y-1 overflow-y-auto pr-1">
          {visibleCompanies.length ? visibleCompanies.map(({ name, count }) => {
            const isSelected = selectedCompanies.includes(name);
            return (
              <button
                key={name}
                type="button"
                aria-pressed={isSelected}
                onClick={() => toggleCompany(name)}
                className={`flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${
                  isSelected
                    ? "bg-primary/10 font-semibold text-primary ring-1 ring-inset ring-primary/30"
                    : "text-base-content/75 hover:bg-base-200"
                }`}
              >
                <span className="truncate">{name}</span>
                <span className={`badge badge-sm ${isSelected ? "badge-primary" : "badge-ghost"}`}>{count}</span>
              </button>
            );
          }) : (
            <p className="px-2 py-6 text-center text-sm text-base-content/50">No matching companies.</p>
          )}
        </div>
        <p className="mt-3 border-t border-base-300 pt-3 text-xs leading-relaxed text-base-content/45">
          Company tags use a community-maintained LeetCode snapshot (July 2026). They reflect reported past questions, so they can change over time.
          {" "}
          <a
            href="https://github.com/snehasishroy/leetcode-companywise-interview-questions"
            target="_blank"
            rel="noreferrer"
            className="link link-hover text-primary/80"
          >
            Dataset
          </a>
          {" · "}
          <a
            href="https://support.leetcode.com/hc/en-us/articles/360011985113-How-does-grouping-questions-by-company-work"
            target="_blank"
            rel="noreferrer"
            className="link link-hover text-primary/80"
          >
            How LeetCode groups them
          </a>
        </p>
      </aside>
      </div>

      <CreatePlaylistModel
        isOpen={isCreateModelOpen}
        onClose={() => setIsCreateModelOpen(false)}
        onSubmit={handleCreatePlaylist}
      />

      <AddToPlaylist
        isOpen={isAddToPlaylistModelOpen}
        onClose={() => setIsAddToPlaylistModelOpen(false)}
        problemId={selectedProblemId}
      />
    </div>
  );
};

export default ProblemTable;
