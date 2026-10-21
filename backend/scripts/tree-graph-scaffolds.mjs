export const nodeScaffold = (language) => {
  const sources = {
    JAVASCRIPT: `class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

class GraphNode {
  constructor(val = 0, neighbors = []) {
    this.val = val;
    this.neighbors = neighbors;
  }
}
`,
    PYTHON: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class GraphNode:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []
`,
    JAVA: `class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

class GraphNode {
    int val;
    java.util.List<GraphNode> neighbors;
    GraphNode() { this(0); }
    GraphNode(int val) { this.val = val; this.neighbors = new java.util.ArrayList<>(); }
    GraphNode(int val, java.util.List<GraphNode> neighbors) {
        this.val = val;
        this.neighbors = neighbors;
    }
}
`,
    C: `#include <stdlib.h>
#include <stddef.h>

typedef struct TreeNode {
    int val;
    struct TreeNode *left;
    struct TreeNode *right;
} TreeNode;

static TreeNode *newTreeNode(int val) {
    TreeNode *node = (TreeNode *)malloc(sizeof(TreeNode));
    if (node) { node->val = val; node->left = NULL; node->right = NULL; }
    return node;
}

typedef struct GraphNode {
    int val;
    struct GraphNode **neighbors;
    int neighborCount;
} GraphNode;
`,
    CPP: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x = 0, TreeNode *l = nullptr, TreeNode *r = nullptr)
        : val(x), left(l), right(r) {}
};

struct GraphNode {
    int val;
    vector<GraphNode*> neighbors;
    GraphNode(int x = 0) : val(x) {}
    GraphNode(int x, vector<GraphNode*> n) : val(x), neighbors(std::move(n)) {}
};
`,
  };
  return sources[language] || "";
};
