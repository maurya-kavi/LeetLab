import { db } from "../src/libs/db.js";
import { nodeScaffold } from "./tree-graph-scaffolds.mjs";

// Graph section continuation after Binary Search Trees. Each case is designed
// for the app's stdin/stdout runner; displayInput also feeds the graph visual.
const P = (title, difficulty, summary, constraint, hint, format, cases, tags = []) => ({
  title, difficulty, summary, constraint, hint, format, cases,
  tags: ["Graph", ...tags],
});
const rows = [
P("Graph Representation: Adjacency List", "EASY", "Build an undirected adjacency list from the given vertices and edges, then print each vertex's neighbors in ascending order.", "1 <= V <= 100000; 0 <= E <= 200000; vertices are numbered 0..V-1; no self-loops.", "Add each undirected edge to both endpoint lists, then sort each list.", "Input: V E followed by E endpoint pairs. Output one line per vertex as `v: neighbors`.", [
  ["4 3 0 1 0 2 2 3", "0: 1 2\n1: 0\n2: 0 3\n3: 2", "Vertices 0-3; edges: 0—1, 0—2, 2—3", "Undirected edges appear in both endpoint lists."],
  ["3 0", "0:\n1:\n2:", "Three isolated vertices", "Every vertex still gets an empty adjacency row."],
  ["2 1 1 0", "0: 1\n1: 0", "Vertices 0-1; edge: 0—1", "The single undirected edge is stored twice."],
], ["Adjacency List"]),
P("Breadth First Search of a Graph", "EASY", "Starting at vertex 0, return the breadth-first traversal of an undirected graph; visit neighbors in ascending order.", "1 <= V <= 100000; 0 <= E <= 200000; vertices 0..V-1.", "Use a queue and mark a vertex visited when enqueuing it.", "Input: V E followed by E undirected edges. Output the BFS order from vertex 0.", [
  ["5 4 0 1 0 2 0 3 2 4", "0 1 2 3 4", "Vertices 0-4; edges: 0—1, 0—2, 0—3, 2—4", "BFS visits all root neighbors before vertex 4."],
  ["4 2 0 2 2 1", "0 2 1", "Vertices 0-3; edges: 0—2, 2—1", "Vertex 3 is unreachable from 0."],
  ["1 0", "0", "One isolated vertex", "The traversal contains only its start."],
], ["BFS", "Queue"]),
P("Depth First Search of a Graph", "EASY", "Starting at vertex 0, return a depth-first traversal of an undirected graph, visiting neighbors in ascending order.", "1 <= V <= 100000; 0 <= E <= 200000; vertices 0..V-1.", "Mark before exploring neighbors; recursive DFS or an explicit stack both work.", "Input: V E followed by E undirected edges. Output the DFS order from vertex 0.", [
  ["5 4 0 1 0 2 0 3 2 4", "0 1 2 4 3", "Vertices 0-4; edges: 0—1, 0—2, 0—3, 2—4", "DFS completes the branch through 2 before returning to 0."],
  ["4 2 0 2 2 1", "0 2 1", "Vertices 0-3; edges: 0—2, 2—1", "DFS follows the only available path; vertex 3 is separate."],
  ["1 0", "0", "One isolated vertex", "The start is the only reachable vertex."],
], ["DFS", "Depth First Search"]),
P("Connected Components in a Matrix", "MEDIUM", "Count groups of adjacent 1s in a binary matrix. Cells connect horizontally or vertically.", "1 <= rows, cols <= 500; cells are 0 or 1.", "Scan for unvisited land; flood-fill its four neighbors and increment the component count.", "Input: rows cols, then rows binary strings. Output the number of components.", [
  ["4 5 11000 11000 00100 00011", "3", "Grid:\n11...\n11...\n..1..\n...11", "The first block, center cell, and lower-right pair are three groups."],
  ["3 3 100 010 001", "3", "Grid:\n1..\n.1.\n..1", "Diagonal-only contact does not connect these cells."],
  ["2 4 0000 0000", "0", "Grid contains no land", "No 1-cell starts a component."],
], ["Matrix", "DFS", "BFS"]),
P("Number of Provinces", "MEDIUM", "Given a symmetric connection matrix, count the connected groups of cities.", "1 <= n <= 1000; matrix is binary and symmetric; diagonal entries are 1.", "Treat cities as vertices; run DFS/BFS from each city not visited yet.", "Input: n followed by n rows of n binary values. Output the province count.", [
  ["3 1 1 0 1 1 0 0 0 1", "2", "Cities 0—1 connected; city 2 alone", "There are two connected groups."],
  ["4 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1", "4", "Four isolated cities", "Each city forms its own province."],
  ["2 1 1 1 1", "1", "Cities 0—1 connected", "Both cities belong to one group."],
], ["DFS", "BFS", "Connected Components"]),
P("Number of Islands", "MEDIUM", "Count islands in a grid of 0s and 1s using four-directional connectivity.", "1 <= rows, cols <= 500; cells are 0 or 1.", "Start a flood fill at each unseen 1 and mark its full four-directional component.", "Input: rows cols followed by binary rows. Output island count.", [
  ["4 5 11000 11000 00100 00011", "3", "Grid:\n11...\n11...\n..1..\n...11", "Diagonal contact does not join islands in this problem."],
  ["3 3 111 010 111", "1", "Grid:\n111\n.1.\n111", "All land cells connect through the center."],
  ["2 3 000 000", "0", "Grid has only water", "No island exists."],
], ["DFS", "BFS", "Matrix"]),
P("Flood Fill", "EASY", "Recolor the four-directionally connected region matching the starting pixel's original color.", "1 <= rows, cols <= 500; 0 <= colors <= 10^9; start is inside the grid.", "Remember the starting color and visit only matching neighbors; if old and new colors match, return unchanged.", "Input: rows cols, grid values, start row/column, new color. Output the recolored grid.", [
  ["3 3 1 1 1 1 1 0 1 0 1 1 1 2", "2 2 2\n2 2 0\n2 0 2", "Grid:\n111\n110\n101; start=(0,0)", "Only the connected region of color 1 is recolored."],
  ["2 2 0 0 0 1 1 0 0 3", "3 3\n3 1", "Grid:\n00\n01; start=(1,0)", "The diagonal 1 is not connected to the start."],
  ["1 2 7 7 0 0 7", "7 7", "Grid: 7 7; new color equals old color", "The grid remains unchanged."],
], ["DFS", "BFS", "Matrix"]),
P("Rotten Oranges", "MEDIUM", "Each minute, rotten oranges infect adjacent fresh oranges. Return the minutes until no fresh orange remains, or -1 if some cannot rot.", "1 <= rows, cols <= 500; cells are 0 empty, 1 fresh, 2 rotten.", "Use multi-source BFS initialized with every rotten orange and process one layer per minute.", "Input: rows cols followed by grid values. Output elapsed minutes or -1.", [
  ["3 3 2 1 1 1 1 0 0 1 1", "4", "Grid:\n2 1 1\n1 1 0\n0 1 1", "The infection spreads one adjacent layer each minute."],
  ["1 3 2 0 1", "-1", "Grid: 2 0 1", "The fresh orange is separated by an empty cell."],
  ["2 2 0 2 0 2", "0", "No fresh oranges", "No spread is needed."],
], ["BFS", "Matrix"]),
P("Detect Cycle in an Undirected Graph Using BFS", "MEDIUM", "Determine whether an undirected graph contains a cycle.", "1 <= V <= 100000; 0 <= E <= 200000; graph may be disconnected.", "During BFS, an already visited neighbor other than the current node's parent signals a cycle.", "Input: V E followed by undirected edges. Output true or false.", [
  ["4 4 0 1 1 2 2 0 2 3", "true", "Edges: 0—1, 1—2, 2—0, 2—3", "The triangle closes a cycle."],
  ["4 2 0 1 2 3", "false", "Edges: 0—1 and 2—3", "Both components are simple edges."],
  ["3 3 0 1 1 2 2 0", "true", "Three vertices form a triangle", "Returning to an already visited non-parent vertex reveals the cycle."],
], ["BFS", "Cycle Detection"]),
P("Detect Cycle in an Undirected Graph Using DFS", "MEDIUM", "Determine whether any connected component of an undirected graph has a cycle.", "1 <= V <= 100000; 0 <= E <= 200000.", "DFS each component while carrying its parent; a visited non-parent neighbor closes a cycle.", "Input: V E followed by undirected edges. Output true or false.", [
  ["4 4 0 1 1 2 2 0 2 3", "true", "Edges: 0—1, 1—2, 2—0, 2—3", "The DFS sees an ancestor edge besides its parent link."],
  ["4 2 0 1 2 3", "false", "Two disconnected edges", "No component contains a back edge."],
  ["1 0", "false", "One isolated vertex", "A lone vertex has no cycle."],
], ["DFS", "Cycle Detection"]),
P("01 Matrix: Distance to Nearest Zero", "MEDIUM", "For every cell in a binary matrix, return its Manhattan distance to the closest zero.", "1 <= rows, cols <= 1000; at least one cell is zero.", "Start BFS from all zero cells at once; the first visit gives each cell's minimum distance.", "Input: rows cols followed by binary rows. Output the distance matrix.", [
  ["3 3 010 010 010", "1 0 1\n2 1 2\n1 0 1", "Grid:\n010\n010\n010", "Distances expand outward from both zero cells."],
  ["2 2 00 01", "0 0\n0 1", "Grid:\n00\n01", "The bottom-right cell is one step from a zero."],
  ["1 3 000", "0 0 0", "Grid: 000", "Every cell is already zero."],
], ["BFS", "Matrix"]),
P("Surrounded Regions", "MEDIUM", "Capture every O region that does not touch the boundary by changing its cells to X.", "1 <= rows, cols <= 500; cells are X or O.", "Mark O cells reachable from any border first; flip only the remaining O cells.", "Input: rows cols followed by board rows. Output the updated board.", [
  ["4 4 XXXX XOOX XXOX XOXX", "XXXX\nXXXX\nXXXX\nXOXX", "Board:\nXXXX\nXOOX\nXXOX\nXOXX", "The interior O group is enclosed; the border-connected O stays."],
  ["2 3 OOO XOX", "OOO\nXOX", "Board:\nOOO\nXOX", "Every O touches the border."],
  ["1 1 O", "O", "Board: O", "The sole cell lies on the boundary."],
], ["DFS", "BFS", "Matrix"]),
P("Number of Enclaves", "MEDIUM", "Count land cells from which no path through land reaches the grid boundary.", "1 <= rows, cols <= 500; cells are 0 or 1.", "Flood-fill land from all boundary cells, then count unvisited land.", "Input: rows cols followed by grid rows. Output enclave cell count.", [
  ["4 4 0000 0110 0100 0000", "3", "Grid:\n....\n.11.\n.1..\n....", "The three connected interior land cells cannot reach the boundary."],
  ["3 3 111 101 111", "0", "Land touches every side", "All land is boundary-reachable."],
  ["2 2 00 00", "0", "No land cells", "There is nothing to count."],
], ["DFS", "BFS", "Matrix"]),
P("Number of Distinct Islands", "MEDIUM", "Count island shapes that differ by translation; rotations and reflections still count as different shapes.", "1 <= rows, cols <= 500; cells are 0 or 1.", "Record each island's cell offsets relative to its first cell and canonicalize the ordered offsets.", "Input: rows cols followed by grid rows. Output number of unique shapes.", [
  ["4 5 11000 11000 00011 00011", "1", "Two identical 2x2 blocks", "Both shapes have the same offsets from their top-left cell."],
  ["3 4 1100 0100 0011", "2", "An L shape and a 2-cell row", "Different relative coordinates make different shapes."],
  ["2 2 00 00", "0", "No land", "No island shape is present."],
], ["DFS", "BFS", "Matrix"]),
P("Bipartite Graph Check Using BFS", "MEDIUM", "Check whether an undirected graph's vertices can be split into two groups with every edge crossing between groups.", "1 <= V <= 100000; 0 <= E <= 200000; graph may be disconnected.", "BFS-color each component with alternating colors; an edge joining equal colors makes it impossible.", "Input: V E followed by undirected edges. Output true or false.", [
  ["4 4 0 1 0 3 2 1 2 3", "true", "A four-cycle: 0—1—2—3—0", "Alternating colors work around an even cycle."],
  ["3 3 0 1 1 2 2 0", "false", "A three-cycle", "An odd cycle forces two adjacent vertices to share a color."],
  ["3 0", "true", "Three isolated vertices", "Each isolated vertex can be assigned either color."],
], ["BFS", "Coloring"]),
P("Bipartite Graph Check Using DFS", "MEDIUM", "Check whether every connected component of an undirected graph admits a two-coloring.", "1 <= V <= 100000; 0 <= E <= 200000.", "Assign opposite colors recursively across each edge; reject if a neighbor already has the same color.", "Input: V E followed by undirected edges. Output true or false.", [
  ["4 4 0 1 0 3 2 1 2 3", "true", "A four-cycle: 0—1—2—3—0", "DFS alternates colors consistently."],
  ["3 3 0 1 1 2 2 0", "false", "A three-cycle", "The final edge conflicts with the assigned colors."],
  ["2 1 0 1", "true", "One edge joining two vertices", "The endpoints can receive opposite colors."],
], ["DFS", "Coloring"]),
P("Detect a Cycle in a Directed Graph", "MEDIUM", "Determine whether a directed graph contains a cycle.", "1 <= V <= 100000; 0 <= E <= 200000.", "Use DFS states unseen/active/done; an edge to an active vertex is a back edge and proves a cycle.", "Input: V E followed by directed edges. Output true or false.", [
  ["3 3 0 1 1 2 2 0", "true", "Directed cycle: 0→1→2→0", "DFS reaches a vertex that is still on its active path."],
  ["4 3 0 1 0 2 1 3", "false", "Edges all point toward terminal vertices", "No active-path back edge occurs."],
  ["1 1 0 0", "true", "Self-loop at vertex 0", "The edge immediately returns to the active vertex."],
], ["DFS", "Cycle Detection"]),
P("Topological Sort Using DFS", "MEDIUM", "Return a topological ordering of a directed acyclic graph; among available choices, any valid order is accepted.", "1 <= V <= 100000; 0 <= E <= 200000; input is a DAG.", "Append vertices after exploring outgoing edges, then reverse the finishing order.", "Input: V E followed by directed edges. Output a topological order.", [
  ["4 3 0 1 0 2 1 3", "0 2 1 3", "Dependencies: 0→1, 0→2, 1→3", "Every edge's source appears before its destination."],
  ["3 0", "0 1 2", "Three vertices and no dependencies", "Any permutation is a valid ordering."],
  ["3 2 2 1 1 0", "2 1 0", "Chain 2→1→0", "The reverse chain respects both directed edges."],
], ["DFS", "Topological Sort"]),
P("Topological Sort Using Kahn's Algorithm", "MEDIUM", "Produce a topological ordering for a directed acyclic graph using indegrees.", "1 <= V <= 100000; 0 <= E <= 200000; graph is acyclic.", "Queue all zero-indegree vertices; remove them and decrement outgoing neighbors' indegrees.", "Input: V E followed by directed edges. Output one valid topological order.", [
  ["4 3 0 1 0 2 1 3", "0 2 1 3", "Dependencies: 0→1, 0→2, 1→3", "Each selected vertex has no remaining prerequisites."],
  ["3 0", "0 1 2", "No edges", "Every vertex begins with indegree zero."],
  ["3 2 2 1 1 0", "2 1 0", "Chain 2→1→0", "Only one zero-indegree choice is available at each step."],
], ["BFS", "Queue", "Topological Sort"]),
P("Course Schedule I", "MEDIUM", "Given prerequisite pairs, determine whether all courses can be completed.", "1 <= courses <= 100000; 0 <= prerequisites <= 200000.", "Build prerequisite edges and check whether a topological ordering includes every course.", "Input: n m followed by m pairs course prerequisite. Output true or false.", [
  ["4 3 1 0 2 0 3 1", "true", "Prerequisites: 0→1, 0→2, 1→3", "The dependency graph is acyclic."],
  ["2 2 1 0 0 1", "false", "Courses 0 and 1 depend on each other", "The pair forms a directed cycle."],
  ["1 0", "true", "One course without prerequisites", "It can be completed immediately."],
], ["BFS", "Topological Sort"]),
P("Course Schedule II", "MEDIUM", "Return an order in which all courses can be completed, or an empty result if prerequisites contain a cycle.", "1 <= courses <= 100000; 0 <= prerequisites <= 200000.", "Topologically sort the prerequisite graph; if fewer than n vertices are produced, return empty.", "Input: n m followed by course prerequisite pairs. Output an order or `IMPOSSIBLE`.", [
  ["4 3 1 0 2 0 3 1", "0 1 2 3", "Prerequisites: 0→1, 0→2, 1→3", "Each prerequisite appears before the course that needs it."],
  ["2 2 1 0 0 1", "IMPOSSIBLE", "Two courses form a cycle", "No complete course ordering exists."],
  ["1 0", "0", "One course", "The only course is a valid schedule."],
], ["BFS", "Topological Sort"]),
P("Find Eventual Safe States", "MEDIUM", "Return all vertices that cannot reach a directed cycle, in ascending order.", "1 <= V <= 100000; 0 <= E <= 200000.", "Reverse all edges and peel terminal vertices by outdegree, or use three-state DFS.", "Input: V E followed by directed edges. Output safe vertex IDs in ascending order.", [
  ["7 7 0 1 0 2 1 2 1 3 2 5 3 0 4 5", "2 4 5 6", "Cycle 0→1→3→0; 2,4,5,6 terminate", "Safe vertices cannot lead back into the cycle."],
  ["3 2 0 1 1 2", "0 1 2", "A directed chain", "Every path ends at vertex 2."],
  ["2 2 0 1 1 0", "", "Two-node directed cycle", "Neither vertex is safe."],
], ["DFS", "Topological Sort"]),
P("Alien Dictionary", "HARD", "Infer a character order from a sorted list of words in an unknown alphabet; report impossible for contradictory ordering.", "1 <= word count <= 10000; words contain lowercase letters; total length <= 200000.", "Compare adjacent words and add only the first differing-character constraint; reject a longer word before its prefix.", "Input: n followed by n words. Output one valid character ordering or `IMPOSSIBLE`.", [
  ["5 baa abcd abca cab cad", "bdac", "Constraints include b→a, d→a, a→c", "The output respects the first differing-character constraints."],
  ["2 abc ab", "IMPOSSIBLE", "A word precedes its own longer prefix", "No alphabet can make this ordering valid."],
  ["1 xyz", "xyz", "One word", "No pair adds an ordering constraint."],
], ["BFS", "Topological Sort", "Strings"]),
P("Shortest Path in a DAG", "MEDIUM", "Find shortest distances from a source in a weighted directed acyclic graph; unreachable vertices are reported as -1.", "1 <= V <= 100000; 0 <= E <= 200000; edge weights are signed integers.", "Topologically order vertices and relax each outgoing edge once in that order.", "Input: V E source followed by (u,v,w) edges. Output distances for vertices 0..V-1.", [
  ["6 7 0 0 1 2 0 4 1 1 2 3 4 2 2 2 5 4 4 5 4 5 3 1", "0 2 3 6 1 5", "Weighted edges: 0→1(2), 0→4(1), 1→2(3), 4→2(2), 2→5(4), 4→5(4), 5→3(1)", "Relaxing in topological order finds each minimum."],
  ["3 1 0 0 1 -2", "0 -2 -1", "Edge 0→1 has weight -2; vertex 2 is isolated", "Negative edges are safe in a DAG."],
  ["1 0 0", "0", "One vertex and no edges", "The source distance is zero."],
], ["DAG", "Topological Sort", "Shortest Path"]),
P("Shortest Paths in an Unweighted Undirected Graph", "MEDIUM", "Return the minimum edge count from a source to every vertex; use -1 for unreachable vertices.", "1 <= V <= 100000; 0 <= E <= 200000.", "BFS discovers vertices in nondecreasing distance from the source.", "Input: V E source followed by undirected edges. Output all distances.", [
  ["5 3 0 0 1 1 2 3 4", "0 1 2 -1 -1", "Edges: 0—1—2 and separate 3—4", "BFS reaches 1 then 2; the other component stays unreachable."],
  ["4 3 2 0 1 1 2 2 3", "2 1 0 1", "Path 0—1—2—3; source 2", "Distances grow by one along each edge."],
  ["1 0 0", "0", "One vertex", "The source has distance zero."],
], ["BFS", "Shortest Path"]),
P("Word Ladder I", "HARD", "Return the length of the shortest one-letter-at-a-time transformation from beginWord to endWord using only dictionary words; return zero if impossible.", "1 <= word length <= 10; all words have equal length; dictionary size <= 10000.", "BFS over words, generating one-letter neighbors and removing visited words from the dictionary.", "Input: beginWord endWord n followed by n dictionary words. Output sequence length including both endpoints.", [
  ["hit cog 6 hot dot dog lot log cog", "5", "hit → hot → dot → dog → cog", "Four single-character edits use five words."],
  ["hit cog 5 hot dot dog lot log", "0", "The target cog is absent", "A transformation must end at a dictionary word."],
  ["a c 2 b c", "2", "a → c differs by one letter", "The target is directly reachable."],
], ["BFS", "Strings"]),
P("Word Ladder II", "HARD", "List every shortest transformation sequence from beginWord to endWord using dictionary words, ordered lexicographically.", "1 <= word length <= 10; dictionary size <= 5000; output contains at most 10000 sequences.", "BFS by levels to retain every shortest parent, then backtrack from the target.", "Input: beginWord endWord n followed by words. Output each shortest sequence on one line, or `NONE`.", [
  ["hit cog 6 hot dot dog lot log cog", "hit hot dot dog cog\nhit hot lot log cog", "Two shortest paths connect hit to cog", "Both listed paths use four edits and are the only shortest sequences."],
  ["a c 1 b", "NONE", "Target c is not in the dictionary", "No complete sequence is allowed."],
  ["a b 1 b", "a b", "One edit reaches the target", "There is one shortest sequence."],
], ["BFS", "Backtracking", "Strings"]),
P("Dijkstra's Algorithm", "MEDIUM", "Compute shortest distances from a source in a weighted undirected graph with non-negative weights.", "1 <= V <= 100000; 0 <= E <= 200000; 0 <= weight <= 10^9.", "Use a min-priority queue; ignore stale entries whose distance is no longer current.", "Input: V E source followed by (u,v,w) edges. Output distances; use -1 if unreachable.", [
  ["5 6 0 0 1 4 0 2 1 2 1 2 1 3 1 2 3 5 3 4 3", "0 3 1 4 7", "Edges include 0—2(1), 2—1(2), 1—3(1), 3—4(3)", "The best path to 4 costs 1+2+1+3=7."],
  ["3 1 0 1 2 5", "0 -1 -1", "Source 0 is isolated; edge 1—2", "Only the source is reachable."],
  ["1 0 0", "0", "One vertex", "No relaxation is needed."],
], ["Shortest Path", "Priority Queue", "Weighted Graph"]),
P("Shortest Path in a Weighted Undirected Graph", "MEDIUM", "Return the minimum-cost route from vertex 0 to vertex V-1, including both endpoints; return `IMPOSSIBLE` when disconnected.", "1 <= V <= 100000; 0 <= E <= 200000; positive edge weights.", "Run Dijkstra while storing each vertex's predecessor, then backtrack from the destination.", "Input: V E then weighted undirected edges. Output path vertices and total distance.", [
  ["5 6 0 1 2 0 2 1 2 1 1 1 3 2 2 3 5 3 4 1", "0 2 1 3 4\n5", "Route 0—2—1—3—4 has cost 1+1+2+1", "The predecessor chain reconstructs a shortest route."],
  ["3 1 0 1 7", "IMPOSSIBLE", "Vertex 2 is isolated", "No path reaches the destination."],
  ["1 0", "0\n0", "Start equals destination", "The zero-edge path has cost zero."],
], ["Shortest Path", "Dijkstra", "Weighted Graph"]),
P("Shortest Distance in a Binary Maze", "MEDIUM", "Find the fewest four-directional moves between open cells in a binary grid; blocked or unreachable endpoints return -1.", "1 <= rows, cols <= 1000; 0 is blocked and 1 is open.", "BFS from the start; each move to a neighboring open cell adds one.", "Input: rows cols, grid values, start row/column, target row/column. Output distance.", [
  ["3 4 1 1 0 1 0 1 1 1 1 1 0 1 0 0 2 3", "5", "Grid:\n11.1\n.111\n1101; start=(0,0), target=(2,3)", "The shortest open-cell route takes five moves."],
  ["2 2 1 0 0 1 0 0 1 1", "-1", "Start and target are separated by blocked cells", "No valid four-directional route exists."],
  ["1 1 1 0 0 0", "0", "Start equals target", "No movement is needed."],
], ["BFS", "Matrix", "Shortest Path"]),
P("Path with Minimum Effort", "MEDIUM", "Choose a path from the top-left to bottom-right minimizing the largest absolute height difference between adjacent cells.", "1 <= rows, cols <= 1000; heights are non-negative integers.", "Dijkstra over cells where extending a route costs max(current effort, edge difference).", "Input: rows cols followed by heights. Output minimum effort.", [
  ["3 3 1 2 2 3 8 2 5 3 5", "2", "Heights:\n1 2 2\n3 8 2\n5 3 5", "A route avoids the height jump of 6 and keeps every step at most 2."],
  ["2 2 1 10 10 1", "9", "Heights:\n1 10\n10 1", "Any path must cross a difference of 9."],
  ["1 1 7", "0", "One cell", "No adjacent-height difference is encountered."],
], ["Dijkstra", "Priority Queue", "Matrix"]),
P("Cheapest Flights Within K Stops", "MEDIUM", "Find the minimum flight cost from a source to destination using no more than k intermediate stops; return -1 if impossible.", "1 <= V <= 10000; 0 <= E <= 100000; prices are positive.", "Relax edges by number of flights used, keeping the best costs up to k+1 edges.", "Input: V E source destination k followed by directed (from,to,cost) flights. Output minimum fare or -1.", [
  ["4 4 0 3 1 0 1 100 1 2 100 2 3 100 0 3 500", "500", "Direct flight costs 500; the cheaper 0→1→2→3 needs two stops", "With at most one stop, the direct fare is the only valid cheapest route."],
  ["3 1 0 2 1 0 1 5", "-1", "No flight reaches city 2", "The destination is unreachable."],
  ["2 1 0 1 0 0 1 25", "25", "One direct flight and no intermediate stops allowed", "The route uses zero stops."],
], ["BFS", "Shortest Path", "Weighted Graph"]),
P("Network Delay Time", "MEDIUM", "Find how long a signal from one source takes to reach every node in a directed weighted network; return -1 if any node is unreachable.", "1 <= n <= 10000; 0 <= E <= 100000; positive travel times; vertices are 1..n.", "Dijkstra from the source; the answer is the maximum finalized distance.", "Input: n E source followed by directed (u,v,time) edges. Output delay or -1.", [
  ["4 3 2 2 1 1 2 3 1 3 4 1", "2", "Routes: 2→1 costs 1; 2→3→4 costs 2", "The farthest node is reached after two time units."],
  ["3 1 1 1 2 4", "-1", "Node 3 is unreachable", "Not every node receives the signal."],
  ["1 0 1", "0", "One-node network", "The source already has the signal."],
], ["Dijkstra", "Priority Queue", "Weighted Graph"]),
P("Number of Ways to Arrive at Destination", "MEDIUM", "Count distinct shortest routes from node 0 to node n-1 in a positive-weight undirected graph, modulo 1,000,000,007.", "2 <= n <= 200; 1 <= E <= 50000; positive weights.", "Use Dijkstra; on a better distance replace the route count, and on an equal distance add counts.", "Input: n E followed by weighted edges. Output number of shortest routes modulo the given value.", [
  ["4 5 0 1 1 0 2 1 1 3 1 2 3 1 1 2 2", "2", "Two equal-cost routes: 0—1—3 and 0—2—3", "Both shortest routes have cost 2."],
  ["2 1 0 1 8", "1", "One edge joins source to destination", "There is exactly one shortest path."],
  ["3 0", "0", "No route reaches the destination", "No shortest path exists."],
], ["Dijkstra", "Dynamic Programming", "Weighted Graph"]),
P("Minimum Multiplications to Reach End", "MEDIUM", "Starting at start, multiply by any supplied factor modulo 100000 to reach end in the fewest operations.", "1 <= factor count <= 10000; values are in 0..99999.", "BFS over the 100000 possible residues; each multiplication is one edge.", "Input: n start end followed by n factors. Output operation count or -1.", [
  ["3 3 30 2 5 7", "2", "3×5=15, then 15×2=30 (mod 100000)", "Two multiplications reach the target."],
  ["1 2 9 4", "-1", "Repeated multiplication by 4 from 2 cannot reach 9", "The target residue is unreachable."],
  ["1 42 42 7", "0", "Start equals end", "No multiplication is required."],
], ["BFS", "Shortest Path"]),
P("Bellman-Ford Algorithm", "MEDIUM", "Compute single-source shortest distances in a directed weighted graph, including negative edges; report a reachable negative cycle.", "1 <= V <= 5000; 0 <= E <= 200000; weights are signed integers.", "Relax every edge V-1 times with early stopping, then make one extra pass to detect a reachable negative cycle.", "Input: V E source followed by (u,v,w). Output distances or `NEGATIVE CYCLE`.", [
  ["5 7 0 0 1 6 0 2 7 1 2 8 1 3 5 1 4 -4 2 3 -3 3 4 9", "0 6 7 4 2", "Directed weighted edges include 1→4(-4), 2→3(-3)", "Repeated relaxation propagates the improved routes."],
  ["3 3 0 0 1 1 1 2 -2 2 1 -2", "NEGATIVE CYCLE", "Cycle 1→2→1 has total weight -4", "The cycle is reachable from source 0."],
  ["3 1 0 1 2 -5", "0 -1 -1", "Negative edge lies in a separate component", "Unreachable negative cycles or edges do not affect source distances."],
], ["Shortest Path", "Negative Weights"]),
P("Floyd-Warshall Algorithm", "MEDIUM", "Compute the shortest distance between every pair of vertices; use INF for unreachable pairs.", "1 <= V <= 500; 0 <= E <= V*V; no negative cycles.", "Try each vertex k as an intermediate and relax dist[i][j] through dist[i][k]+dist[k][j].", "Input: V E followed by directed (u,v,w) edges. Output V rows; unreachable entries are INF.", [
  ["3 3 0 1 4 1 2 -2 0 2 10", "0 4 2\nINF 0 -2\nINF INF 0", "Routes: 0→1 costs 4; 1→2 costs -2", "Using vertex 1 improves the 0-to-2 distance from 10 to 2."],
  ["2 0", "0 INF\nINF 0", "Two isolated vertices", "Only each vertex's distance to itself is finite."],
  ["1 0", "0", "One vertex", "The diagonal distance is zero."],
], ["Shortest Path", "Dynamic Programming"]),
P("City with the Fewest Neighbors Within Threshold", "MEDIUM", "Among cities tied for the fewest other cities reachable within a distance threshold, return the city with the largest index.", "1 <= n <= 100; 0 <= E <= n*(n-1)/2; positive weights.", "Compute all-pairs shortest paths, count qualifying other cities, and apply the specified tie-break.", "Input: n E threshold followed by weighted undirected edges. Output chosen city.", [
  ["4 4 4 0 1 3 1 2 1 1 3 4 2 3 1", "3", "Threshold 4; city 3 has the fewest qualifying neighbors", "Ties go to the city with the greatest index."],
  ["3 0 10", "2", "Three isolated cities", "All have zero neighbors, so choose index 2."],
  ["2 1 5 0 1 5", "1", "Both cities are exactly at threshold", "Each has one qualifying neighbor; the larger index wins."],
], ["Dijkstra", "Floyd-Warshall", "Weighted Graph"]),
P("Minimum Spanning Tree Weight Using Prim's Algorithm", "MEDIUM", "Return the total weight of a minimum spanning tree in a connected weighted undirected graph.", "1 <= V <= 100000; V-1 <= E <= 200000; weights are non-negative.", "Grow the tree from any vertex, always adding the lightest edge crossing its boundary.", "Input: V E followed by weighted undirected edges. Output MST weight.", [
  ["4 5 0 1 1 0 2 4 1 2 2 1 3 5 2 3 3", "6", "Edges include 0—1(1), 1—2(2), 2—3(3)", "The selected edge weights sum to 6."],
  ["2 1 0 1 9", "9", "One edge connects two vertices", "That edge is the spanning tree."],
  ["1 0", "0", "One vertex", "A single vertex needs no edges."],
], ["MST", "Greedy", "Priority Queue"]),
P("Disjoint Set Union", "MEDIUM", "Process union and connectivity queries over n elements numbered 0..n-1.", "1 <= n <= 200000; at most 200000 operations.", "Use path compression and union by size or rank.", "Input: n q followed by `U a b` or `Q a b`. Output YES/NO for each query.", [
  ["5 5 U 0 1 Q 0 1 Q 1 2 U 1 2 Q 0 2", "YES\nNO\nYES", "Unions connect 0—1, then 1—2", "Connectivity queries compare component representatives."],
  ["3 3 Q 0 2 U 0 2 Q 0 2", "NO\nYES", "Join 0 and 2 after the first query", "The final pair shares a component."],
  ["1 1 Q 0 0", "YES", "An element queried against itself", "Every element belongs to its own set."],
], ["Union Find", "Data Structure"]),
P("Find the Minimum Spanning Tree Weight Using Kruskal's Algorithm", "MEDIUM", "Return the minimum total weight connecting all vertices, or -1 if the graph is disconnected.", "1 <= V <= 100000; 0 <= E <= 200000; weights are non-negative.", "Sort edges by weight and accept an edge only when its endpoints belong to different DSU components.", "Input: V E followed by weighted undirected edges. Output MST weight or -1.", [
  ["4 5 0 1 1 0 2 4 1 2 2 1 3 5 2 3 3", "6", "Sorted edges start with 0—1(1), 1—2(2), 2—3(3)", "Those three edges connect all four vertices at total cost 6."],
  ["3 1 0 1 2", "-1", "Vertex 2 is disconnected", "No spanning tree can include every vertex."],
  ["1 0", "0", "One vertex", "The empty edge set spans the graph."],
], ["MST", "Union Find", "Sorting"]),
P("Number of Operations to Make Network Connected", "MEDIUM", "Find the minimum cable moves needed to connect all computers; return -1 if there are too few cables.", "1 <= n <= 200000; 0 <= E <= 200000; no self-loops.", "There must be at least n-1 cables; the required moves then equal connected components minus one.", "Input: n E followed by undirected connections. Output minimum moves or -1.", [
  ["4 3 0 1 0 2 1 2", "1", "Three cables connect a component of 0,1,2; vertex 3 is alone", "One redundant cable can connect the isolated component."],
  ["6 4 0 1 0 2 0 3 4 5", "-1", "Four cables for six computers", "At least five cables are needed."],
  ["1 0", "0", "One computer", "It is connected already."],
], ["Union Find", "Connected Components"]),
P("Most Stones Removed with Same Row or Column", "MEDIUM", "Remove as many stones as possible while each removed stone shares its row or column with a remaining stone.", "1 <= stone count <= 10000; coordinates are non-negative and may be large.", "Model occupied rows and columns as DSU nodes; answer stones minus connected components.", "Input: n followed by n row/column pairs. Output maximum removals.", [
  ["6 0 0 0 1 1 0 1 2 2 1 2 2", "5", "Stones connect through shared rows/columns into one group", "All but one stone in the component can be removed."],
  ["3 0 0 1 1 2 2", "0", "Three stones share no row or column", "Each isolated stone must remain."],
  ["1 5 7", "0", "One stone", "There is no other stone sharing its row or column."],
], ["Union Find", "Connected Components"]),
P("Accounts Merge", "MEDIUM", "Merge accounts that share at least one email, sort each merged email list, and order groups by their first email.", "1 <= accounts <= 10000; total emails <= 100000; names are non-empty.", "Union account indices through shared emails, then group and sort each component's emails.", "Input: n, then for each account a name, email count, and emails. Output merged account rows.", [
  ["3 John 2 a@mail x@mail John 1 x@mail Mary 1 m@mail", "John a@mail x@mail\nMary m@mail", "Accounts 0 and 1 share x@mail; account 2 is separate", "The shared address joins the two John entries."],
  ["2 A 1 z@mail B 1 a@mail", "B a@mail\nA z@mail", "No shared email", "Groups are ordered by their first email."],
  ["1 Solo 0", "Solo", "One account with no emails", "The account remains a group."],
], ["Union Find", "Hash Table", "Sorting"]),
P("Number of Islands II", "HARD", "After each land addition to an initially water-filled grid, report the current number of islands using four-directional adjacency.", "1 <= rows, cols <= 100000; rows*cols may be large; additions <= 200000.", "Map each cell to a DSU ID and merge its active neighboring land cells after each addition.", "Input: rows cols q followed by q cell coordinates. Output island count after every addition.", [
  ["3 3 4 0 0 0 1 2 2 1 1", "1 1 2 2", "Land additions at (0,0),(0,1),(2,2),(1,1)", "The center cell joins the first island; the lower-right cell remains separate."],
  ["1 2 3 0 0 0 1 0 1", "1 1 1", "The repeated coordinate is added twice", "Duplicate additions do not create extra islands."],
  ["2 2 1 1 1", "1", "One land cell", "One active cell is one island."],
], ["Union Find", "Matrix"]),
P("Making a Large Island", "HARD", "You may change at most one water cell to land. Return the largest island size achievable.", "1 <= n <= 500; grid is n by n and contains 0 or 1.", "Label components and their sizes, then for each zero sum the distinct neighboring component sizes plus one.", "Input: n followed by n binary rows. Output maximum island size.", [
  ["2 1 0 0 1", "3", "Grid:\n10\n01", "Changing one zero links the two diagonal cells through the new land cell."],
  ["3 1 1 1 1 0 1 1 1 1", "9", "Grid:\n111\n101\n111", "Changing the center joins all eight surrounding land cells."],
  ["2 1 1 1 1", "4", "All cells already land", "The existing island contains every cell."],
], ["Union Find", "DFS", "Matrix"]),
P("Swim in Rising Water", "HARD", "Find the earliest water level at which a path exists from the top-left to bottom-right; a cell is passable once its elevation is reached.", "1 <= n <= 500; grid elevations are distinct values in 0..n*n-1.", "Use a min-heap over path maximum elevations, or activate cells in ascending order with DSU.", "Input: n followed by n elevation rows. Output minimum required water level.", [
  ["2 0 2 1 3", "3", "Grid:\n0 2\n1 3", "Every route must eventually enter the cell with elevation 3."],
  ["3 0 1 2 5 4 3 6 7 8", "8", "A 3x3 elevation grid", "The destination elevation itself is 8."],
  ["1 7", "7", "One cell at elevation 7", "The water level must reach the only cell."],
], ["Union Find", "Dijkstra", "Matrix"]),
P("Bridges in a Graph", "HARD", "Return every edge whose removal increases the number of connected components, ordered by endpoint pair.", "1 <= V <= 100000; 0 <= E <= 200000; graph may contain parallel edges.", "DFS with discovery and low-link times; an edge is a bridge when child low-link exceeds the parent's discovery time.", "Input: V E followed by undirected edges. Output bridge count and sorted endpoint pairs.", [
  ["5 5 0 1 1 2 2 0 1 3 3 4", "2\n1 3\n3 4", "Triangle 0—1—2 plus chain 1—3—4", "Only the two chain edges disconnect the graph when removed."],
  ["3 3 0 1 1 2 2 0", "0", "A triangle", "Every edge has an alternate route."],
  ["2 1 0 1", "1\n0 1", "One edge joins two vertices", "Removing it separates the endpoints."],
], ["DFS", "Low Link"]),
P("Articulation Points in a Graph", "HARD", "Return vertices whose removal increases the number of connected components; output -1 if none exist.", "1 <= V <= 100000; 0 <= E <= 200000.", "Use DFS discovery and low-link values; handle DFS roots separately by counting their children.", "Input: V E followed by undirected edges. Output articulation count and sorted vertex IDs, or -1.", [
  ["5 5 0 1 1 2 2 0 1 3 3 4", "2\n1 3", "Triangle attached to chain 1—3—4", "Removing 1 or 3 disconnects part of the graph."],
  ["3 3 0 1 1 2 2 0", "-1", "A triangle", "Removing any one vertex leaves the other two connected."],
  ["1 0", "-1", "One isolated vertex", "Removing it does not increase the component count."],
], ["DFS", "Low Link"]),
P("Strongly Connected Components Using Kosaraju's Algorithm", "HARD", "Count the strongly connected components in a directed graph.", "1 <= V <= 100000; 0 <= E <= 200000.", "Run DFS to record finish order, reverse all edges, then DFS in reverse finish order.", "Input: V E followed by directed edges. Output SCC count.", [
  ["5 5 0 1 1 2 2 0 1 3 3 4", "3", "SCCs: {0,1,2}, {3}, {4}", "The triangle is one mutually reachable group; 3 and 4 are separate."],
  ["3 3 0 1 1 2 2 0", "1", "Directed 3-cycle", "Every vertex can reach every other vertex."],
  ["3 0", "3", "Three vertices without edges", "Each vertex forms its own SCC."],
], ["DFS", "Strongly Connected Components"]),
];

if (rows.length !== 50) throw new Error(`Expected 50 graph problems, got ${rows.length}`);
const languages = ["JAVASCRIPT", "PYTHON", "JAVA", "C", "CPP"];
const makeStarter = (item, language) => {
  const body = language === "JAVASCRIPT"
    ? `// ${item.format}\nfunction solve(input) {\n  // Parse input and return the requested output.\n  return "";\n}\nconst fs = require("fs");\nprocess.stdout.write(solve(fs.readFileSync(0, "utf8")));`
    : language === "PYTHON"
      ? `# ${item.format}\nimport sys\n\ndef solve(input_data):\n    # Parse input and return the requested output.\n    return ""\n\nif __name__ == "__main__":\n    sys.stdout.write(solve(sys.stdin.read()))`
      : language === "JAVA"
        ? `import java.io.*;\nimport java.util.*;\n\nclass Main {\n  // ${item.format}\n  static String solve(String input) {\n    // Parse input and return the requested output.\n    return "";\n  }\n  public static void main(String[] args) throws Exception {\n    System.out.print(solve(new String(System.in.readAllBytes())));\n  }\n}`
        : language === "C"
          ? `#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\n/* ${item.format} */\nvoid solve(const char *input, char *output) {\n    /* Parse input and write the requested output. */\n    output[0] = '\\0';\n}\nint main(void) {\n    size_t cap = 1u << 20, len = 0;\n    char *input = malloc(cap), *output = calloc(cap, 1);\n    if (!input || !output) return 1;\n    int ch; while ((ch = getchar()) != EOF && len + 1 < cap) input[len++] = (char)ch;\n    input[len] = '\\0'; solve(input, output); fputs(output, stdout);\n    free(input); free(output); return 0;\n}`
          : `#include <bits/stdc++.h>\nusing namespace std;\n\n// ${item.format}\nstring solve(const string& input) {\n    // Parse input and return the requested output.\n    return "";\n}\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    string input((istreambuf_iterator<char>(cin)), istreambuf_iterator<char>());\n    cout << solve(input);\n}`;
  const scaffold = nodeScaffold(language);
  return language === "JAVA" ? body.replace("class Main {", `${scaffold}\nclass Main {`) : `${scaffold}\n${body}`;
};
function graphVisual(display) {
  if (/^Grid:/m.test(display) || /^Board:/m.test(display)) return display;
  const match = display.match(/Vertices\s+(\d+)\s*[-–]\s*(\d+)/i);
  const edges = [...display.matchAll(/(\d+)\s*[—–→-]+\s*(\d+)/g)].map((m) => [Number(m[1]), Number(m[2])]);
  if (match || edges.length) {
    const min = match ? Number(match[1]) : Math.min(...edges.flat());
    const max = match ? Number(match[2]) : Math.max(...edges.flat());
    const adjacency = Array.from({ length: max - min + 1 }, (_, i) => [min + i, []]);
    for (const [a, b] of edges) { adjacency[a - min]?.[1].push(b); adjacency[b - min]?.[1].push(a); }
    const connector = /→/.test(display) ? " → " : " ─── ";
    return ["Graph view:", ...edges.map(([a, b]) => `${a}${connector}${b}`), "", "Neighbors:", ...adjacency.map(([v, ns]) => `${v}: ${ns.length ? [...ns].sort((a,b)=>a-b).join(", ") : "(none)"}`)].join("\n");
  }
  return `Graph view:\n${display}`;
}
const starter = (item, lang) => makeStarter(item, lang);
try {
  const admin = await db.user.findFirst({ where: { role: "ADMIN" }, select: { id: true } });
  if (!admin) throw new Error("Create an ADMIN account before importing this batch.");
  let added = 0, refreshed = 0;
  for (const item of rows) {
    const testcases = item.cases.map(([input, output, displayInput, explanation], i) => ({
      input, output, displayInput, explanation, visualization: graphVisual(displayInput), isPublic: true, testCaseNumber: i + 1,
    }));
    const data = {
      description: `${item.summary}\n\n${item.format}`, difficulty: item.difficulty, tags: item.tags,
      constraints: item.constraint, hints: item.hint, editorial: `${item.hint}\n\n${item.format}`,
      examples: item.cases.map(([, output, displayInput, explanation]) => ({ input: displayInput, output, explanation, visualization: graphVisual(displayInput) })),
      testcases, codeSnippets: Object.fromEntries(languages.map((lang) => [lang, starter(item, lang)])), referenceSolutions: {},
    };
    const existing = await db.problem.findFirst({ where: { title: item.title }, select: { id: true } });
    if (existing) { await db.problem.update({ where: { id: existing.id }, data }); refreshed += 1; }
    else { await db.problem.create({ data: { ...data, title: item.title, userId: admin.id } }); added += 1; }
  }
  console.log(`Graph batch complete: ${added} added, ${refreshed} refreshed (${rows.length} total).`);
} finally { await db.$disconnect(); }
