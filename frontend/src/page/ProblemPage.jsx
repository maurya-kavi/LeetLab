import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  FileText,
  MessageSquare,
  Lightbulb,
  Bookmark,
  Share2,
  Clock,
  ChevronRight,
  BookOpen,
  Terminal,
  Code2,
  Users,
  ThumbsUp,
  Home,
} from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../hooks/useTheme";
import { getLanguageId, getLanguageLabel } from "../lib/lang";
import { useExecutionStore } from "../store/useExecutionStore";
import { useSubmissionStore } from "../store/useSubmissionStore";
import Submission from "../components/Submission";
import SubmissionsList from "../components/SubmissionList";
import DiscussionPanel from "../components/DiscussionPanel";
import HintsPanel from "../components/HintsPanel";
import { codeEditorOptions } from "../lib/editorOptions";

const ProblemPage = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const activeTab = ["description", "submissions", "discussion", "hints"].includes(requestedTab)
    ? requestedTab
    : "description";
  const setActiveTab = (tab) => {
    const nextParams = new URLSearchParams(searchParams);
    if (tab === "description") nextParams.delete("tab");
    else nextParams.set("tab", tab);
    setSearchParams(nextParams);
  };
  const { getProblemById, problem, isProblemLoading } = useProblemStore();

  const {
    submission: submissions,
    isLoading: isSubmissionsLoading,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
    submissionCount,
    submissionSuccessRate,
  } = useSubmissionStore();

  const [code, setCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("JAVASCRIPT");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [testcases, setTestCases] = useState([]);

  const { executeCode, submission, runResult, isExecuting } = useExecutionStore();

  useEffect(() => {
    getProblemById(id);
    getSubmissionCountForProblem(id);
    const refreshInterval = window.setInterval(() => {
      getSubmissionCountForProblem(id);
    }, 30000);

    return () => window.clearInterval(refreshInterval);
  }, [id, getProblemById, getSubmissionCountForProblem]);

  useEffect(() => {
    if (problem) {
      setCode(
        problem.codeSnippets?.[selectedLanguage] || submission?.sourceCode || ""
      );
      setTestCases(
        problem.testcases?.map((tc) => ({
          input: tc.input,
          output: tc.output,
          displayInput: tc.displayInput,
          explanation: tc.explanation,
          visualization: tc.visualization,
        })) || []
      );
    }
  }, [problem, selectedLanguage]);

  useEffect(() => {
    if (activeTab === "submissions" && id) {
      getSubmissionForProblem(id);
    }
  }, [activeTab, id]);

  console.log("submission", submissions);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    setCode(problem.codeSnippets?.[lang] || "");
  };

  const handleExecuteCode = async (e, mode) => {
    e.preventDefault();
    try {
      const language_id = getLanguageId(selectedLanguage);
      const stdin = problem.testcases.map((tc) => tc.input);
      const expected_outputs = problem.testcases.map((tc) => tc.output);
      const result = await executeCode(code, language_id, stdin, expected_outputs, id, mode);
      if (result && mode === "submit") {
        await Promise.all([
          getSubmissionForProblem(id),
          getSubmissionCountForProblem(id),
        ]);
      }
    } catch (error) {
      console.log("Error executing code", error);
    }
  };

  if (isProblemLoading || !problem) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-200">
        <div className="card bg-base-100 p-8 shadow-xl">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/70">Loading problem...</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    const problemExamples = Array.isArray(problem.examples)
      ? problem.examples
      : Object.values(problem.examples || {}).slice(0, 1);
    switch (activeTab) {
      case "description":
        return (
          <div className="prose max-w-none">
            <p className="text-lg mb-6">{problem.description}</p>

            {problem.companies?.length > 0 && (
              <details className="mb-6 rounded-xl border border-base-300 bg-base-100 p-4">
                <summary className="cursor-pointer list-none font-semibold text-base-content marker:hidden">
                  Companies tagged ({problem.companies.length})
                  <span className="ml-2 text-sm font-normal text-base-content/55">Show company list</span>
                </summary>
                <div className="mt-4 flex max-h-60 flex-wrap gap-2 overflow-y-auto pr-1">
                  {[...problem.companies].sort((a, b) => a.localeCompare(b)).map((company) => (
                    <span key={company} className="badge badge-primary badge-outline">{company}</span>
                  ))}
                </div>
              </details>
            )}

            {problemExamples.length > 0 && (
              <>
                <h3 className="text-xl font-bold mb-4">Examples:</h3>
                {problemExamples.map((example, idx) => (
                    <div
                      key={idx}
                      className="bg-base-200 p-6 rounded-xl mb-6 font-mono"
                    >
                      <div className="mb-4">
                        <div className="text-primary mb-2 text-base font-semibold">
                          Input:
                        </div>
                        <pre className="rounded-lg border border-base-300 bg-base-100 px-4 py-3 font-semibold text-base-content whitespace-pre-wrap break-words">
                          {example.input}
                        </pre>
                      </div>
                      {example.visualization && (
                        <div className="mb-4">
                          <div className="text-primary mb-2 text-base font-semibold">
                            Visual:
                          </div>
                          <pre className="overflow-x-auto rounded-lg border border-base-300 bg-base-300/50 p-4 text-sm leading-relaxed whitespace-pre">
                            {example.visualization}
                          </pre>
                        </div>
                      )}
                      <div className="mb-4">
                        <div className="text-primary mb-2 text-base font-semibold">
                          Output:
                        </div>
                        <pre className="rounded-lg border border-base-300 bg-base-100 px-4 py-3 font-semibold text-base-content whitespace-pre-wrap break-words">
                          {example.output}
                        </pre>
                      </div>
                      {example.explanation && (
                        <div>
                          <div className="text-success mb-2 text-base font-semibold">
                            Explanation:
                          </div>
                          <p className="text-base-content/70 text-base whitespace-pre-wrap">
                            {example.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                ))}
              </>
            )}

            {problem.constraints && (
              <>
                <h3 className="text-xl font-bold mb-4">Constraints:</h3>
                <div className="bg-base-200 p-6 rounded-xl mb-6">
                  <span className="rounded-lg border border-base-300 bg-base-100 px-4 py-1 text-lg font-semibold text-base-content">
                    {problem.constraints}
                  </span>
                </div>
              </>
            )}
          </div>
        );
      case "submissions":
        return (
          <SubmissionsList
            submissions={submissions}
            isLoading={isSubmissionsLoading}
          />
        );
      case "discussion":
        return <DiscussionPanel problemId={id} />;
      case "hints":
        return <HintsPanel key={id} hints={problem?.hints} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-base-200/50 px-3 py-3 sm:px-5">
      <nav className="navbar sticky top-3 z-40 mx-auto max-w-[1600px] rounded-2xl border border-base-300 bg-base-100/90 px-3 shadow-lg shadow-black/5 backdrop-blur-xl sm:px-5">
        <div className="flex-1 gap-2">
          <Link to={"/"} className="flex items-center gap-2 text-primary">
            <Home className="w-6 h-6" />
            <ChevronRight className="w-4 h-4" />
          </Link>
          <div className="mt-2">
            <h1 className="text-xl font-bold">{problem.problemNumber && `#${problem.problemNumber} · `}{problem.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-base-content/55 sm:text-sm">
              <Clock className="w-4 h-4" />
              <span>
                Updated{" "}
                {new Date(problem.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="text-base-content/30">•</span>
              <Users className="w-4 h-4" />
              <span>{submissionCount} Submissions</span>
              <span className="text-base-content/30">•</span>
              <ThumbsUp className="w-4 h-4" />
              <span>
                {submissionSuccessRate == null ? "—" : `${submissionSuccessRate}%`} Success Rate
              </span>
            </div>
          </div>
        </div>
        <div className="flex-none gap-3">
          <ThemeToggle />
          <Link to="/playlists" className="btn btn-outline btn-sm gap-2">
            <Bookmark className="h-4 w-4" />
            <span className="hidden sm:inline">My Playlists</span>
          </Link>
          <button
            className={`btn btn-ghost btn-circle ${
              isBookmarked ? "text-primary" : ""
            }`}
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark className="w-5 h-5" />
          </button>
          <button className="btn btn-ghost btn-circle">
            <Share2 className="w-5 h-5" />
          </button>
          <select
            className="select select-bordered select-primary w-40"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            {Object.keys(problem.codeSnippets || {}).map((lang) => (
              <option key={lang} value={lang}>
                {getLanguageLabel(lang)}
              </option>
            ))}
          </select>
        </div>
      </nav>

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-lg shadow-black/5">
            <div className="card-body p-0">
              <div className="tabs tabs-bordered">
                <button
                  className={`tab gap-2 ${
                    activeTab === "description" ? "tab-active" : ""
                  }`}
                  onClick={() => setActiveTab("description")}
                >
                  <FileText className="w-4 h-4" />
                  Description
                </button>
                <button
                  className={`tab gap-2 ${
                    activeTab === "submissions" ? "tab-active" : ""
                  }`}
                  onClick={() => setActiveTab("submissions")}
                >
                  <Code2 className="w-4 h-4" />
                  Submissions
                </button>
                <button
                  className={`tab gap-2 ${
                    activeTab === "discussion" ? "tab-active" : ""
                  }`}
                  onClick={() => setActiveTab("discussion")}
                >
                  <MessageSquare className="w-4 h-4" />
                  Discussion
                </button>
                <button
                  className={`tab gap-2 ${
                    activeTab === "hints" ? "tab-active" : ""
                  }`}
                  onClick={() => setActiveTab("hints")}
                >
                  <Lightbulb className="w-4 h-4" />
                  Hints
                </button>
              </div>

              <div className="p-6">{renderTabContent()}</div>
            </div>
          </div>

          <div className="card overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-lg shadow-black/5">
            <div className="card-body p-0">
              <div className="tabs tabs-bordered">
                <button className="tab tab-active gap-2">
                  <Terminal className="w-4 h-4" />
                  Code Editor
                </button>
              </div>

              <div className="h-[520px] w-full sm:h-[600px]">
                <Editor
                  height="100%"
                  language={selectedLanguage.toLowerCase()}
                  theme={theme === "dark" ? "vs-dark" : "light"}
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  options={{ ...codeEditorOptions, readOnly: false }}
                />
              </div>

              <div className="border-t border-base-300 bg-base-200/70 p-4">
                <div className="flex justify-between items-center">
                  <button
                    className={`btn btn-primary gap-2 ${
                      isExecuting ? "loading" : ""
                    }`}
                    onClick={(event) => handleExecuteCode(event, "run")}
                    disabled={isExecuting}
                  >
                    {!isExecuting && <Play className="w-4 h-4" />}
                    Run Code
                  </button>
                  <button
                    className="btn btn-success gap-2"
                    onClick={(event) => handleExecuteCode(event, "submit")}
                    disabled={isExecuting}
                  >
                    Submit Solution
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card mt-6 overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-lg shadow-black/5">
          <div className="card-body">
            {runResult ? (
              <Submission submission={runResult} />
            ) : submission ? (
              <Submission submission={submission} />
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Test Cases</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Input</th>
                        <th>Expected Output</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testcases.map((testCase, index) => (
                        <tr key={index}>
                          <td className="font-mono align-top">
                            <pre className="whitespace-pre-wrap break-words">{testCase.displayInput || testCase.input}</pre>
                            {testCase.visualization && (
                              <pre className="mt-3 overflow-x-auto rounded-lg border border-base-300 bg-base-200 p-3 text-xs leading-relaxed whitespace-pre">
                                {testCase.visualization}
                              </pre>
                            )}
                            {testCase.explanation && (
                              <p className="mt-2 max-w-prose whitespace-pre-wrap text-sm text-base-content/70">
                                {testCase.explanation}
                              </p>
                            )}
                          </td>
                          <td className="font-mono align-top">
                            <pre className="whitespace-pre-wrap">{testCase.output}</pre>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
