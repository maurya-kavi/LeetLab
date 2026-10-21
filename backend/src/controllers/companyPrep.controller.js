import { db } from "../libs/db.js";
import axios from "axios";

const STOP_WORDS = new Set("a an and are as at be by for from in into is it of on or the to with your".split(" "));
const TOPIC_ALIASES = {
  array: ["array", "two pointer", "sliding window", "prefix"],
  string: ["string", "substring", "pattern matching"],
  linked: ["linked list", "list"],
  tree: ["tree", "binary tree", "bst"],
  graph: ["graph", "bfs", "dfs", "topological"],
  dynamic: ["dynamic programming", "dp", "memoization"],
  sorting: ["sort", "sorting", "heap", "priority queue"],
  binary: ["binary search"],
  stack: ["stack", "monotonic"],
  greedy: ["greedy"],
  recursion: ["recursion", "backtracking"],
  math: ["math", "matrix", "bit"],
};

const normalize = (value) => String(value || "").trim().toLowerCase();
const words = (value) => normalize(value).split(/[^a-z0-9+#.]+/).filter((word) => word.length > 2 && !STOP_WORDS.has(word));

const extractSignals = (company, role, jobDescription) => {
  const text = `${company} ${role} ${jobDescription}`;
  const tokens = new Set(words(text));
  const topics = Object.entries(TOPIC_ALIASES)
    .filter(([, aliases]) => aliases.some((alias) => normalize(text).includes(alias)))
    .map(([topic]) => topic);
  return {
    topics,
    skills: [...tokens].filter((token) => !["developer", "engineer", "intern", "backend", "frontend", "software"].includes(token)).slice(0, 12),
    tokens,
  };
};

const scoreProblem = (problem, signals, company, requestedDifficulty) => {
  const haystack = normalize(`${problem.title} ${(problem.tags || []).join(" ")} ${problem.description}`);
  const companyName = normalize(company);
  const matchedTopics = signals.topics.filter((topic) =>
    TOPIC_ALIASES[topic].some((alias) => haystack.includes(alias))
  );
  const matchedSkills = [...signals.tokens].filter((token) => haystack.includes(token));
  let score = Math.min(30, matchedTopics.length * 10) + Math.min(25, matchedSkills.length * 3);
  const companyMatch = (problem.companies || []).some((tag) => normalize(tag) === companyName);
  if (companyMatch) score += 35;
  if (requestedDifficulty && problem.difficulty === requestedDifficulty) score += 10;
  if (problem.tags?.length) score += 5;
  if (problem.difficulty === "MEDIUM") score += 3;
  return {
    ...problem,
    score: Math.min(100, score),
    matchedTopics,
    matchedSkills: matchedSkills.slice(0, 5),
    companyMatch,
  };
};

const selectDiverse = (ranked, count) => {
  const remaining = [...ranked];
  const selected = [];
  const covered = new Set();
  while (remaining.length && selected.length < count) {
    let bestIndex = 0;
    let bestValue = -1;
    remaining.forEach((candidate, index) => {
      const newTopics = candidate.matchedTopics.filter((topic) => !covered.has(topic)).length;
      const value = candidate.score + newTopics * 4 - selected.filter((item) => item.difficulty === candidate.difficulty).length;
      if (value > bestValue) {
        bestValue = value;
        bestIndex = index;
      }
    });
    const [chosen] = remaining.splice(bestIndex, 1);
    chosen.matchedTopics.forEach((topic) => covered.add(topic));
    selected.push(chosen);
  }
  return selected;
};

const buildSchedule = (recommendations, interviewDate, dailyMinutes) => {
  if (!interviewDate) return [];
  const days = Math.max(1, Math.ceil((new Date(interviewDate).getTime() - Date.now()) / 86400000));
  const perDay = Math.max(1, Math.ceil(recommendations.length / days));
  return Array.from({ length: Math.min(days, recommendations.length || 1) }, (_, index) => ({
    day: index + 1,
    focus: index === 0 ? "Core patterns" : index === Math.min(days, recommendations.length || 1) - 1 ? "Revision and timed practice" : "Topic practice",
    minutes: dailyMinutes || 45,
    problemIds: recommendations.slice(index * perDay, (index + 1) * perDay).map((problem) => problem.id),
  }));
};

const extractGeminiText = (data) =>
  data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim() || "";

const parseJsonObject = (text) => {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1] || text;
  const start = fenced.indexOf("{");
  const end = fenced.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("Gemini returned no JSON object");
  return JSON.parse(fenced.slice(start, end + 1));
};

const getGroundingSources = (metadata) =>
  (metadata?.groundingChunks || [])
    .map((chunk) => chunk.web?.uri && {
      title: chunk.web.title || chunk.web.uri,
      url: chunk.web.uri,
    })
    .filter(Boolean)
    .filter((source, index, sources) => sources.findIndex((item) => item.url === source.url) === index)
    .slice(0, 10);

const enrichWithGemini = async ({ company, role, jobDescription, count, candidates, difficulty }) => {
  if (!process.env.GEMINI_API_KEY) {
    return { selected: [], sources: [], status: "disabled" };
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const timeoutMs = Number(process.env.GEMINI_TIMEOUT_MS || 60000);
  const candidateData = candidates.map(({ id, title, difficulty: level, tags, companies, description }) => ({
    id,
    title,
    difficulty: level,
    tags,
    companies,
    description: String(description || "").slice(0, 180),
  }));
  const prompt = `You are an interview-preparation researcher. Use Google Search grounding to find recent, credible reports about ${company} coding interviews for the ${role} role. Prefer recent first-party or clearly sourced reports, but do not state that a question is guaranteed.

User context:
${jobDescription || "No job description supplied"}
Preferred difficulty: ${difficulty || "any"}

Choose at most ${count} items ONLY from this database candidate list. Never invent IDs, titles, URLs, or questions. Return only valid JSON:
{"selected":[{"id":"exact candidate id","relevance":0,"reason":"short explanation tied to evidence or role","evidenceStatus":"verified|predicted|unverified"}],"summary":"short caveat about the research","sources":[{"title":"source title","url":"https://..."}]}
Use evidenceStatus=verified only when the source directly supports a company-specific claim.

Database candidate list (the only questions you may select):
${JSON.stringify(candidateData)}`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        tools: [{ google_search: {} }],
        generationConfig: { temperature: 0.2 },
      },
      {
        headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
        timeout: Number.isFinite(timeoutMs) ? Math.min(Math.max(timeoutMs, 10000), 120000) : 60000,
      }
    );
    const body = parseJsonObject(extractGeminiText(response.data));
    const validIds = new Set(candidates.map(({ id }) => id));
    const selected = Array.isArray(body.selected)
      ? body.selected.filter((item) => validIds.has(item.id)).slice(0, count)
      : [];
    const responseSources = Array.isArray(body.sources)
      ? body.sources.filter((source) => typeof source?.url === "string").slice(0, 10)
      : [];
    return {
      selected,
      sources: responseSources.length ? responseSources : getGroundingSources(response.data?.candidates?.[0]?.groundingMetadata),
      summary: typeof body.summary === "string" ? body.summary.slice(0, 500) : "",
      status: selected.length ? "grounded" : "unavailable",
      reason: selected.length ? null : "Gemini returned no valid database question IDs.",
    };
  } catch (error) {
    const providerMessage = error.response?.data?.error?.message || error.message;
    console.error("Gemini company research failed:", error.response?.data || error.message);
    return {
      selected: [],
      sources: [],
      status: "unavailable",
      reason: providerMessage.slice(0, 300),
      summary: "Live Gemini research was unavailable; deterministic ranking was used.",
    };
  }
};

export const generatePrepPlan = async (req, res) => {
  const { company, role, jobDescription = "", interviewDate = null, questionCount = 10, dailyMinutes = null, difficulty = null } = req.body || {};
  const count = Number(questionCount);
  const minutes = dailyMinutes === null || dailyMinutes === "" ? null : Number(dailyMinutes);
  if (typeof company !== "string" || company.trim().length < 2 || typeof role !== "string" || role.trim().length < 2) {
    return res.status(400).json({ error: "Company and role must be provided." });
  }
  if (!Number.isInteger(count) || count < 1 || count > 50 || (minutes !== null && (!Number.isInteger(minutes) || minutes < 10 || minutes > 720))) {
    return res.status(400).json({ error: "Question count or daily preparation time is invalid." });
  }
  if (interviewDate && Number.isNaN(new Date(interviewDate).getTime())) {
    return res.status(400).json({ error: "Interview date is invalid." });
  }
  if (interviewDate && new Date(interviewDate).getTime() < Date.now()) {
    return res.status(400).json({ error: "Interview date must be in the future." });
  }
  if (difficulty && !["EASY", "MEDIUM", "HARD"].includes(difficulty)) {
    return res.status(400).json({ error: "Difficulty is invalid." });
  }

  try {
    const signals = extractSignals(company, role, jobDescription);
    const problems = await db.problem.findMany({
      include: { solvedBy: { where: { userId: req.user.id }, select: { id: true } } },
    });
    const ranked = problems
      .map((problem) => scoreProblem(problem, signals, company, difficulty))
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
    const gemini = await enrichWithGemini({
      company, role, jobDescription, count, difficulty,
      candidates: ranked.slice(0, 60),
    });
    const selectedById = new Map(ranked.map((problem) => [problem.id, problem]));
    const aiSelected = gemini.selected
      .map((item) => selectedById.get(item.id))
      .filter(Boolean);
    const selected = aiSelected.length >= Math.min(3, count)
      ? [...aiSelected, ...selectDiverse(ranked.filter((problem) => !aiSelected.some((item) => item.id === problem.id)), count - aiSelected.length)]
      : selectDiverse(ranked, count);
    const aiDetails = new Map(gemini.selected.map((item) => [item.id, item]));
    const recommendations = selected.slice(0, count).map(({ id, title, difficulty: level, tags, problemNumber, solvedBy, score, matchedTopics, matchedSkills, companyMatch }) => ({
      id, title, difficulty: level, tags, problemNumber, solved: solvedBy.length > 0, score,
      priority: score >= 70 ? "High" : score >= 45 ? "Medium" : "Foundational",
      reason: aiDetails.get(id)?.reason || (companyMatch ? `Tagged for ${company}; also matches ${matchedTopics.join(", ") || "your preparation context"}.` : `Matches ${matchedTopics.join(", ") || "your role and preparation context"}${matchedSkills.length ? ` through ${matchedSkills.join(", ")}` : ""}.`),
      evidenceStatus: aiDetails.get(id)?.evidenceStatus || (companyMatch ? "unverified" : "predicted"),
    }));
    const research = {
      provider: gemini.status === "grounded" ? "Gemini with Google Search grounding" : "Deterministic ranking",
      status: gemini.status,
      summary: gemini.summary || "Company tags come from the existing problem database; other matches are heuristic predictions.",
      sources: gemini.sources,
      reason: gemini.reason || null,
      retrievedAt: new Date().toISOString(),
    };
    const plan = await db.prepPlan.create({
      data: {
        userId: req.user.id, company: company.trim(), role: role.trim(), jobDescription: jobDescription.trim() || null,
        interviewDate: interviewDate ? new Date(interviewDate) : null, questionCount: count, dailyMinutes: minutes,
        difficulty: difficulty || null, topics: signals.topics, skills: signals.skills, recommendations,
      },
    });
    return res.status(201).json({
      plan: { ...plan, schedule: buildSchedule(recommendations, interviewDate, minutes), research },
      evidence: research,
    });
  } catch (error) {
    console.error("Error generating company prep plan:", error);
    return res.status(500).json({ error: "Unable to generate a preparation plan." });
  }
};

export const getPrepPlans = async (req, res) => {
  try {
    const plans = await db.prepPlan.findMany({ where: { userId: req.user.id }, orderBy: { createdAt: "desc" }, take: 10 });
    return res.status(200).json({ plans });
  } catch (error) {
    console.error("Error fetching company prep plans:", error);
    return res.status(500).json({ error: "Unable to fetch preparation plans." });
  }
};

export const deletePrepPlan = async (req, res) => {
  try {
    const result = await db.prepPlan.deleteMany({ where: { id: req.params.id, userId: req.user.id } });
    if (!result.count) return res.status(404).json({ error: "Preparation plan not found." });
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting company prep plan:", error);
    return res.status(500).json({ error: "Unable to delete preparation plan." });
  }
};
