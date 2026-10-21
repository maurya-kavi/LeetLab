import { useState } from "react";
import { Eye, Lightbulb, RotateCcw } from "lucide-react";

const HintsPanel = ({ hints }) => {
  const hintList = (typeof hints === "string" ? hints : "")
    .split(/\r?\n+/)
    .map((hint) => hint.replace(/^\s*(?:hint\s*)?\d+[.):\-]\s*/i, "").trim())
    .filter(Boolean);
  const [revealedCount, setRevealedCount] = useState(0);

  if (hintList.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-base-300 p-8 text-center">
        <Lightbulb className="mx-auto h-8 w-8 text-base-content/40" />
        <h2 className="mt-3 font-semibold">No hints available</h2>
        <p className="mt-1 text-sm text-base-content/60">
          The problem author hasn’t added any hints yet.
        </p>
      </div>
    );
  }

  const revealNext = () => setRevealedCount((count) => Math.min(count + 1, hintList.length));

  return (
    <section className="space-y-4">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <Lightbulb className="h-5 w-5 text-warning" />
          Need a nudge?
        </h2>
        <p className="mt-1 text-sm text-base-content/60">
          Reveal hints one at a time to avoid seeing more than you need.
        </p>
      </div>

      <div className="space-y-3">
        {hintList.slice(0, revealedCount).map((hint, index) => (
          <article key={`${index}-${hint}`} className="rounded-xl border border-warning/30 bg-warning/5 p-4">
            <div className="mb-2 text-xs font-bold uppercase tracking-wide text-warning">
              Hint {index + 1}
            </div>
            <p className="whitespace-pre-wrap leading-6">{hint}</p>
          </article>
        ))}
      </div>

      {revealedCount < hintList.length ? (
        <button type="button" className="btn btn-warning btn-sm gap-2" onClick={revealNext}>
          <Eye className="h-4 w-4" />
          Reveal hint {revealedCount + 1}
        </button>
      ) : (
        <button type="button" className="btn btn-ghost btn-sm gap-2" onClick={() => setRevealedCount(0)}>
          <RotateCcw className="h-4 w-4" />
          Hide hints
        </button>
      )}
    </section>
  );
};

export default HintsPanel;
