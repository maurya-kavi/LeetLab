import React from 'react';
import { CheckCircle2, XCircle, Clock, MemoryStick as Memory } from 'lucide-react';

const SubmissionResults = ({ submission }) => {
  const parseMetrics = (value) => {
    if (value == null) return [];
    try {
      const parsed = typeof value === "string" ? JSON.parse(value) : value;
      return (Array.isArray(parsed) ? parsed : [parsed])
        .map((item) => Number.parseFloat(String(item ?? "")))
        .filter(Number.isFinite);
    } catch {
      return [];
    }
  };
  const average = (values) => {
    const numbers = parseMetrics(values);
    return numbers.length ? numbers.reduce((sum, value) => sum + value, 0) / numbers.length : null;
  };
  const avgMemory = average(submission.memory);
  const avgTime = average(submission.time);
  const testCases = submission.testCases || [];
  const passedTests = testCases.filter((testCase) => testCase.passed).length;
  const totalTests = testCases.length;
  const successRate = totalTests ? (passedTests / totalTests) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body p-4">
            <h3 className="card-title text-sm">Status</h3>
            <div className={`text-lg font-bold ${
              submission.status === 'Accepted' ? 'text-success' : 'text-error'
            }`}>
              {submission.status}
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-lg">
          <div className="card-body p-4">
            <h3 className="card-title text-sm">Success Rate</h3>
            <div className="text-lg font-bold">
              {successRate.toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-lg">
          <div className="card-body p-4">
            <h3 className="card-title text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Avg. Runtime
            </h3>
            <div className="text-lg font-bold">
              {avgTime == null ? "—" : `${avgTime.toFixed(3)} s`}
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-lg">
          <div className="card-body p-4">
            <h3 className="card-title text-sm flex items-center gap-2">
              <Memory className="w-4 h-4" />
              Avg. Memory
            </h3>
            <div className="text-lg font-bold">
              {avgMemory == null ? "—" : `${avgMemory.toFixed(0)} KB`}
            </div>
          </div>
        </div>
      </div>

      {/* Test Cases Results */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Test Cases Results</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Expected Output</th>
                  <th>Your Output</th>
                  <th>Memory</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {testCases.map((testCase, index) => (
                  <tr key={testCase.id || index}>
                    <td>
                      {testCase.passed ? (
                        <div className="flex items-center gap-2 text-success">
                          <CheckCircle2 className="w-5 h-5" />
                        {testCase.status || "Accepted"}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-error">
                          <XCircle className="w-5 h-5" />
                        {testCase.status || "Failed"}
                        </div>
                      )}
                    </td>
                    <td className="font-mono">{testCase.expected}</td>
                    <td className="font-mono">{testCase.stdout || 'null'}</td>
                    <td>{testCase.memory || "—"}</td>
                    <td>{testCase.time || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionResults;
