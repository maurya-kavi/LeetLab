const isNull = (value) => value == null || value === "#" || value.toLowerCase() === "null";

function treeFromLevelOrder(values) {
  if (!values.length || isNull(values[0])) return null;
  const root = { val: values[0], left: null, right: null };
  const queue = [root];
  let index = 1;
  for (let head = 0; head < queue.length && index < values.length; head += 1) {
    const node = queue[head];
    for (const side of ["left", "right"]) {
      if (index >= values.length) break;
      const value = values[index++];
      if (isNull(value)) continue;
      node[side] = { val: value, left: null, right: null };
      queue.push(node[side]);
    }
  }
  return root;
}

function renderTree(root) {
  if (!root) return "(empty tree)";
  const lines = [String(root.val)];
  const walk = (node, prefix, side, isLast) => {
    if (!node) return;
    lines.push(prefix + (isLast ? "└── " : "├── ") + side + ": " + node.val);
    const children = [["L", node.left], ["R", node.right]].filter(([, child]) => child);
    children.forEach(([childSide, child], index) => {
      const last = index === children.length - 1;
      walk(child, prefix + (isLast ? "    " : "│   "), childSide, last);
    });
  };
  const children = [["L", root.left], ["R", root.right]].filter(([, child]) => child);
  children.forEach(([side, child], index) => walk(child, "", side, index === children.length - 1));
  return lines.join("\n");
}

function parseCountedTree(tokens, start = 0) {
  const count = Number(tokens[start]);
  if (!Number.isInteger(count) || count < 0) return null;
  const values = tokens.slice(start + 1, start + 1 + count);
  if (values.length !== count) return null;
  return { tree: treeFromLevelOrder(values), next: start + 1 + count };
}

function renderGraph(input) {
  const values = input.trim().split(/\s+/);
  const vertexCount = Number(values[0]);
  const colorCount = Number(values[1]);
  const edgeCount = Number(values[2]);
  if (![vertexCount, colorCount, edgeCount].every(Number.isInteger) || vertexCount < 0 || edgeCount < 0) return null;
  const edges = [];
  const adjacency = Array.from({ length: vertexCount + 1 }, () => []);
  let cursor = 3;
  for (let i = 0; i < edgeCount; i += 1) {
    const a = Number(values[cursor++]);
    const b = Number(values[cursor++]);
    if (!Number.isInteger(a) || !Number.isInteger(b)) return null;
    edges.push(String(a) + " ─── " + b);
    adjacency[a]?.push(b);
    adjacency[b]?.push(a);
  }
  return [
    "Undirected graph · " + vertexCount + " vertices · " + colorCount + " colors",
    ...edges,
    "",
    "Adjacency:",
    ...adjacency.slice(1).map((neighbors, index) => (index + 1) + ": " + (neighbors.length ? neighbors.join(", ") : "(none)")),
  ].join("\n");
}

export function problemVisualization(title, input, output) {
  const normalizedTitle = title.toLowerCase();
  if (normalizedTitle.includes("m-coloring")) return renderGraph(input);

  if (normalizedTitle.includes("requirements to construct a unique")) {
    if (input.startsWith("PRE_POST")) {
      return "Same preorder and postorder, two possible trees:\n\n  1          1\n /            \\\n2              2";
    }
    return "Inorder marks the left and right sides of the root:\n\n       root\n      /    \\\n   left    right";
  }

  const tokens = input.trim().split(/\s+/).filter(Boolean);
  if (normalizedTitle.includes("construct binary tree from") || normalizedTitle.includes("construct a bst from preorder")) {
    return "Constructed tree:\n" + renderTree(treeFromLevelOrder(output.trim().split(/\s+/)));
  }

  if (normalizedTitle.includes("identical") || normalizedTitle.includes("merge two bst")) {
    const first = parseCountedTree(tokens, 0);
    const second = first ? parseCountedTree(tokens, first.next) : null;
    if (first && second) {
      return "Tree A:\n" + renderTree(first.tree) + "\n\nTree B:\n" + renderTree(second.tree);
    }
  }

  const parsed = parseCountedTree(tokens, 0);
  return parsed ? "Tree:\n" + renderTree(parsed.tree) : null;
}
