import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, Clock3, ExternalLink, Lightbulb, Sparkles, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { useCompanyPrepStore } from "../store/useCompanyPrepStore";

const CompanyPrepPage = () => {
  const { currentPlan, plans, isLoading, isSaving, getPlans, generatePlan } = useCompanyPrepStore();
  const [form, setForm] = useState({ company: "", role: "", jobDescription: "", interviewDate: "", questionCount: 10, dailyMinutes: 45, difficulty: "" });

  useEffect(() => { getPlans(); }, [getPlans]);

  const update = (event) => setForm((values) => ({ ...values, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    await generatePlan({ ...form, questionCount: Number(form.questionCount), dailyMinutes: Number(form.dailyMinutes) || null, difficulty: form.difficulty || null, interviewDate: form.interviewDate || null });
  };
  const plan = currentPlan || plans[0];

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-1 pb-10 pt-8 sm:pt-12">
      <section className="rounded-3xl border border-base-content/10 bg-base-100 p-6 shadow-xl shadow-black/5 sm:p-10">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary"><Sparkles className="h-3.5 w-3.5" /> Company Prep</span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">Prepare with the questions you already have.</h1>
          <p className="mt-4 text-base leading-7 text-base-content/65">Generate a transparent, deadline-aware plan from your existing LeetLab problem bank. Recommendations are estimates, not promises about an interview.</p>
        </div>
        <form onSubmit={submit} className="mt-8 grid gap-4 rounded-2xl border border-base-300 bg-base-200/40 p-4 sm:grid-cols-2 sm:p-6">
          <label className="form-control"><span className="label-text mb-1 text-sm font-semibold">Company</span><input required minLength={2} name="company" value={form.company} onChange={update} placeholder="Amazon" className="input input-bordered bg-base-100" /></label>
          <label className="form-control"><span className="label-text mb-1 text-sm font-semibold">Role</span><input required minLength={2} name="role" value={form.role} onChange={update} placeholder="SDE-1" className="input input-bordered bg-base-100" /></label>
          <label className="form-control sm:col-span-2"><span className="label-text mb-1 text-sm font-semibold">Job description <span className="font-normal text-base-content/45">(optional)</span></span><textarea name="jobDescription" value={form.jobDescription} onChange={update} rows="3" placeholder="Paste the technical responsibilities or required skills..." className="textarea textarea-bordered bg-base-100" /></label>
          <label className="form-control"><span className="label-text mb-1 text-sm font-semibold">Interview date <span className="font-normal text-base-content/45">(optional)</span></span><input type="date" name="interviewDate" value={form.interviewDate} onChange={update} min={new Date().toISOString().slice(0, 10)} className="input input-bordered bg-base-100" /></label>
          <label className="form-control"><span className="label-text mb-1 text-sm font-semibold">Questions</span><input type="number" name="questionCount" min="1" max="50" value={form.questionCount} onChange={update} className="input input-bordered bg-base-100" /></label>
          <label className="form-control"><span className="label-text mb-1 text-sm font-semibold">Daily minutes</span><input type="number" name="dailyMinutes" min="10" max="720" value={form.dailyMinutes} onChange={update} className="input input-bordered bg-base-100" /></label>
          <label className="form-control"><span className="label-text mb-1 text-sm font-semibold">Preferred difficulty</span><select name="difficulty" value={form.difficulty} onChange={update} className="select select-bordered bg-base-100"><option value="">Any difficulty</option><option value="EASY">Easy</option><option value="MEDIUM">Medium</option><option value="HARD">Hard</option></select></label>
          <button disabled={isSaving} className="btn btn-primary mt-auto gap-2 sm:col-span-2 sm:w-fit">{isSaving ? <span className="loading loading-spinner loading-sm" /> : <Target className="h-4 w-4" />} Generate Preparation Plan</button>
        </form>
      </section>

      {isLoading && !plan ? <div className="mt-8 flex justify-center"><span className="loading loading-spinner loading-lg text-primary" /></div> : plan ? (
        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-base-300 pb-5"><div><p className="text-xs font-bold uppercase tracking-wider text-primary">Recommended plan</p><h2 className="mt-1 text-2xl font-bold">{plan.company} · {plan.role}</h2></div><span className="badge badge-lg gap-2 border-base-300 bg-base-200/60"><CheckCircle2 className="h-4 w-4 text-success" /> {plan.recommendations.length} questions</span></div>
            {plan.research && <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-base-content/70"><p><strong className="text-base-content">Research:</strong> {plan.research.summary}</p><p className="mt-1 text-xs text-base-content/50">{plan.research.provider} · {plan.research.status === "grounded" ? "Grounded with current web sources" : "Fallback ranking used"}</p>{plan.research.reason && <p className="mt-2 text-xs text-warning">Provider detail: {plan.research.reason}</p>}{plan.research.sources?.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{plan.research.sources.slice(0, 4).map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="link link-hover inline-flex items-center gap-1 text-xs text-primary">{source.title}<ExternalLink className="h-3 w-3" /></a>)}</div>}</div>}
            <div className="mt-5 flex flex-wrap gap-2">{(plan.topics || []).map((topic) => <span key={topic} className="badge badge-outline badge-primary">{topic}</span>)}{(plan.skills || []).slice(0, 8).map((skill) => <span key={skill} className="badge badge-ghost">{skill}</span>)}</div>
            <div className="mt-6 space-y-3">{plan.recommendations.map((recommendation, index) => <article key={recommendation.id} className="rounded-2xl border border-base-300 p-4 transition hover:border-primary/40"><div className="flex items-start gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">{index + 1}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><Link to={`/problem/${recommendation.id}`} className="font-semibold hover:text-primary hover:underline">{recommendation.title}</Link><span className={`badge badge-sm ${recommendation.priority === "High" ? "badge-error" : recommendation.priority === "Medium" ? "badge-warning" : "badge-ghost"}`}>{recommendation.priority} · {recommendation.score}/100</span></div><p className="mt-1 text-sm text-base-content/60">{recommendation.reason}</p><div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-base-content/55"><span className="badge badge-outline badge-sm">{recommendation.difficulty}</span><span className="badge badge-ghost badge-sm">{recommendation.evidenceStatus}</span>{recommendation.tags?.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}{recommendation.solved && <span className="ml-auto inline-flex items-center gap-1 text-success"><CheckCircle2 className="h-3.5 w-3.5" /> Solved</span>}<ExternalLink className="h-3.5 w-3.5" /></div></div></div></article>)}</div>
          </div>
          <aside className="space-y-4"><div className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm"><h3 className="flex items-center gap-2 font-bold"><CalendarDays className="h-4 w-4 text-primary" /> Your schedule</h3>{plan.schedule?.length ? <div className="mt-4 space-y-3">{plan.schedule.map((day) => <div key={day.day} className="rounded-xl bg-base-200/60 p-3"><div className="flex justify-between text-sm font-semibold"><span>Day {day.day}</span><span className="flex items-center gap-1 text-xs text-base-content/55"><Clock3 className="h-3.5 w-3.5" /> {day.minutes} min</span></div><p className="mt-1 text-xs text-base-content/60">{day.focus} · {day.problemIds.length} question{day.problemIds.length === 1 ? "" : "s"}</p></div>)}</div> : <p className="mt-3 text-sm text-base-content/60">Add an interview date to receive a day-wise schedule.</p>}</div><div className="rounded-3xl border border-primary/20 bg-primary/5 p-5 text-sm leading-6 text-base-content/65"><Lightbulb className="mb-2 h-5 w-5 text-primary" /><p><strong className="text-base-content">How scoring works:</strong> company tags are verified from your existing data; role, description, topic, and difficulty matches are heuristic predictions.</p></div></aside>
        </section>
      ) : null}
    </main>
  );
};

export default CompanyPrepPage;
