import { db } from "../src/libs/db.js";

// Input for every problem: n, followed by n integers. Search adds target;
// rotate-by-k adds k after the array. Solutions print one line of output.
const items = [
  ["Sum of Array Elements", "basic-sum-array", "Given n integers, return their sum.", "1 <= n <= 10^5"],
  ["Count of Odd Numbers in Array", "basic-count-odd", "Count how many elements are odd.", "1 <= n <= 10^5"],
  ["Check if the Array is Sorted", "basic-sorted", "Return 1 if the array is non-decreasing, otherwise return 0.", "1 <= n <= 10^5"],
  ["Reverse an Array", "basic-reverse", "Return the elements in reverse order.", "1 <= n <= 10^5"],
  ["Linear Search", "basic-linear-search", "Find target in the array and return its zero-based index, or -1 if absent. Input includes target after the array.", "1 <= n <= 10^5"],
  ["Largest Element", "basic-largest", "Return the largest element in the array.", "1 <= n <= 10^5"],
  ["Second Largest Element", "basic-second-largest", "Return the second largest distinct value, or -1 if it does not exist.", "1 <= n <= 10^5"],
  ["Maximum Consecutive Ones", "basic-consecutive-ones", "Return the longest run of consecutive 1 values.", "1 <= n <= 10^5; each value is 0 or 1"],
  ["Left Rotate Array by One", "basic-rotate-one", "Move the first element to the end and return the resulting array.", "1 <= n <= 10^5"],
  ["Left Rotate Array by K Places", "basic-rotate-k", "Rotate the array left by k positions. Input includes k after the array.", "1 <= n <= 10^5; 0 <= k <= 10^9"],
  ["Move Zeros to End", "basic-move-zeros", "Move all zeros to the end while preserving the order of non-zero values.", "1 <= n <= 10^5"],
  ["Remove Duplicates from Sorted Array", "basic-remove-duplicates", "Return the sorted array with duplicates removed.", "1 <= n <= 10^5; input array is sorted"],
  ["Find Missing Number", "basic-missing-number", "The array contains distinct values from 0 to n with one value missing. Return the missing value.", "0 <= array values <= n"],
];
const topicTags = {
  "basic-sum-array": ["Arrays", "Array Traversal"],
  "basic-count-odd": ["Arrays", "Array Traversal"],
  "basic-sorted": ["Arrays", "Sorting"],
  "basic-reverse": ["Arrays", "Two Pointers"],
  "basic-linear-search": ["Arrays", "Searching"],
  "basic-largest": ["Arrays", "Array Traversal"],
  "basic-second-largest": ["Arrays", "Array Traversal"],
  "basic-consecutive-ones": ["Arrays", "Counting"],
  "basic-rotate-one": ["Arrays", "Array Rotation"],
  "basic-rotate-k": ["Arrays", "Array Rotation"],
  "basic-move-zeros": ["Arrays", "Two Pointers"],
  "basic-remove-duplicates": ["Arrays", "Two Pointers"],
  "basic-missing-number": ["Arrays", "Array Traversal"],
};

const jsImpl = {
  "basic-sum-array": "return a.reduce((s, x) => s + x, 0);",
  "basic-count-odd": "return a.filter(x => Math.abs(x % 2) === 1).length;",
  "basic-sorted": "return a.every((x, i) => i === 0 || a[i - 1] <= x) ? 1 : 0;",
  "basic-reverse": "return a.reverse();",
  "basic-linear-search": "return a.indexOf(extra);",
  "basic-largest": "return Math.max(...a);",
  "basic-second-largest": "{ const u = [...new Set(a)].sort((x, y) => y - x); return u.length > 1 ? u[1] : -1; }",
  "basic-consecutive-ones": "{ let best = 0, run = 0; for (const x of a) { run = x === 1 ? run + 1 : 0; best = Math.max(best, run); } return best; }",
  "basic-rotate-one": "{ if (a.length > 1) a.push(a.shift()); return a; }",
  "basic-rotate-k": "{ const k = extra % a.length; return a.slice(k).concat(a.slice(0, k)); }",
  "basic-move-zeros": "{ const nz = a.filter(x => x !== 0); return nz.concat(Array(a.length - nz.length).fill(0)); }",
  "basic-remove-duplicates": "return a.filter((x, i) => i === 0 || x !== a[i - 1]);",
  "basic-missing-number": "return a.length * (a.length + 1) / 2 - a.reduce((s, x) => s + x, 0);",
};
const pyImpl = {
  "basic-sum-array": "return sum(a)",
  "basic-count-odd": "return sum(1 for x in a if x % 2 != 0)",
  "basic-sorted": "return int(all(a[i - 1] <= a[i] for i in range(1, len(a))))",
  "basic-reverse": "return a[::-1]",
  "basic-linear-search": "return a.index(extra) if extra in a else -1",
  "basic-largest": "return max(a)",
  "basic-second-largest": "u = sorted(set(a), reverse=True)\nreturn u[1] if len(u) > 1 else -1",
  "basic-consecutive-ones": "best = run = 0\nfor x in a:\n    run = run + 1 if x == 1 else 0\n    best = max(best, run)\nreturn best",
  "basic-rotate-one": "return a[1:] + a[:1]",
  "basic-rotate-k": "k = extra % len(a)\nreturn a[k:] + a[:k]",
  "basic-move-zeros": "nz = [x for x in a if x != 0]\nreturn nz + [0] * (len(a) - len(nz))",
  "basic-remove-duplicates": "return [x for i, x in enumerate(a) if i == 0 or x != a[i - 1]]",
  "basic-missing-number": "return len(a) * (len(a) + 1) // 2 - sum(a)",
};
const javaImpl = {
  "basic-sum-array": "int s=0; for(int x:a)s+=x; return s;",
  "basic-count-odd": "int c=0; for(int x:a)if(x%2!=0)c++; return c;",
  "basic-sorted": "for(int i=1;i<a.length;i++)if(a[i-1]>a[i])return 0; return 1;",
  "basic-reverse": "for(int l=0,r=a.length-1;l<r;l++,r--){int t=a[l];a[l]=a[r];a[r]=t;} return a;",
  "basic-linear-search": "for(int i=0;i<a.length;i++)if(a[i]==extra)return i; return -1;",
  "basic-largest": "int m=a[0]; for(int x:a)m=Math.max(m,x); return m;",
  "basic-second-largest": "int first=Integer.MIN_VALUE, second=Integer.MIN_VALUE; for(int x:a){if(x>first){second=first;first=x;}else if(x<first&&x>second)second=x;} return second==Integer.MIN_VALUE?-1:second;",
  "basic-consecutive-ones": "int best=0,run=0; for(int x:a){run=x==1?run+1:0;best=Math.max(best,run);} return best;",
  "basic-rotate-one": "if(a.length>1){int x=a[0];System.arraycopy(a,1,a,0,a.length-1);a[a.length-1]=x;} return a;",
  "basic-rotate-k": "int k=extra%a.length; int[] b=new int[a.length]; for(int i=0;i<a.length;i++)b[i]=a[(i+k)%a.length]; return b;",
  "basic-move-zeros": "int[] b=new int[a.length]; int j=0; for(int x:a)if(x!=0)b[j++]=x; return b;",
  "basic-remove-duplicates": "int j=0; for(int x:a)if(j==0||a[j-1]!=x)a[j++]=x; return java.util.Arrays.copyOf(a,j);",
  "basic-missing-number": "int s=a.length*(a.length+1)/2; for(int x:a)s-=x; return s;",
};

function source(id, lang, reference = true) {
  if (!reference) {
    const needsExtra = id === "basic-linear-search" || id === "basic-rotate-k";
    const functionName = {
      "basic-sum-array": "sumArray",
      "basic-count-odd": "countOddNumbers",
      "basic-sorted": "isNonDecreasing",
      "basic-reverse": "reverseArray",
      "basic-linear-search": "linearSearch",
      "basic-largest": "findLargest",
      "basic-second-largest": "findSecondLargest",
      "basic-consecutive-ones": "maxConsecutiveOnes",
      "basic-rotate-one": "rotateLeftByOne",
      "basic-rotate-k": "rotateLeftByK",
      "basic-move-zeros": "moveZeroesToEnd",
      "basic-remove-duplicates": "removeDuplicates",
      "basic-missing-number": "findMissingNumber",
    }[id];
    if (lang === "JAVASCRIPT") return `const fs = require("fs");
const values = fs.readFileSync(0, "utf8").trim().split(/\\s+/).map(Number);
const n = values[0];
const nums = values.slice(1, n + 1);
const extra = values[n + 1] ?? 0; // target or rotation count, when needed

function ${functionName}(nums, extra) {
    // Implement the operation described in the problem.
    // Return a number for scalar answers or an array for array answers.
    return 0;
}

const result = ${functionName}(nums, extra);
console.log(Array.isArray(result) ? result.join(" ") : result);`;

    if (lang === "PYTHON") return `import sys

def ${functionName}(nums, extra):
    """Return the answer for this problem."""
    # Implement the operation described in the problem.
    # Return a number for scalar answers or a list for array answers.
    return 0

values = list(map(int, sys.stdin.read().split()))
n = values[0]
nums = values[1 : n + 1]
extra = values[n + 1] if len(values) > n + 1 else 0  # target or rotation count

result = ${functionName}(nums, extra)
print(" ".join(map(str, result)) if isinstance(result, list) else result)`;

    if (lang === "JAVA") return `import java.util.*;

class Main {
    static Object ${functionName}(int[] nums, int extra) {
        // Implement the operation described in the problem.
        // Return an int for scalar answers or int[] for array answers.
        return 0;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) {
            nums[i] = scanner.nextInt();
        }
        int extra = scanner.hasNextInt() ? scanner.nextInt() : 0;
        Object result = ${functionName}(nums, extra);

        if (result instanceof int[]) {
            int[] answer = (int[]) result;
            for (int i = 0; i < answer.length; i++) {
                if (i > 0) System.out.print(" ");
                System.out.print(answer[i]);
            }
            System.out.println();
        } else {
            System.out.println(result);
        }
    }
}`;

    if (lang === "C") return `#include <stdio.h>

void ${functionName}(const int nums[], int n, int extra) {
    // Write your solution here and print the answer with printf.
    // extra is the target or rotation count when this problem needs one.
}

int main(void) {
    int n = 0;
    if (scanf("%d", &n) != 1) return 0;

    int nums[100005];
    for (int i = 0; i < n; i++) {
        scanf("%d", &nums[i]);
    }
    ${needsExtra ? "int extra = 0;\n    scanf(\"%d\", &extra);" : "int extra = 0;"}

    ${functionName}(nums, n, extra);
    return 0;
}`;

    return `#include <bits/stdc++.h>
using namespace std;

void ${functionName}(vector<int> nums, int extra) {
    // Write your solution here and print the answer with cout.
    // extra is the target or rotation count when this problem needs one.
}

int main() {
    int n = 0;
    if (!(cin >> n)) return 0;

    vector<int> nums(n);
    for (int &value : nums) {
        cin >> value;
    }
    ${needsExtra ? "int extra = 0;\n    cin >> extra;" : "int extra = 0;"}

    ${functionName}(nums, extra);
    return 0;
}`;
  }

  if (lang === "C" || lang === "CPP") {
    if (!reference) {
      const include = lang === "C" ? "#include <stdio.h>" : "#include <bits/stdc++.h>\nusing namespace std;";
      return `${include}\nint main() {\n    int n;\n    if (scanf("%d", &n) != 1) return 0;\n    int values[100005];\n    for (int i = 0; i < n; i++) scanf("%d", &values[i]);\n    // TODO: implement the required array operation and print the result\n    return 0;\n}`;
    }
    const include = lang === "C" ? "#include <limits.h>\n#include <stdio.h>" : "#include <bits/stdc++.h>\nusing namespace std;";
    const body = {
      "basic-sum-array": "long long sum=0; for(int i=0;i<n;i++)sum+=a[i]; printf(\"%lld\\n\",sum);",
      "basic-count-odd": "int count=0; for(int i=0;i<n;i++)if(a[i]%2!=0)count++; printf(\"%d\\n\",count);",
      "basic-sorted": "int sorted=1; for(int i=1;i<n;i++)if(a[i-1]>a[i])sorted=0; printf(\"%d\\n\",sorted);",
      "basic-reverse": "for(int l=0,r=n-1;l<r;l++,r--){int t=a[l];a[l]=a[r];a[r]=t;} for(int i=0;i<n;i++)printf(i?\" %d\":\"%d\",a[i]); printf(\"\\n\");",
      "basic-linear-search": "int target=0; scanf(\"%d\",&target); int answer=-1; for(int i=0;i<n;i++)if(a[i]==target){answer=i;break;} printf(\"%d\\n\",answer);",
      "basic-largest": "int answer=a[0]; for(int i=1;i<n;i++)if(a[i]>answer)answer=a[i]; printf(\"%d\\n\",answer);",
      "basic-second-largest": "int first=INT_MIN,second=INT_MIN; for(int i=0;i<n;i++){if(a[i]>first){second=first;first=a[i];}else if(a[i]<first&&a[i]>second)second=a[i];} printf(\"%d\\n\",second==INT_MIN?-1:second);",
      "basic-consecutive-ones": "int best=0,run=0; for(int i=0;i<n;i++){run=a[i]==1?run+1:0;if(run>best)best=run;} printf(\"%d\\n\",best);",
      "basic-rotate-one": "if(n>1){int first=a[0];for(int i=1;i<n;i++)a[i-1]=a[i];a[n-1]=first;} for(int i=0;i<n;i++)printf(i?\" %d\":\"%d\",a[i]); printf(\"\\n\");",
      "basic-rotate-k": "int k=0; scanf(\"%d\",&k); k%=n; for(int i=0;i<n;i++)printf(i?\" %d\":\"%d\",a[(i+k)%n]); printf(\"\\n\");",
      "basic-move-zeros": "int j=0; for(int i=0;i<n;i++)if(a[i]!=0)a[j++]=a[i]; while(j<n)a[j++]=0; for(int i=0;i<n;i++)printf(i?\" %d\":\"%d\",a[i]); printf(\"\\n\");",
      "basic-remove-duplicates": "int j=0; for(int i=0;i<n;i++)if(j==0||a[j-1]!=a[i])a[j++]=a[i]; for(int i=0;i<j;i++)printf(i?\" %d\":\"%d\",a[i]); printf(\"\\n\");",
      "basic-missing-number": "long long answer=(long long)n*(n+1)/2; for(int i=0;i<n;i++)answer-=a[i]; printf(\"%lld\\n\",answer);",
    }[id];
    return `${include}\nint main(void) { int n; if(scanf("%d",&n)!=1)return 0; int a[100005]; for(int i=0;i<n;i++)scanf("%d",&a[i]); ${id === "basic-linear-search" || id === "basic-rotate-k" ? "int extra;" : ""} ${body} return 0; }`;
  }
  const js = reference ? jsImpl[id] : "// TODO: implement the array operation\nreturn 0;";
  const py = reference ? pyImpl[id] : "# TODO: implement the array operation\n    return 0";
  const java = reference ? javaImpl[id] : "// TODO: implement the array operation\nreturn 0;";
  if (lang === "JAVASCRIPT") return `const fs=require('fs');\nconst v=fs.readFileSync(0,'utf8').trim().split(/\\s+/).map(Number);\nconst n=v[0], a=v.slice(1,n+1), extra=v[n+1];\nfunction solve(a, extra){ ${js} }\nconst out=solve(a,extra);\nconsole.log(Array.isArray(out)?out.join(' '):out);`;
  if (lang === "PYTHON") return `import sys\nv=list(map(int,sys.stdin.read().split()))\nn=v[0]; a=v[1:1+n]; extra=v[1+n] if len(v)>n+1 else 0\ndef solve(a, extra):\n    ${py.replaceAll("\n", "\n    ")}\nout=solve(a,extra)\nprint(' '.join(map(str,out)) if isinstance(out,list) else out)`;
  return `import java.util.*;\nclass Main {\n static Object solve(int[] a,int extra){ ${java} }\n public static void main(String[] z){ Scanner s=new Scanner(System.in); int n=s.nextInt(); int[] a=new int[n]; for(int i=0;i<n;i++)a[i]=s.nextInt(); int extra=s.hasNextInt()?s.nextInt():0; Object o=solve(a,extra); if(o instanceof int[])System.out.println(String.join(" ",Arrays.stream((int[])o).mapToObj(String::valueOf).toArray(String[]::new))); else System.out.println(o); }\n}`;
}

const testCasesById = {
  "basic-sum-array": [["5 1 2 3 4 5", "15", "nums = [1, 2, 3, 4, 5]", "Add every value: 1 + 2 + 3 + 4 + 5 = 15."], ["1 -8", "-8", "nums = [-8]", "A one-element array sums to that element."], ["4 5 0 -2 7", "10", "nums = [5, 0, -2, 7]", "The total is 5 + 0 - 2 + 7 = 10."]],
  "basic-count-odd": [["5 1 2 3 4 5", "3", "nums = [1, 2, 3, 4, 5]", "The odd values are 1, 3, and 5."], ["4 2 4 6 8", "0", "nums = [2, 4, 6, 8]", "There are no odd values."], ["1 -3", "1", "nums = [-3]", "Negative odd values are odd too."]],
  "basic-sorted": [["5 1 2 3 4 5", "1", "nums = [1, 2, 3, 4, 5]", "Every value is at least the value before it."], ["5 1 3 2 4 5", "0", "nums = [1, 3, 2, 4, 5]", "The pair 3, 2 breaks the non-decreasing order."], ["1 7", "1", "nums = [7]", "A one-element array is sorted."]],
  "basic-reverse": [["5 1 2 3 4 5", "5 4 3 2 1", "nums = [1, 2, 3, 4, 5]", "Reverse the element order."], ["2 1 9", "9 1", "nums = [1, 9]", "The two elements swap positions."], ["4 -1 0 8 3", "3 8 0 -1", "nums = [-1, 0, 8, 3]", "Read the array from its last element to its first."]],
  "basic-linear-search": [["5 1 2 3 4 5 3", "2", "nums = [1, 2, 3, 4, 5], target = 3", "The target 3 is at zero-based index 2."], ["4 6 7 8 9 5", "-1", "nums = [6, 7, 8, 9], target = 5", "The target is not present, so return -1."], ["1 42 42", "0", "nums = [42], target = 42", "The target is the only element, at index 0."]],
  "basic-largest": [["5 1 2 3 4 5", "5", "nums = [1, 2, 3, 4, 5]", "The maximum value is 5."], ["3 -9 -2 -7", "-2", "nums = [-9, -2, -7]", "The largest value can be negative."], ["1 42", "42", "nums = [42]", "The only element is the maximum."]],
  "basic-second-largest": [["5 1 2 3 4 5", "4", "nums = [1, 2, 3, 4, 5]", "The second-largest distinct value is 4."], ["5 9 9 7 7 5", "7", "nums = [9, 9, 7, 7, 5]", "Ignore duplicates; 7 is the second distinct maximum."], ["3 4 4 4", "-1", "nums = [4, 4, 4]", "There is no second distinct value."]],
  "basic-consecutive-ones": [["5 1 1 0 1 1", "2", "nums = [1, 1, 0, 1, 1]", "The longest run of ones has length 2."], ["4 1 1 1 1", "4", "nums = [1, 1, 1, 1]", "All four values form one run."], ["4 0 0 0 0", "0", "nums = [0, 0, 0, 0]", "There are no ones."]],
  "basic-rotate-one": [["5 1 2 3 4 5", "2 3 4 5 1", "nums = [1, 2, 3, 4, 5]", "Move the first value to the end."], ["1 8", "8", "nums = [8]", "A one-element array stays unchanged."], ["3 4 9 -1", "9 -1 4", "nums = [4, 9, -1]", "Shift left once and append the first value."]],
  "basic-rotate-k": [["5 1 2 3 4 5 2", "3 4 5 1 2", "nums = [1, 2, 3, 4, 5], k = 2", "The first two values move to the end."], ["4 1 2 3 4 4", "1 2 3 4", "nums = [1, 2, 3, 4], k = 4", "Rotating by the array length leaves it unchanged."], ["3 7 8 9 1", "8 9 7", "nums = [7, 8, 9], k = 1", "Shift left once."]],
  "basic-move-zeros": [["5 0 1 0 2 3", "1 2 3 0 0", "nums = [0, 1, 0, 2, 3]", "Keep non-zero values in order and append two zeros."], ["3 0 0 0", "0 0 0", "nums = [0, 0, 0]", "All values are already zero."], ["4 1 2 3 4", "1 2 3 4", "nums = [1, 2, 3, 4]", "With no zeros, the array stays unchanged."]],
  "basic-remove-duplicates": [["5 1 1 2 2 3", "1 2 3", "nums = [1, 1, 2, 2, 3]", "Keep one copy of each value in sorted order."], ["3 1 1 1", "1", "nums = [1, 1, 1]", "All duplicates collapse to one value."], ["4 1 2 3 4", "1 2 3 4", "nums = [1, 2, 3, 4]", "No values repeat."]],
  "basic-missing-number": [["5 1 2 3 4 5", "0", "nums = [1, 2, 3, 4, 5]", "The range is 0 through 5; 0 is missing."], ["4 3 0 1 4", "2", "nums = [3, 0, 1, 4]", "The range is 0 through 4; 2 is missing."], ["1 0", "1", "nums = [0]", "The range is 0 through 1; 1 is missing."]],
};

const casesFor = (id) => testCasesById[id].map(([input, output, displayInput, explanation], index) => ({
  input, output, displayInput, explanation, isPublic: true, testCaseNumber: index + 1,
}));

try {
  const admin = await db.user.findFirst({ where: { role: "ADMIN" }, select: { id: true } });
  if (!admin) throw new Error("Create an ADMIN account before importing this sheet.");
  let added = 0;
  let refreshed = 0;
  for (const [title, id, description, constraints] of items) {
    const langs = ["JAVASCRIPT", "PYTHON", "JAVA", "C", "CPP"];
    const present = await db.problem.findFirst({ where: { title, tags: { has: "Arrays" } }, select: { id: true } });
    if (present) {
      const existing = await db.problem.findUnique({ where: { id: present.id } });
      const cases = casesFor(id);
      await db.problem.update({ where: { id: present.id }, data: {
        tags: topicTags[id],
        examples: cases.map(({ displayInput, output, explanation }) => ({ input: displayInput, output, explanation })),
        testcases: cases,
        codeSnippets: Object.fromEntries(langs.map((language) => [language, source(id, language, false)])),
        referenceSolutions: Object.fromEntries(langs.map((language) => [language, source(id, language)])),
      } });
      refreshed++;
      continue;
    }
    const cases = casesFor(id);
    const examples = cases.map(({ displayInput, output, explanation }) => ({ input: displayInput, output, explanation }));
    await db.problem.create({ data: {
      title, description: `${description}\n\nInput format: first provide n, then n space-separated integers${id === "basic-linear-search" ? ", then target" : id === "basic-rotate-k" ? ", then k" : ""}. Output the answer on one line.`,
      difficulty: "EASY", tags: topicTags[id], constraints,
      hints: "First identify whether the task needs one scan, two pointers, or a simple in-place transformation.",
      editorial: "Read the array once where possible. For transformations, preserve the required order and avoid unnecessary nested loops.",
      examples, testcases: cases,
      codeSnippets: Object.fromEntries(langs.map((language) => [language, source(id, language, false)])),
      referenceSolutions: Object.fromEntries(langs.map((language) => [language, source(id, language)])),
      userId: admin.id,
    }});
    added++;
  }
  const stairs = await db.problem.findFirst({ where: { title: "Climbing Stairs" } });
  if (stairs) {
    const cStairs = `#include <stdio.h>\nint climbStairs(int n) { if (n <= 2) return n; int a=1,b=2; for(int i=3;i<=n;i++){int next=a+b;a=b;b=next;} return b; }\nint main(void){int n;if(scanf("%d",&n)!=1)return 0;printf("%d\\n",climbStairs(n));return 0;}`;
    const cppStairs = `#include <bits/stdc++.h>\nusing namespace std;\nint climbStairs(int n) { if (n <= 2) return n; int a=1,b=2; for(int i=3;i<=n;i++){int next=a+b;a=b;b=next;} return b; }\nint main(){int n;if(!(cin>>n))return 0;cout<<climbStairs(n)<<'\\n';}`;
    const stairsCases = [
      { input: "2", output: "2", displayInput: "n = 2", explanation: "There are two ways: 1 + 1 and 2.", isPublic: true },
      { input: "3", output: "3", displayInput: "n = 3", explanation: "There are three ways: 1 + 1 + 1, 1 + 2, and 2 + 1.", isPublic: true },
      { input: "4", output: "5", displayInput: "n = 4", explanation: "The answer is ways(3) + ways(2) = 3 + 2 = 5.", isPublic: true },
    ];
    await db.problem.update({ where: { id: stairs.id }, data: {
      examples: stairsCases.map(({ displayInput, output, explanation }) => ({ input: displayInput, output, explanation })),
      testcases: stairsCases,
      codeSnippets: {
        JAVASCRIPT: `const fs = require("fs");

function climbStairs(n) {
    // TODO: return the number of distinct ways to reach step n.
    return 0;
}

const n = Number(fs.readFileSync(0, "utf8").trim());
console.log(climbStairs(n));`,
        PYTHON: `import sys

def climb_stairs(n):
    """Return the number of distinct ways to reach step n."""
    # TODO: implement the solution.
    return 0

n = int(sys.stdin.readline())
print(climb_stairs(n))`,
        JAVA: `import java.util.Scanner;

class Main {
    static int climbStairs(int n) {
        // TODO: return the number of distinct ways to reach step n.
        return 0;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        System.out.println(climbStairs(n));
    }
}`,
        C: `#include <stdio.h>

int climbStairs(int n) {
    // TODO: return the number of distinct ways to reach step n.
    return 0;
}

int main(void) {
    int n = 0;
    if (scanf("%d", &n) != 1) return 0;
    printf("%d\\n", climbStairs(n));
    return 0;
}`,
        CPP: `#include <iostream>
using namespace std;

int climbStairs(int n) {
    // TODO: return the number of distinct ways to reach step n.
    return 0;
}

int main() {
    int n = 0;
    if (!(cin >> n)) return 0;
    cout << climbStairs(n) << '\\n';
    return 0;
}`,
      },
      referenceSolutions: { ...stairs.referenceSolutions, C: cStairs, CPP: cppStairs },
    } });
  }
  console.log(`Added ${added} Basic Array problems, refreshed ${refreshed} array records, and backfilled C/C++ on existing problems.`);
} finally {
  await db.$disconnect();
}
