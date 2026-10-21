import { db } from "../src/libs/db.js";
try {
  const records = await db.problem.findMany({
    where: { title: { in: [
      "Sum of Subarray Ranges", "Remove K Digits", "Largest Rectangle in Histogram", "Maximal Rectangle", "Sliding Window Maximum", "Stock Span Problem", "Celebrity Problem", "LRU Cache", "LFU Cache", "Longest Substring Without Repeating Characters", "Max Consecutive Ones III", "Fruit Into Baskets", "Longest Repeating Character Replacement", "Binary Subarrays With Sum", "Count Number of Nice Subarrays", "Number of Substrings Containing All Three Characters", "Maximum Points You Can Obtain from Cards", "Longest Substring With At Most K Distinct Characters", "Subarrays with K Different Integers", "Minimum Window Substring", "Minimum Window Subsequence", "Implement Min Heap", "Check if an Array Represents a Min Heap", "Convert Min Heap to Max Heap", "K-th Largest Element in an Array", "K-th Smallest Element in an Array", "Sort a K-Sorted Array", "Merge K Sorted Lists", "Replace Elements by Their Rank", "Task Scheduler", "Hand of Straights", "Design Twitter", "Minimum Cost to Connect Sticks", "K-th Largest Element in a Stream", "Maximum Sum Combination", "Find Median from Data Stream", "Top K Frequent Elements", "Assign Cookies", "Fractional Knapsack", "Lemonade Change", "Valid Parenthesis String Checker", "N Meetings in One Room", "Jump Game I", "Jump Game II", "Minimum Platforms", "Job Sequencing Problem", "Candy", "Shortest Job First", "LRU Page Replacement Algorithm", "Insert Interval"
    ] } },
    orderBy: { problemNumber: "asc" },
    select: { problemNumber: true, title: true, testcases: true, codeSnippets: true }
  });
  const summary = {
    count: records.length,
    first: records[0]?.problemNumber,
    last: records.at(-1)?.problemNumber,
    allHaveThreeCases: records.every(p => Array.isArray(p.testcases) && p.testcases.length === 3),
    allHaveFiveTemplates: records.every(p => Object.keys(p.codeSnippets ?? {}).length === 5),
    records: records.map(p => [p.problemNumber, p.title])
  };
  console.log(JSON.stringify(summary, null, 2));
} finally { await db.$disconnect(); }
