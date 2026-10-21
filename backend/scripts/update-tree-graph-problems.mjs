import { db } from "../src/libs/db.js";
import { nodeScaffold } from "./tree-graph-scaffolds.mjs";
import { problemVisualization } from "./tree-graph-visuals.mjs";

const languages = ["JAVASCRIPT", "PYTHON", "JAVA", "C", "CPP"];
const treeGraphTags = ["Tree", "Trees", "Binary Tree", "Binary Search Tree", "Graph", "Graphs"];

function addNodeTypes(problem, language, source = "") {
  if (!problem.tags.some(tag => /tree|graph/i.test(tag))) return source;
  if (source.includes("class TreeNode") || source.includes("typedef struct TreeNode") || source.includes("struct TreeNode")) return source;
  const scaffold = nodeScaffold(language);
  if (language === "JAVA") {
    return source.includes("class Main")
      ? source.replace("class Main {", scaffold + "\nclass Main {")
      : scaffold + "\n" + source;
  }
  return scaffold + "\n" + source;
}

try {
  const problems = await db.problem.findMany({
    where: { OR: treeGraphTags.map(tag => ({ tags: { has: tag } })) },
    select: { id: true, title: true, tags: true, testcases: true, examples: true, codeSnippets: true },
    orderBy: { problemNumber: "asc" },
  });
  let testcaseCount = 0;
  let visualCount = 0;
  for (const problem of problems) {
    const testcases = (Array.isArray(problem.testcases) ? problem.testcases : []).map((testcase) => {
      const visualization = problemVisualization(problem.title, testcase.input || "", testcase.output || "");
      testcaseCount += 1;
      if (visualization) visualCount += 1;
      return { ...testcase, visualization };
    });
    const codeSnippets = Object.fromEntries(languages.map(language => [
      language,
      addNodeTypes(problem, language, problem.codeSnippets?.[language] || ""),
    ]));
    const examples = testcases.map(testcase => ({
      input: testcase.displayInput || testcase.input,
      output: testcase.output,
      explanation: testcase.explanation || "",
      visualization: testcase.visualization || null,
    }));
    await db.problem.update({
      where: { id: problem.id },
      data: { testcases, examples, codeSnippets },
    });
  }
  console.log("Updated " + problems.length + " tree/graph problems; added visuals to " + visualCount + "/" + testcaseCount + " test cases and node types to five language templates.");
} finally {
  await db.$disconnect();
}
