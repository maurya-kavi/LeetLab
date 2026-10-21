import { db } from "../src/libs/db.js";

const rows = [];
const P = (title, difficulty, tags, task, constraints, hint, format, cases) =>
  rows.push({ title, difficulty, tags, task, constraints, hint, format, cases });

P("Clone Graph", "MEDIUM", ["Graph", "DFS", "BFS"], "Given an undirected graph and a start node, create a deep copy of the component reachable from that node. Return its adjacency list with neighbors sorted by node number.", "1 <= n <= 100000; 0 <= m <= 200000; nodes are numbered 1..n; no self-loops or duplicate edges.", "Keep a map from each original node to its clone and create a clone the first time you visit a neighbor.", "Input: n m start, followed by m undirected edges. Output one line per reachable node as id:neighbor,neighbor; an isolated node is printed as id:.", [
  ["4 3 1 1 2 2 3 3 4", "1:2\n2:1,3\n3:2,4\n4:3", "a four-node chain starting at node 1", "The cloned component has the same edges and node labels."],
  ["3 3 1 1 2 1 3 2 3", "1:2,3\n2:1,3\n3:1,2", "three nodes connected as a triangle", "Every cloned node has the same two neighbors."],
  ["1 0 1", "1:", "one node with no edges", "The isolated start node is still cloned."]
]);

P("Graph Valid Tree", "MEDIUM", ["Graph", "DFS", "Union Find"], "Determine whether an undirected graph forms a tree: it must be connected and contain no cycle.", "1 <= n <= 100000; 0 <= m <= 200000; vertices are 0..n-1; no duplicate edges or self-loops.", "A graph is a tree exactly when it is connected and has n-1 edges.", "Input: n m followed by m undirected edges. Output true or false.", [
  ["5 4 0 1 0 2 0 3 1 4", "true", "five vertices joined with four edges", "The graph is connected and has no cycle."],
  ["5 5 0 1 1 2 2 3 1 3 1 4", "false", "the edges include a cycle among vertices 1, 2, and 3", "A tree cannot contain a cycle."],
  ["4 2 0 1 2 3", "false", "two disconnected components", "The graph is not connected."]
]);

P("Pacific Atlantic Water Flow", "MEDIUM", ["Matrix", "DFS", "Breadth First Search"], "In a height grid, water can flow to a neighboring cell of equal or lower height. Return all cells from which water can reach both the top/left Pacific edges and the bottom/right Atlantic edges, sorted by row then column.", "1 <= rows, cols <= 200; 0 <= heights[r][c] <= 10^9.", "Search outward from each ocean in reverse: move from a cell to neighbors that are at least as high.", "Input: rows cols followed by the grid. Output qualifying zero-based row column pairs, one per line.", [
  ["3 3 1 2 2 3 2 3 2 4 5", "0 2\n1 2\n2 1\n2 2", "a 3-by-3 height grid", "Each listed cell has a non-increasing route to both oceans."],
  ["2 2 1 2 4 3", "0 1\n1 0", "a 2-by-2 grid", "The top-right and bottom-left cells touch both ocean-reachable regions."],
  ["1 1 7", "0 0", "a single cell", "The only cell touches both oceans."]
]);

P("Reconstruct Itinerary", "HARD", ["Graph", "DFS", "Eulerian Path"], "Use every flight ticket exactly once to build an itinerary starting at JFK. If multiple itineraries are possible, return the lexicographically smallest airport sequence.", "0 <= tickets <= 10000; airport codes are three uppercase letters; at least one valid itinerary exists.", "Sort each airport's outgoing destinations in reverse lexical order and run Hierholzer's algorithm.", "Input: n followed by n ticket pairs. Output the airport sequence separated by spaces.", [
  ["5 JFK SFO JFK ATL SFO ATL ATL JFK ATL SFO", "JFK ATL JFK SFO ATL SFO", "the standard five-ticket example", "Taking the smallest available valid route uses every ticket once."],
  ["2 JFK KUL JFK NRT", "JFK NRT JFK KUL", "two flights leave JFK", "The route through NRT must be used first so the KUL ticket is not stranded."],
  ["0", "JFK", "there are no tickets", "The itinerary contains only the required starting airport."]
]);

P("Reorder List", "MEDIUM", ["Linked List", "Two Pointers"], "Reorder a list in-place as L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 and so on.", "0 <= n <= 200000; values are signed 32-bit integers.", "Find the middle, reverse the second half, then interleave the two halves.", "Input: n followed by n list values. Output the reordered values, or EMPTY for an empty list.", [
  ["4 1 2 3 4", "1 4 2 3", "the list 1 -> 2 -> 3 -> 4", "Alternating from the front and back gives 1, 4, 2, 3."],
  ["5 1 2 3 4 5", "1 5 2 4 3", "a five-node list", "The middle node remains last after the outer pairs are interleaved."],
  ["1 9", "9", "a one-node list", "A one-node list is already in the requested order."]
]);

P("Merge Two Sorted Lists", "EASY", ["Linked List", "Recursion", "Two Pointers"], "Merge two ascending linked lists into one ascending list by reusing their nodes.", "0 <= n,m <= 200000; values are signed 32-bit integers; each input list is sorted.", "At each step append the smaller current node, then attach the remaining suffix.", "Input: n m, followed by the n values and then the m values. Output merged values, or EMPTY if both are empty.", [
  ["3 3 1 2 4 1 3 4", "1 1 2 3 4 4", "lists [1,2,4] and [1,3,4]", "The merged values stay in non-decreasing order."],
  ["0 3 2 5 8", "2 5 8", "the first list is empty", "The second list is already the complete result."],
  ["0 0", "EMPTY", "both lists are empty", "There are no nodes to return."]
]);

P("Reverse Linked List II", "MEDIUM", ["Linked List", "Two Pointers"], "Reverse the nodes from position left through position right, using 1-based positions, and leave all other nodes in place.", "1 <= n <= 200000; 1 <= left <= right <= n.", "Use a pointer before the range and repeatedly move the next node to the front of the range.", "Input: n left right followed by n list values. Output the resulting list values.", [
  ["5 2 4 1 2 3 4 5", "1 4 3 2 5", "reverse positions 2 through 4", "Only the selected middle segment is reversed."],
  ["1 1 1 7", "7", "the range contains the only node", "Reversing a one-node segment changes nothing."],
  ["5 1 5 1 2 3 4 5", "5 4 3 2 1", "reverse the entire list", "Every node appears in reverse order."]
]);

P("Swap Nodes in Pairs", "MEDIUM", ["Linked List", "Recursion"], "Swap every adjacent pair of nodes in a linked list. Do not swap the values stored in the nodes.", "0 <= n <= 200000; values are signed 32-bit integers.", "For each pair, relink the second node before the first and continue with the remaining suffix.", "Input: n followed by n list values. Output the swapped list, or EMPTY if it is empty.", [
  ["4 1 2 3 4", "2 1 4 3", "four nodes", "Each adjacent pair exchanges positions."],
  ["5 1 2 3 4 5", "2 1 4 3 5", "an odd number of nodes", "The final unpaired node stays in place."],
  ["0", "EMPTY", "an empty list", "There are no pairs to swap."]
]);

P("Add Two Numbers II", "MEDIUM", ["Linked List", "Math", "Stack"], "Each linked list stores a non-negative integer with the most significant digit first. Return a list representing their sum, also in forward order.", "1 <= each list length <= 100000; digits are 0..9; inputs have no leading zero unless the value is zero.", "Add from the tails using stacks, carrying each digit into the next position to the left.", "Input: n followed by the first number's digits, then m followed by the second number's digits. Output sum digits in forward order.", [
  ["4 7 2 4 3 3 5 6 4", "7 8 0 7", "7243 + 564", "The sum is 7807."],
  ["1 0 1 0", "0", "zero plus zero", "The result is represented by a single zero digit."],
  ["3 9 9 9 1 1", "1 0 0 0", "999 + 1", "The carry creates a new leading digit."]
]);

P("Remove Duplicates from Sorted List II", "MEDIUM", ["Linked List", "Two Pointers"], "Given a sorted linked list, remove every value that appears more than once, leaving only values that appeared exactly once.", "0 <= n <= 200000; values are signed 32-bit integers; the input list is sorted.", "Use a sentinel node and skip an entire run whenever its value occurs more than once.", "Input: n followed by n sorted values. Output the remaining values, or EMPTY if none remain.", [
  ["7 1 2 3 3 4 4 5", "1 2 5", "values 3 and 4 each occur twice", "Only values that occur exactly once remain."],
  ["5 1 1 1 2 3", "2 3", "the initial value occurs three times", "The duplicate run is removed completely."],
  ["4 1 1 2 2", "EMPTY", "every value is duplicated", "No value occurs exactly once."]
]);

P("Convert Sorted Array to BST", "EASY", ["Binary Tree", "Binary Search Tree", "Divide and Conquer"], "Build a height-balanced binary search tree from a strictly increasing array. When a range has two middle choices, use the lower middle. Return level-order values with x for missing nodes and omit trailing x values.", "0 <= n <= 100000; values are strictly increasing and fit signed 32-bit integers.", "Choose the middle value as the subtree root and recursively build its left and right ranges.", "Input: n followed by the sorted values. Output the tree in level order, or EMPTY for an empty array.", [
  ["5 -10 -3 0 5 9", "0 -10 5 x -3 x 9", "five sorted values", "The lower middle value 0 is the root; each subtree is balanced."],
  ["3 1 2 3", "2 1 3", "three consecutive values", "The middle value becomes the root with one child on each side."],
  ["0", "EMPTY", "an empty array", "An empty array produces an empty tree."]
]);

P("Path Sum III", "MEDIUM", ["Binary Tree", "Depth First Search", "Prefix Sum"], "Count downward paths in a binary tree whose values sum to target. A path may start and end at any nodes, but must follow parent-to-child links.", "0 <= node count <= 2000; node values and target are signed 32-bit integers.", "Track prefix sums along the current root-to-node path and count how many earlier prefixes differ by target.", "Input: n target followed by n heap-indexed level-order tokens; x denotes a missing node. Output the number of paths.", [
  ["11 8 10 5 -3 3 2 x 11 3 -2 x 1", "3", "the standard tree rooted at 10 with target 8", "The matching paths are 5->3, 5->2->1, and -3->11."],
  ["1 5 1", "0", "a single node with value 1 and target 5", "No downward path reaches the target."],
  ["3 0 0 0 0", "5", "a three-node tree where all values are zero", "There are three single-node paths and two parent-child paths."]
]);

P("Populating Next Right Pointers in Each Node", "MEDIUM", ["Binary Tree", "Breadth First Search", "Linked List"], "For every node in a binary tree, set its next pointer to the node immediately to its right on the same level, or null if there is none. Output each level by following these next pointers, ending each line with #.", "0 <= node count <= 100000; node values are unique signed 32-bit integers.", "Traverse each level and connect its children in left-to-right order; a queue or constant-space level links can be used.", "Input: n followed by n heap-indexed level-order tokens; x denotes a missing node. Output each level's values followed by #.", [
  ["7 1 2 3 4 5 x 7", "1 #\n2 3 #\n4 5 7 #", "a tree with three levels", "Each row shows the nodes connected by their next pointers."],
  ["7 1 2 3 x 4 x 5", "1 #\n2 3 #\n4 5 #", "a tree whose last level has two nodes", "The two existing nodes are connected despite missing siblings."],
  ["1 9", "9 #", "a single-node tree", "The root has no node to its right."]
]);

P("Binary Tree Cameras", "HARD", ["Binary Tree", "Dynamic Programming", "Greedy"], "Place cameras on the fewest tree nodes so every node is monitored by a camera on itself, its parent, or one of its children.", "0 <= node count <= 1000; input is a binary tree with node values 0 or 1.", "Process nodes bottom-up and place a camera at a parent when a child is not covered.", "Input: n followed by n heap-indexed level-order tokens; x denotes a missing node. Output the minimum camera count.", [
  ["5 0 0 x 0 0", "1", "a root with a left child that has two children", "One camera on the left child covers itself, its parent, and both children."],
  ["8 0 0 x 0 x x x 0", "2", "a four-node chain represented with missing-child slots", "One camera covers the first three nodes and another covers the final leaf."],
  ["0", "0", "an empty tree", "No cameras are needed."]
]);

P("K Closest Points to Origin", "MEDIUM", ["Arrays", "Heap", "Sorting"], "Return the k points with the smallest squared Euclidean distance to the origin. Order results by distance, then x, then y.", "1 <= n <= 100000; 1 <= k <= n; coordinates are signed 32-bit integers.", "Use a size-k max-heap or sort by squared distance with the specified tie-breakers.", "Input: n k followed by n coordinate pairs. Output k points, one x y pair per line.", [
  ["4 2 1 3 -2 2 2 -1 0", "0 0\n2 -1", "four points, choosing two", "The origin is closest, followed by (2,-1) with squared distance 5."],
  ["3 2 1 0 -1 0 0 2", "-1 0\n1 0", "two points tie at distance 1", "Ties are ordered by x, then y."],
  ["2 2 3 4 1 1", "1 1\n3 4", "return both points", "The points are ordered from smaller to larger squared distance."]
]);

P("Find K Closest Elements", "MEDIUM", ["Arrays", "Binary Search", "Two Pointers"], "From a sorted array, return the k values closest to x in ascending order. Break equal-distance ties in favor of the smaller value.", "1 <= n <= 100000; 1 <= k <= n; the input array is sorted in non-decreasing order.", "Binary-search the left edge of a length-k window by comparing the values at its two ends to x.", "Input: n k x followed by n sorted values. Output the selected values in ascending order.", [
  ["5 4 3 1 2 3 4 5", "1 2 3 4", "choose four values closest to 3", "Values 2 and 4 tie in distance, so the smaller value is selected first."],
  ["5 4 -1 1 2 3 4 5", "1 2 3 4", "x is smaller than every array value", "The first four values are closest."],
  ["5 2 3 1 2 3 4 5", "2 3", "choose two values closest to 3", "Values 2 and 4 tie in distance, so the smaller value is selected."]
]);

P("Subarray Product Less Than K", "MEDIUM", ["Arrays", "Sliding Window"], "Count contiguous subarrays whose product is strictly less than k.", "1 <= n <= 100000; 1 <= nums[i] <= 1000; 0 <= k <= 10^9.", "Maintain a sliding window product; shrink the left edge while the product is at least k.", "Input: n k followed by n positive integers. Output the subarray count.", [
  ["4 100 10 5 2 6", "8", "nums=[10,5,2,6] and k=100", "Eight contiguous subarrays have product below 100."],
  ["3 0 1 2 3", "0", "k is zero", "A positive product cannot be below zero."],
  ["3 1 1 1 1", "0", "all values and k are 1", "No positive product is strictly less than 1."]
]);

P("Find All Duplicates in an Array", "MEDIUM", ["Arrays", "Hashing", "In-Place Algorithms"], "Return every value that appears twice in an array where each value is between 1 and n and appears once or twice. Sort the returned values ascending.", "1 <= n <= 200000; each value is in [1,n] and appears at most twice.", "Use a frequency table, or use the sign of the value at index abs(x)-1 to detect a repeat.", "Input: n followed by n integers. Output duplicate values in ascending order, or EMPTY if none exist.", [
  ["8 4 3 2 7 8 2 3 1", "2 3 8", "three values occur twice", "The repeated values sorted are 2, 3, and 8."],
  ["5 1 2 3 4 5", "EMPTY", "every value occurs once", "There are no duplicates."],
  ["4 2 2 1 1", "1 2", "two values each occur twice", "Both repeated values are returned in ascending order."]
]);

P("Meeting Rooms II", "MEDIUM", ["Intervals", "Heap", "Sorting"], "Given meeting intervals [start,end), return the minimum number of rooms required. Meetings that touch at an endpoint do not overlap.", "0 <= n <= 100000; 0 <= start < end <= 10^9.", "Sort meetings by start time and track the earliest room to become free in a min-heap.", "Input: n followed by n start end pairs. Output the minimum room count.", [
  ["3 0 30 5 10 15 20", "2", "three overlapping intervals", "At most two meetings overlap at the same time."],
  ["2 7 10 2 4", "1", "two non-overlapping meetings", "One room can host both meetings."],
  ["2 0 5 5 10", "1", "the first meeting ends when the next begins", "Half-open intervals do not overlap at their shared endpoint."]
]);

P("Minimum Number of Arrows to Burst Balloons", "MEDIUM", ["Intervals", "Greedy", "Sorting"], "Each balloon is an interval on the x-axis. An arrow shot at x bursts every balloon whose interval contains x. Return the minimum arrows needed.", "0 <= n <= 100000; interval endpoints are signed 32-bit integers; each start <= end.", "Sort by interval end and shoot an arrow at the earliest end not already covered.", "Input: n followed by n start end pairs. Output the minimum arrow count.", [
  ["4 10 16 2 8 1 6 7 12", "2", "the four standard overlapping intervals", "An arrow at 6 and another at 12 cover all balloons."],
  ["4 1 2 3 4 5 6 7 8", "4", "four disjoint intervals", "Each disjoint balloon needs its own arrow."],
  ["2 1 2 2 3", "1", "two intervals share endpoint 2", "An arrow at 2 bursts both balloons."]
]);

P("Text Justification", "HARD", ["Strings", "Greedy"], "Pack words into lines of maxWidth characters and distribute spaces so every non-final line has exactly maxWidth characters. The final line is left-justified; trailing padding on it may be omitted.", "1 <= words.length <= 300; 1 <= maxWidth <= 100; every word length <= maxWidth.", "Greedily fit the most words on each line, then spread extra spaces across its gaps from left to right.", "Input: n maxWidth followed by n words. Output one justified line per output line.", [
  ["7 16 This is an example of text justification.", "This    is    an\nexample  of text\njustification.", "the standard 16-character example", "Spaces are distributed evenly on full lines, with any extras on the left."],
  ["4 6 A B C DD", "A  B C\nDD", "short words with width 6", "The first line uses three spaces across its two gaps."],
  ["1 5 hello", "hello", "one word exactly fills the line", "A single word is left-justified."]
]);

P("Basic Calculator", "HARD", ["Strings", "Stack", "Recursion"], "Evaluate an arithmetic expression containing non-negative integers, +, -, parentheses, and spaces. Unary plus and minus are allowed.", "1 <= expression length <= 300000; the evaluated result fits signed 64-bit integer.", "Track the current number, sign, and accumulated result; save the outer result and sign when entering parentheses.", "Input: one expression line. Output its integer value.", [
  ["1-(2-(3+4))", "6", "nested parentheses and subtraction", "The inner expression is 7, so 1-(2-7)=6."],
  ["-(2+3)", "-5", "a unary minus before parentheses", "The sign applies to the entire parenthesized sum."],
  ["(7)-(0)+(2)", "9", "several parenthesized terms", "Evaluate each term and combine them left to right."]
]);

P("Simplify Path", "MEDIUM", ["Strings", "Stack"], "Convert an absolute Unix path to its canonical form. Repeated slashes and '.' are ignored; '..' moves up one directory when possible.", "1 <= path length <= 3000; path starts with '/'; directory names are non-empty tokens without slashes.", "Split on slashes and maintain a stack of directory names, popping it for '..'.", "Input: one absolute path token. Output its canonical absolute path.", [
  ["/home//foo/", "/home/foo", "repeated and trailing slashes", "Empty path components are ignored."],
  ["/a/./b/../../c/", "/c", "current-directory and parent-directory components", "The path returns to root before entering c."],
  ["/../", "/", "move to the parent of root", "The canonical path cannot move above root."]
]);

P("Reorganize String", "MEDIUM", ["Strings", "Heap", "Greedy"], "Rearrange lowercase letters so no equal letters are adjacent. At every step choose the available letter with highest remaining frequency, breaking ties alphabetically. Return -1 if no such arrangement exists.", "1 <= string length <= 100000; input contains lowercase English letters.", "Use a max-heap of remaining letter counts and hold the previously chosen letter out for one step.", "Input: one lowercase string. Output the deterministic rearrangement or -1.", [
  ["aab", "aba", "one letter repeats twice", "The repeated a characters are separated by b."],
  ["aaab", "-1", "a occurs three times and b once", "There are not enough other letters to separate every a."],
  ["vvvlo", "vlvov", "v is most frequent and l/o tie", "The heap picks l before o when their remaining counts tie."]
]);

P("Decode Ways", "MEDIUM", ["Strings", "Dynamic Programming"], "A digit string maps 1 to A through 26 to Z. Return the number of ways to decode the whole string; a leading zero or an invalid zero placement contributes no decoding.", "1 <= string length <= 100000; characters are digits; answer fits signed 64-bit integer.", "At each position, add the ways from a valid one-digit code and from a valid two-digit code.", "Input: one digit string. Output the number of decodings.", [
  ["12", "2", "12 can be decoded as AB or L", "There are two valid decodings."],
  ["226", "3", "226 can be decoded as BZ, VF, or BBF", "Single- and two-digit choices produce three decodings."],
  ["06", "0", "the string begins with zero", "Zero cannot be decoded by itself."]
]);

P("Combination Sum IV", "MEDIUM", ["Dynamic Programming", "Arrays"], "Count ordered sequences of the given distinct positive numbers whose sum is target. Different orders count as different sequences.", "1 <= number count <= 100; 1 <= nums[i] <= 1000; 0 <= target <= 1000; answer fits signed 64-bit integer.", "Let ways[s] be the count for sum s; append each available number to every sequence that forms a smaller sum.", "Input: n target followed by n distinct positive integers. Output the number of ordered combinations.", [
  ["3 4 1 2 3", "7", "nums=[1,2,3] and target=4", "There are seven ordered sequences that sum to 4."],
  ["3 0 1 2 3", "1", "target is zero", "The empty sequence is the single way to make zero."],
  ["2 3 9 10", "0", "all numbers exceed target", "No sequence can form a sum of 3."]
]);

P("Unique Binary Search Trees", "MEDIUM", ["Dynamic Programming", "Binary Search Tree"], "Given n distinct keys labeled 1 through n, count the structurally unique binary search trees that can be formed.", "0 <= n <= 19.", "Choose each key as the root and multiply the number of left-subtree shapes by the number of right-subtree shapes.", "Input: one integer n. Output the number of unique BST structures.", [
  ["3", "5", "three keys", "The five possible root and subtree arrangements are structurally distinct."],
  ["0", "1", "no keys", "The empty tree counts as one structure."],
  ["1", "1", "one key", "There is one possible tree."]
]);

P("Design Underground System", "MEDIUM", ["Design", "Hashing"], "Implement checkIn(id, station, time), checkOut(id, station, time), and getAverageTime(start, end). Return each requested average to five decimal places.", "1 <= operations <= 200000; passenger ids and times are integers; station names are tokens; check-in precedes check-out.", "Store each active passenger's start station and time, and maintain total duration and trip count per station pair.", "Input: q followed by checkIn id station time, checkOut id station time, or getAverageTime start end commands. Output each average on its own line with 5 decimals.", [
  ["6 checkIn 45 Leyton 3 checkIn 32 Paradise 8 checkOut 45 Waterloo 15 checkOut 32 Cambridge 22 getAverageTime Leyton Waterloo getAverageTime Paradise Cambridge", "12.00000\n14.00000", "two completed trips", "The trip durations are 12 and 14 minutes respectively."],
  ["3 checkIn 1 A 1 checkOut 1 B 6 getAverageTime A B", "5.00000", "one trip from A to B", "The passenger spent five time units on the trip."],
  ["5 checkIn 1 A 1 checkOut 1 B 6 checkIn 2 A 10 checkOut 2 B 20 getAverageTime A B", "7.50000", "two trips on the same route", "The average of durations 5 and 10 is 7.5."]
]);

P("Snapshot Array", "MEDIUM", ["Design", "Binary Search", "Hashing"], "Create an array of fixed length that supports set(index,value), snap(), and get(index,snapId). snap returns a new zero-based snapshot id; unset entries have value zero.", "1 <= length <= 50000; 1 <= operations <= 50000; indices and values are valid integers.", "Store only changes as (snapshot id, value) pairs per index and binary-search the latest change not after the requested snapshot.", "Input: length q followed by set index value, snap, or get index snapId commands. Output each snap id and get value on its own line.", [
  ["3 6 set 0 5 snap set 0 6 get 0 0 snap get 0 1", "0\n5\n1\n6", "take two snapshots after changing index 0", "Each get returns the value recorded at its requested snapshot."],
  ["2 3 snap get 1 0 get 0 0", "0\n0\n0", "read unset entries", "Unset indices have value zero in every snapshot."],
  ["2 4 set 1 7 set 1 9 snap get 1 0", "0\n9", "set one index twice before taking a snapshot", "The snapshot stores the latest value set before snap."]
]);

P("Minimum Remove to Make Valid Parentheses", "MEDIUM", ["Strings", "Stack", "Greedy"], "Remove the fewest parentheses so the remaining string has balanced parentheses. Preserve all non-parenthesis characters and their order. Remove unmatched closing parentheses while scanning left to right, then unmatched opening parentheses from right to left.", "0 <= string length <= 100000; input contains lowercase letters and parentheses.", "Track unmatched opening positions and skip a closing parenthesis when no opening one is available.", "Input: one token string. Output the resulting string, or EMPTY if it is empty.", [
  ["lee(t(c)o)de)", "lee(t(c)o)de", "one unmatched closing parenthesis at the end", "The unmatched close is removed and all other characters remain."],
  ["a)b(c)d", "ab(c)d", "an unmatched close after a", "The unmatched close is removed while the balanced group remains."],
  ["(((abc", "abc", "three unmatched opening parentheses", "All unmatched opens are removed from the rightmost side first."]
]);

const languages = ["JAVASCRIPT", "PYTHON", "JAVA", "C", "CPP"];
function starter(lang, format) {
  if (lang === "JAVASCRIPT") return `// ${format}\nfunction solve(input) {\n  // Parse the input and return the requested result.\n  return "";\n}\nconst fs = require("fs");\nprocess.stdout.write(solve(fs.readFileSync(0, "utf8")));`;
  if (lang === "PYTHON") return `# ${format}\nimport sys\n\ndef solve(input_data):\n    # Parse the input and return the requested result.\n    return ""\n\nif __name__ == "__main__":\n    sys.stdout.write(solve(sys.stdin.read()))`;
  if (lang === "JAVA") return `import java.io.*;\nimport java.util.*;\n\nclass Main {\n  // ${format}\n  static String solve(String input) {\n    // Parse the input and return the requested result.\n    return "";\n  }\n  public static void main(String[] args) throws Exception {\n    System.out.print(solve(new String(System.in.readAllBytes())));\n  }\n}`;
  if (lang === "C") return `#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\n/* ${format} */\nvoid solve(const char *input, char *output) {\n    /* Parse the input and write the requested result. */\n    output[0] = '\\0';\n}\nint main(void) {\n    size_t cap = 1u << 20, len = 0;\n    char *input = malloc(cap), *output = calloc(cap, 1);\n    if (!input || !output) return 1;\n    int ch; while ((ch = getchar()) != EOF && len + 1 < cap) input[len++] = (char)ch;\n    input[len] = '\\0'; solve(input, output); fputs(output, stdout);\n    free(input); free(output); return 0;\n}`;
  return `#include <bits/stdc++.h>\nusing namespace std;\n\n// ${format}\nstring solve(const string& input) {\n    // Parse the input and return the requested result.\n    return "";\n}\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    string input((istreambuf_iterator<char>(cin)), istreambuf_iterator<char>());\n    cout << solve(input);\n}`;
}

try {
  if (rows.length !== 30) throw new Error(`Expected 30 problems, got ${rows.length}.`);
  const admin = await db.user.findFirst({ where: { role: "ADMIN" }, select: { id: true } });
  if (!admin) throw new Error("Create an ADMIN account before importing problems.");
  const seen = new Set();
  let added = 0;
  let skipped = 0;
  for (const item of rows) {
    if (seen.has(item.title)) throw new Error(`Duplicate seed title: ${item.title}`);
    seen.add(item.title);
    if (item.cases.length !== 3 || item.cases.some((c) => c.length !== 4 || c[0] === undefined || c[1] === undefined || !c[2] || !c[3])) {
      throw new Error(`Every question needs three complete examples: ${item.title}`);
    }
    const existing = await db.problem.findFirst({ where: { title: item.title }, select: { id: true } });
    if (existing) {
      skipped++;
      continue;
    }
    const testcases = item.cases.map(([input, output, displayInput, explanation], i) => ({
      input, output, displayInput, explanation, isPublic: true, testCaseNumber: i + 1,
    }));
    const hint = item.hint;
    await db.problem.create({ data: {
      title: item.title,
      userId: admin.id,
      description: `${item.task}\n\n${item.format}`,
      difficulty: item.difficulty,
      tags: item.tags,
      constraints: item.constraints,
      hints: hint,
      editorial: `${hint}\n\n${item.format}`,
      examples: item.cases.map(([input, output, displayInput, explanation]) => ({ input: displayInput, output, explanation })),
      testcases,
      codeSnippets: Object.fromEntries(languages.map((language) => [language, starter(language, item.format)])),
      referenceSolutions: {},
    } });
    added++;
    console.log(`Added ${item.title}`);
  }
  console.log(`Interview import complete: ${added} added, ${skipped} already present, ${rows.length} reviewed.`);
} finally {
  await db.$disconnect();
}
