import { useEffect } from "react";
import { ArrowDown, ArrowRight, Code2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";
import ProblemTable from "../components/ProblemTable";

const HomePage = () => {
  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-1 pb-10 pt-8 sm:pt-12">
      <section className="relative isolate overflow-hidden rounded-[2rem] border border-base-content/10 bg-base-100 shadow-2xl shadow-black/10">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="home-code-grid absolute inset-0" />
          <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
          <div className="absolute -right-4 top-0 hidden w-[54%] -rotate-3 font-mono text-[11px] leading-6 text-base-content/50 opacity-25 lg:block">
            <div className="flex gap-5">
              <div className="select-none text-right text-base-content/30">
                01<br />02<br />03<br />04<br />05<br />06<br />07<br />08<br />09<br />10
              </div>
              <pre className="whitespace-pre">
                <span className="text-primary">function</span> solve(input) {"{"}<br />
                {'  '}<span className="text-secondary">const</span> values = parse(input);<br />
                {'  '}<span className="text-secondary">const</span> visited = <span className="text-primary">new</span> Set();<br />
                <br />
                {'  '}<span className="text-primary">for</span> (<span className="text-secondary">const</span> value <span className="text-primary">of</span> values) {"{"}<br />
                {'    '}<span className="text-primary">if</span> (visited.has(value)) {"{"}<br />
                {'      '}<span className="text-primary">return</span> value;<br />
                {'    }'}<br />
                {'    '}visited.add(value);<br />
                {'  }'}<br />
                {'  '}<span className="text-primary">return</span> <span className="text-success">result</span>;<br />
                {'}'}
              </pre>
            </div>
          </div>
          <div className="absolute right-7 top-7 font-mono text-5xl font-bold tracking-tight text-primary/10 lg:hidden">{"</>"}</div>
        </div>

        <div className="relative z-10 grid gap-10 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[1.4fr_0.6fr] lg:items-center lg:px-14">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Your coding practice workspace
            </div>
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Build consistency.
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Get better at code.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-base-content/65 sm:text-lg">
              Practice curated problems, track your submissions, and keep the problems you want to revisit in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#problems" className="btn btn-primary gap-2 shadow-lg shadow-primary/20">Explore problems <ArrowDown className="h-4 w-4" /></a>
              <Link to="/playlists" className="btn btn-ghost gap-2">My playlists <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>

          <div className="mx-auto grid w-full max-w-sm grid-cols-2 gap-3 lg:max-w-none">
            <div className="col-span-2 rounded-2xl border border-base-content/10 bg-base-200/70 p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Code2 className="h-5 w-5" /></span>
                <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">Ready to practice</span>
              </div>
              <p className="mt-6 text-sm text-base-content/55">Problem library</p>
              <p className="mt-1 text-3xl font-bold">{isProblemsLoading ? "—" : problems.length}</p>
              <p className="mt-1 text-sm text-base-content/55">challenges to work through</p>
            </div>
            <div className="rounded-2xl border border-base-content/10 bg-base-200/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-base-content/45">Languages</p>
              <p className="mt-3 text-lg font-bold">5 supported</p>
              <p className="mt-1 text-xs text-base-content/55">Choose your approach</p>
            </div>
            <div className="rounded-2xl border border-base-content/10 bg-base-200/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-base-content/45">Practice</p>
              <p className="mt-3 text-lg font-bold">At your pace</p>
              <p className="mt-1 text-xs text-base-content/55">Save problems for later</p>
            </div>
          </div>
        </div>
      </section>

      <section id="problems" className="scroll-mt-28 pt-12 sm:pt-16">
        {isProblemsLoading ? (
          <div className="rounded-2xl border border-base-300 bg-base-100 p-6">
            <div className="skeleton h-8 w-48" />
            <div className="mt-6 space-y-3">{[1, 2, 3, 4].map((item) => <div key={item} className="skeleton h-14 w-full" />)}</div>
          </div>
        ) : problems.length > 0 ? (
          <ProblemTable problems={problems} />
        ) : (
          <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 px-6 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Code2 className="h-6 w-6" /></div>
            <h2 className="mt-4 text-lg font-semibold">No problems available yet</h2>
            <p className="mt-1 text-sm text-base-content/60">New coding challenges will appear here.</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default HomePage;
