import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "../src/generated/prisma/index.js";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.resolve(scriptDir, "..");
const snapshotPath = path.join(backendDir, "prisma", "data", "company-tags.json");
const sourceRootArg = process.argv.slice(2).find((arg) => !arg.startsWith("--"));
const applySnapshot = process.argv.includes("--apply");
const verifyOnly = process.argv.includes("--verify");
const unmatchedOffset = Number(process.argv.find((arg) => arg.startsWith("--unmatched-offset="))?.split("=")[1] || 0);
const unmatchedLimit = Number(process.argv.find((arg) => arg.startsWith("--unmatched-limit="))?.split("=")[1] || 80);
const sourceRoot = sourceRootArg ? path.resolve(sourceRootArg) : null;
const db = new PrismaClient();

const canonicalNames = {
  facebook: "Meta",
  meta: "Meta",
  twitter: "X",
  x: "X",
  square: "Block",
  block: "Block",
  "jp-morgan": "JPMorgan Chase",
  jpmorgan: "JPMorgan Chase",
  "jpmorgan-chase": "JPMorgan Chase",
  "goldman-sachs": "Goldman Sachs",
  "morgan-stanley": "Morgan Stanley",
  "bank-of-america": "Bank of America",
  "d-e-shaw": "D. E. Shaw",
  "de-shaw": "D. E. Shaw",
  "tiktok": "TikTok",
  "bytedance": "ByteDance",
  "paypal": "PayPal",
  "ebay": "eBay",
  "linkedin": "LinkedIn",
  "doordash": "DoorDash",
  "redfin": "Redfin",
  "vmware": "VMware",
  "walmart": "Walmart",
  "att": "AT&T",
  "hbo": "HBO",
  "c3-ai": "C3 AI",
  phonepe: "PhonePe",
  servicenow: "ServiceNow",
  hpe: "HPE",
};

const reviewedTitleAliases = {
  "2 sum": "Two Sum",
  "find missing number": "Missing Number",
  "find the number that appears once": "Single Number",
  "sort an array of 0s 1s and 2s": "Sort Colors",
  "majority element n 2": "Majority Element",
  "kadane s algorithm maximum subarray sum": "Maximum Subarray",
  "count subarrays with sum k": "Subarray Sum Equals K",
  "stock buy and sell": "Best Time to Buy and Sell Stock",
  "rotate matrix by 90 degrees": "Rotate Image",
  "print matrix in spiral manner": "Spiral Matrix",
  "3 sum": "3Sum",
  "4 sum": "4Sum",
  "majority element ii n 3": "Majority Element II",
  "merge overlapping intervals": "Merge Intervals",
  "first and last occurrence": "Find First and Last Position of Element in Sorted Array",
  "minimum days to make m bouquets": "Minimum Number of Days to Make m Bouquets",
  "find peak element in a 2d matrix": "Find a Peak Element II",
  "check if two strings are anagrams": "Valid Anagram",
  "maximum nesting depth of parentheses": "Maximum Nesting Depth of the Parentheses",
  "count substrings with exactly k distinct characters": "Substrings with K Distinct Characters",
  "reverse each word in a string": "Reverse Words in a String III",
  "middle of a linked list": "Middle of the Linked List",
  "reverse a linked list iteratively": "Reverse Linked List",
  "detect a cycle in a linked list": "Linked List Cycle",
  "find the starting point of a linked list cycle": "Linked List Cycle II",
  "remove nth node from the end": "Remove Nth Node From End of List",
  "reverse a linked list recursively": "Reverse Linked List",
  "sort a linked list": "Sort List",
  "intersection point of two linked lists": "Intersection of Two Linked Lists",
  "add one to a number represented by a linked list": "Plus One Linked List",
  "add two numbers represented by linked lists": "Add Two Numbers",
  "rotate a linked list": "Rotate List",
  "flatten a list of sorted linked lists": "Merge k Sorted Lists",
  "clone a linked list with random pointer": "Copy List with Random Pointer",
  "recursive string to integer atoi": "String to Integer (atoi)",
  "power set": "Subsets",
  "subsets i": "Subsets",
  "n queens count solutions": "N-Queens II",
  "count set bits": "Number of 1 Bits",
  "power set using bit manipulation": "Subsets",
  "divide two integers without multiplication or division": "Divide Two Integers",
  "minimum bit flips to convert a number": "Minimum Bit Flips to Convert Number",
  "single number i": "Single Number",
  "count primes in a range": "Count Primes",
  "count prime numbers up to n": "Count Primes",
  "balanced parentheses": "Valid Parentheses",
  "implement min stack": "Min Stack",
  "next greater element": "Next Greater Element I",
  "stock span problem": "Online Stock Span",
  "k th largest element in an array": "Kth Largest Element in an Array",
  "k th largest element in a stream": "Kth Largest Element in a Stream",
  "valid parenthesis string checker": "Valid Parenthesis String",
  "jump game i": "Jump Game",
  "preorder traversal of binary tree": "Binary Tree Preorder Traversal",
  "inorder traversal of binary tree": "Binary Tree Inorder Traversal",
  "postorder traversal of binary tree": "Binary Tree Postorder Traversal",
  "level order traversal": "Binary Tree Level Order Traversal",
  "iterative preorder traversal of binary tree": "Binary Tree Preorder Traversal",
  "iterative inorder traversal of binary tree": "Binary Tree Inorder Traversal",
  "postorder traversal using two stacks": "Binary Tree Postorder Traversal",
  "postorder traversal using one stack": "Binary Tree Postorder Traversal",
  "preorder inorder and postorder traversals in one traversal": "Binary Tree Preorder Traversal",
  "check for balanced binary tree": "Balanced Binary Tree",
  "maximum path sum in binary tree": "Binary Tree Maximum Path Sum",
  "check if two binary trees are identical": "Same Tree",
  "zigzag level order traversal": "Binary Tree Zigzag Level Order Traversal",
  "vertical order traversal of binary tree": "Binary Tree Vertical Order Traversal",
  "right and left view of binary tree": "Binary Tree Right Side View",
  "symmetric binary tree": "Symmetric Tree",
  "root to leaf paths in binary tree": "Binary Tree Paths",
  "lowest common ancestor in binary tree": "Lowest Common Ancestor of a Binary Tree",
  "nodes at distance k in binary tree": "All Nodes Distance K in Binary Tree",
  "count nodes in a complete binary tree": "Count Complete Tree Nodes",
  "lowest common ancestor in a bst": "Lowest Common Ancestor of a Binary Search Tree",
  "construct a bst from preorder traversal": "Construct Binary Search Tree from Preorder Traversal",
  "inorder successor and predecessor in bst": "Inorder Successor in BST",
  "two sum in a bst": "Two Sum IV - Input is a BST",
  "recover bst with two nodes swapped": "Recover Binary Search Tree",
  "largest bst in a binary tree": "Largest BST Subtree",
  "connected components in a matrix": "Number of Islands",
  "rotten oranges": "Rotting Oranges",
  "01 matrix distance to nearest zero": "01 Matrix",
  "bipartite graph check using bfs": "Is Graph Bipartite",
  "bipartite graph check using dfs": "Is Graph Bipartite",
  "detect a cycle in a directed graph": "Course Schedule",
  "topological sort using dfs": "Course Schedule II",
  "topological sort using kahn s algorithm": "Course Schedule II",
  "course schedule i": "Course Schedule",
  "word ladder i": "Word Ladder",
  "shortest distance in a binary maze": "Shortest Path in Binary Matrix",
  "city with the fewest neighbors within threshold": "Find the City With the Smallest Number of Neighbors at a Threshold Distance",
  "bridges in a graph": "Critical Connections in a Network",
  "maximum sum of non adjacent elements": "House Robber",
  "grid unique paths": "Unique Paths",
  "minimum path sum in grid": "Minimum Path Sum",
  "triangle minimum path sum": "Triangle",
  "ninja and his friends": "Cherry Pickup II",
  "subset sum equal to target": "Partition Equal Subset Sum",
  "partition set into two subsets with minimum difference": "Last Stone Weight II",
  "count partitions with given difference": "Target Sum",
  "minimum coins": "Coin Change",
  "unbounded knapsack": "Coin Change II",
  "print longest common subsequence": "Longest Common Subsequence",
  "minimum insertions to make a string a palindrome": "Minimum Insertion Steps to Make a String Palindrome",
  "minimum insertions and deletions to convert string a to b": "Delete Operation for Two Strings",
  "print longest increasing subsequence": "Longest Increasing Subsequence",
  "longest increasing subsequence using binary search": "Longest Increasing Subsequence",
  "number of longest increasing subsequences": "Number of Longest Increasing Subsequence",
  "power of two": "Power of Two",
  "reverse an integer": "Reverse Integer",
  "implement trie insert search and prefix check": "Implement Trie (Prefix Tree)",
  "trie implementation and advanced operations": "Implement Trie (Prefix Tree)",
  "longest word with all prefixes present": "Longest Word With All Prefixes",
  "maximum xor with an element from an array": "Maximum XOR With an Element From Array",
  "shortest palindrome by prepending characters": "Shortest Palindrome",
  "convert sorted array to bst": "Convert Sorted Array to Binary Search Tree",
  "find the repeating and missing number": "Set Mismatch",
  "count occurrences in sorted array": "Find First and Last Position of Element in Sorted Array",
  "search in rotated sorted array i": "Search in Rotated Sorted Array",
  "find rotation count": "Find Minimum in Rotated Sorted Array",
  "square root of a number": "Sqrt(x)",
  "smallest divisor given a threshold": "Find the Smallest Divisor Given a Threshold",
  "aggressive cows": "Magnetic Force Between Two Balls",
  "book allocation": "Split Array Largest Sum",
  "painter s partition": "Split Array Largest Sum",
  "check if a number is a power of two": "Power of Two",
  "morris preorder traversal": "Binary Tree Preorder Traversal",
  "morris inorder traversal": "Binary Tree Inorder Traversal",
  "floor and ceil in a bst": "Closest Nodes Queries in a Binary Search Tree",
  "insert a node into a binary search tree": "Insert into a Binary Search Tree",
  "delete a node from a binary search tree": "Delete Node in a BST",
  "k th smallest and largest element in a bst": "Kth Smallest Element in a BST",
  "check if a binary tree is a bst": "Validate Binary Search Tree",
  "merge two bsts": "All Elements in Two Binary Search Trees",
  "fibonacci number using recursion": "Fibonacci Number",
  "reverse a string": "Reverse String",
  "move zeros to end": "Move Zeroes",
  "maximum consecutive ones": "Max Consecutive Ones",
  "implement lower bound": "Search Insert Position",
  "merge two sorted arrays without extra space": "Merge Sorted Array",
  "print subarray with maximum sum": "Maximum Subarray",
};

const parseCsvLine = (line) => {
  const values = [];
  let value = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"' && line[index + 1] === '"' && inQuotes) {
      value += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      values.push(value);
      value = "";
    } else {
      value += char;
    }
  }

  values.push(value);
  return values;
};

const normalizeTitle = (title) =>
  title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const formatCompanyName = (slug) => {
  const key = slug.toLowerCase();
  if (canonicalNames[key]) return canonicalNames[key];

  return slug
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => (part.length <= 3 ? part.toUpperCase() : part[0].toUpperCase() + part.slice(1)))
    .join(" ");
};

const writeSnapshotFromSource = async (problems) => {
  if (!sourceRoot) return null;

  const titleToCompanies = new Map();
  const companyDirs = await readdir(sourceRoot, { withFileTypes: true });
  let csvCount = 0;

  for (const entry of companyDirs) {
    if (!entry.isDirectory()) continue;
    const csvPath = path.join(sourceRoot, entry.name, "all.csv");
    let csvText;
    try {
      csvText = await readFile(csvPath, "utf8");
    } catch {
      continue;
    }

    csvCount += 1;
    const lines = csvText.split(/\r?\n/).filter(Boolean);
    const headers = parseCsvLine(lines[0] || "");
    const titleColumn = headers.findIndex((header) => header.trim().toLowerCase() === "title");
    if (titleColumn < 0) continue;

    const company = formatCompanyName(entry.name);
    for (const line of lines.slice(1)) {
      const title = parseCsvLine(line)[titleColumn]?.trim();
      if (!title) continue;
      const normalized = normalizeTitle(title);
      if (!normalized) continue;
      if (!titleToCompanies.has(normalized)) titleToCompanies.set(normalized, new Set());
      titleToCompanies.get(normalized).add(company);
    }
  }

  const companiesByProblemNumber = {};
  const sourceTitlesByProblemNumber = {};
  const matchedCompanyCounts = new Map();
  const matchedProblems = [];

  for (const problem of problems) {
    const problemTitle = normalizeTitle(problem.title);
    const matchedTitle = titleToCompanies.has(problemTitle)
      ? problemTitle
      : normalizeTitle(reviewedTitleAliases[problemTitle] || "");
    const matches = titleToCompanies.get(matchedTitle);
    if (!matches?.size) continue;
    const companies = [...matches].sort((a, b) => a.localeCompare(b));
    companiesByProblemNumber[problem.problemNumber] = companies;
    sourceTitlesByProblemNumber[problem.problemNumber] = matchedTitle;
    matchedProblems.push(problem);
    for (const company of companies) {
      matchedCompanyCounts.set(company, (matchedCompanyCounts.get(company) || 0) + 1);
    }
  }

  const snapshot = {
    source: "https://github.com/snehasishroy/leetcode-companywise-interview-questions",
    sourceSnapshot: "12 July 2026",
    matching: "Normalized exact title match plus reviewed aliases for standard equivalent problem titles",
    generatedAt: new Date().toISOString(),
    totalProblems: problems.length,
    matchedProblems: matchedProblems.length,
    sourceCompanyLists: csvCount,
    companiesByProblemNumber,
    sourceTitlesByProblemNumber,
  };

  await mkdir(path.dirname(snapshotPath), { recursive: true });
  await writeFile(snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");

  const sortedCounts = [...matchedCompanyCounts.entries()].sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
  );
  console.log(
    JSON.stringify(
      {
        totalProblems: problems.length,
        matchedProblems: matchedProblems.length,
        unmatchedProblems: problems.length - matchedProblems.length,
        sourceCompanyLists: csvCount,
        companiesWithMatches: matchedCompanyCounts.size,
        unmatchedTitles: problems
          .filter((problem) => !companiesByProblemNumber[problem.problemNumber])
          .slice(unmatchedOffset, unmatchedOffset + unmatchedLimit)
          .map(({ problemNumber, title }) => ({ problemNumber, title })),
        topCompanies: sortedCounts.slice(0, 40).map(([company, count]) => ({ company, count })),
        snapshotPath,
      },
      null,
      2
    )
  );

  return snapshot;
};

try {
  if (verifyOnly) {
    const rows = await db.problem.findMany({
      select: { problemNumber: true, companies: true },
      orderBy: { problemNumber: "asc" },
    });
    const taggedRows = rows.filter(({ companies }) => companies.length > 0);
    const companyCounts = new Map();
    taggedRows.forEach(({ companies }) => {
      companies.forEach((company) => companyCounts.set(company, (companyCounts.get(company) || 0) + 1));
    });
    console.log(JSON.stringify({
      totalProblems: rows.length,
      taggedProblems: taggedRows.length,
      untaggedProblems: rows.length - taggedRows.length,
      distinctCompanies: companyCounts.size,
      topCompanies: [...companyCounts.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, 10)
        .map(([company, problemCount]) => ({ company, problemCount })),
    }, null, 2));
  } else {
  const problems = await db.problem.findMany({
    select: { problemNumber: true, title: true },
    orderBy: { problemNumber: "asc" },
  });

  if (sourceRoot) await writeSnapshotFromSource(problems);
  if (!applySnapshot) {
    if (!sourceRoot) {
      console.log("Dry run only. Pass a company data directory, and --apply to sync the saved snapshot to the database.");
    }
    process.exitCode = 0;
  } else {
    const snapshot = JSON.parse(await readFile(snapshotPath, "utf8"));
    const updates = Object.entries(snapshot.companiesByProblemNumber);
    for (const [problemNumber, companies] of updates) {
      await db.problem.update({
        where: { problemNumber: Number(problemNumber) },
        data: { companies },
      });
    }
    console.log(`Applied company tags to ${updates.length} problems.`);
  }
  }
} catch (error) {
  console.error("Could not sync company tags:", error);
  process.exitCode = 1;
} finally {
  await db.$disconnect();
}
