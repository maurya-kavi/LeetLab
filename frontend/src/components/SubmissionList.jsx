import { CheckCircle2, XCircle, Clock, MemoryStick, Calendar, Code2 } from "lucide-react";

const parseMetricValues = (value) => {
  if (value == null) return [];

  let values = value;
  if (typeof value === "string") {
    try {
      values = JSON.parse(value);
    } catch {
      values = [value];
    }
  }

  if (!Array.isArray(values)) values = [values];

  return values
    .map((item) => Number.parseFloat(String(item ?? "")))
    .filter(Number.isFinite);
};

const average = (values) => {
  const numbers = parseMetricValues(values);
  return numbers.length
    ? numbers.reduce((total, value) => total + value, 0) / numbers.length
    : null;
};

const getSourceCode = (sourceCode) => {
  if (typeof sourceCode === "string") return sourceCode;
  return sourceCode == null ? "No source code saved" : JSON.stringify(sourceCode, null, 2);
};

const SubmissionsList = ({ submissions, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!submissions?.length) {
    return <div className="p-8 text-center text-base-content/70">No submissions yet</div>;
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission) => {
        const avgMemory = average(submission.memory);
        const avgTime = average(submission.time);
        const accepted = submission.status === "Accepted";

        return (
          <article key={submission.id} className="card rounded-lg bg-base-200 shadow-lg">
            <div className="card-body gap-4 p-4">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div className="flex flex-wrap items-center gap-3">
                  <div className={`flex items-center gap-2 font-semibold ${accepted ? "text-success" : "text-error"}`}>
                    {accepted ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                    <span>{submission.status || "Execution Error"}</span>
                  </div>
                  <span className="badge badge-neutral">{submission.language || "Unknown"}</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-base-content/70">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {avgTime == null ? "—" : `${avgTime.toFixed(3)} s`}
                  </span>
                  <span className="flex items-center gap-1">
                    <MemoryStick className="h-4 w-4" />
                    {avgMemory == null ? "—" : `${avgMemory.toFixed(0)} KB`}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(submission.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <details className="rounded-lg border border-base-300 bg-base-100">
                <summary className="flex cursor-pointer list-none items-center gap-2 p-3 font-medium">
                  <Code2 className="h-4 w-4 text-primary" />
                  View submitted code and test results
                </summary>
                <div className="space-y-4 border-t border-base-300 p-3">
                  <div>
                    <h4 className="mb-2 text-sm font-semibold">Submitted code</h4>
                    <pre className="max-h-96 overflow-auto rounded-lg bg-neutral p-4 text-sm text-neutral-content">
                      <code>{getSourceCode(submission.sourceCode)}</code>
                    </pre>
                  </div>

                  {submission.testCases?.length > 0 && (
                    <div>
                      <h4 className="mb-2 text-sm font-semibold">Test case results</h4>
                      <div className="overflow-x-auto">
                        <table className="table table-sm">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Status</th>
                              <th>Your output</th>
                              <th>Expected</th>
                              <th>Time</th>
                              <th>Memory</th>
                            </tr>
                          </thead>
                          <tbody>
                            {submission.testCases.map((testCase, index) => (
                              <tr key={testCase.id || `${submission.id}-${index}`}>
                                <td>{testCase.testCase || index + 1}</td>
                                <td className={testCase.passed ? "text-success" : "text-error"}>
                                  {testCase.status || (testCase.passed ? "Accepted" : "Failed")}
                                </td>
                                <td className="max-w-56 whitespace-pre-wrap font-mono">{testCase.stdout ?? "—"}</td>
                                <td className="max-w-56 whitespace-pre-wrap font-mono">{testCase.expected ?? "—"}</td>
                                <td>{testCase.time || "—"}</td>
                                <td>{testCase.memory || "—"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {submission.testCases.some((testCase) => testCase.stderr || testCase.compileOutput) && (
                        <div className="mt-3 space-y-2">
                          {submission.testCases.map((testCase, index) => {
                            const details = testCase.compileOutput || testCase.stderr;
                            return details ? (
                              <pre key={testCase.id || `${submission.id}-error-${index}`} className="overflow-auto whitespace-pre-wrap rounded-lg bg-neutral p-3 text-sm text-neutral-content">
                                {details}
                              </pre>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </details>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default SubmissionsList;
