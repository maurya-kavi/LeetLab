import { db } from "../src/libs/db.js";

const langs = ["JAVASCRIPT", "PYTHON", "JAVA", "C", "CPP"];
const specs = [
  {
    title: "Find the Union of Two Sorted Arrays", tags: ["Arrays", "Two Pointers", "Sorting"],
    description: "Given two arrays sorted in non-decreasing order, return their union: every distinct value that appears in either array, in sorted order.",
    constraints: "1 <= n, m <= 100000; -10^9 <= values in either array <= 10^9; both arrays are sorted in non-decreasing order.",
    hint: "Use one pointer per array. At each step, take the smaller current value and append it only if it differs from the last value added.",
    format: "Input: n m, followed by n values of the first array and m values of the second array. Output the distinct union on one line.",
    cases: [["5 4 1 2 2 4 6 2 2 3 5", "1 2 3 4 5 6", "a = [1, 2, 2, 4, 6], b = [2, 2, 3, 5]", "Merge in sorted order and keep only one copy of each value."], ["1 1 -3 8", "-3 8", "a = [-3], b = [8]", "Neither single value is duplicated."], ["3 3 1 2 3 1 2 3", "1 2 3", "a = [1, 2, 3], b = [1, 2, 3]", "Values present in both arrays appear once in the union."]],
    snippets: {
      JAVASCRIPT: `function findUnion(a, b) {\n    const result = [];\n    let i = 0, j = 0;\n    while (i < a.length || j < b.length) {\n        let value;\n        if (j === b.length || (i < a.length && a[i] <= b[j])) value = a[i++];\n        else value = b[j++];\n        if (result.length === 0 || result[result.length - 1] !== value) result.push(value);\n    }\n    return result;\n}`,
      PYTHON: `def find_union(a, b):\n    result = []\n    i = j = 0\n    while i < len(a) or j < len(b):\n        if j == len(b) or (i < len(a) and a[i] <= b[j]):\n            value = a[i]; i += 1\n        else:\n            value = b[j]; j += 1\n        if not result or result[-1] != value:\n            result.append(value)\n    return result`,
      JAVA: `static int[] findUnion(int[] a, int[] b) {\n        int[] result = new int[a.length + b.length]; int i=0,j=0,k=0;\n        while (i<a.length || j<b.length) {\n            int value;\n            if (j==b.length || (i<a.length && a[i]<=b[j])) value=a[i++];\n            else value=b[j++];\n            if (k==0 || result[k-1]!=value) result[k++]=value;\n        }\n        return Arrays.copyOf(result,k);\n    }`,
      C: `int findUnion(const int a[], int n, const int b[], int m, int out[]) {\n    int i=0,j=0,k=0;\n    while (i<n || j<m) {\n        int value;\n        if (j==m || (i<n && a[i]<=b[j])) value=a[i++];\n        else value=b[j++];\n        if (k==0 || out[k-1]!=value) out[k++]=value;\n    }\n    return k;\n}`,
      CPP: `vector<int> findUnion(const vector<int>& a, const vector<int>& b) {\n    vector<int> result; int i=0,j=0;\n    while (i<(int)a.size() || j<(int)b.size()) {\n        int value;\n        if (j==(int)b.size() || (i<(int)a.size() && a[i]<=b[j])) value=a[i++];\n        else value=b[j++];\n        if (result.empty() || result.back()!=value) result.push_back(value);\n    }\n    return result;\n}`,
    },
    refs: {
      JAVASCRIPT: `const fs=require("fs"); const v=fs.readFileSync(0,"utf8").trim().split(/\\s+/).map(Number); let p=0; const n=v[p++],m=v[p++],a=v.slice(p,p+n);p+=n;const b=v.slice(p,p+m); console.log(findUnion(a,b).join(" "));`,
      PYTHON: `import sys\nv=list(map(int,sys.stdin.read().split())); n,m=v[0],v[1]; a=v[2:2+n]; b=v[2+n:2+n+m]\nprint(" ".join(map(str, find_union(a,b))))`,
      JAVA: `public static void main(String[] z){Scanner s=new Scanner(System.in);int n=s.nextInt(),m=s.nextInt();int[] a=new int[n],b=new int[m];for(int i=0;i<n;i++)a[i]=s.nextInt();for(int i=0;i<m;i++)b[i]=s.nextInt();int[] r=findUnion(a,b);for(int i=0;i<r.length;i++)System.out.print((i==0?"":" ")+r[i]);System.out.println();}`,
      C: `int main(void){int n,m;if(scanf("%d%d",&n,&m)!=2)return 0;int a[100005],b[100005],out[200010];for(int i=0;i<n;i++)scanf("%d",&a[i]);for(int i=0;i<m;i++)scanf("%d",&b[i]);int k=findUnion(a,n,b,m,out);for(int i=0;i<k;i++)printf(i?" %d":"%d",out[i]);printf("\\n");return 0;}`,
      CPP: `int main(){int n,m;if(!(cin>>n>>m))return 0;vector<int>a(n),b(m);for(int&x:a)cin>>x;for(int&x:b)cin>>x;auto r=findUnion(a,b);for(int i=0;i<(int)r.size();i++)cout<<(i?" ":"")<<r[i];cout<<'\\n';}`,
    },
  },
  {
    title: "Find the Number That Appears Once", tags: ["Arrays", "Bit Manipulation", "XOR"],
    description: "An array contains one value that appears once, while every other value appears exactly twice. Return the value that appears once.",
    constraints: "1 <= n <= 200000; n is odd; -2^31 <= nums[i] <= 2^31 - 1; exactly one value occurs once and all other values occur twice.",
    hint: "XOR of a value with itself is zero, and XOR with zero leaves the value unchanged.",
    format: "Input: n followed by n integers. Output the value that occurs once.",
    cases: [["5 4 1 2 1 2", "4", "nums = [4, 1, 2, 1, 2]", "Each repeated pair cancels under XOR, leaving 4."], ["1 -9", "-9", "nums = [-9]", "The only element is the unique value."], ["7 7 3 5 3 5 8 8", "7", "nums = [7, 3, 5, 3, 5, 8, 8]", "The pairs cancel and 7 remains." ]],
    snippets: {
      JAVASCRIPT: `function singleNumber(nums) {\n    let answer = 0;\n    for (const value of nums) answer ^= value;\n    return answer;\n}`,
      PYTHON: `def single_number(nums):\n    answer = 0\n    for value in nums:\n        answer ^= value\n    return answer`,
      JAVA: `static int singleNumber(int[] nums) {\n        int answer=0;\n        for (int value : nums) answer ^= value;\n        return answer;\n    }`,
      C: `int singleNumber(const int nums[], int n) {\n    int answer=0;\n    for (int i=0;i<n;i++) answer ^= nums[i];\n    return answer;\n}`,
      CPP: `int singleNumber(const vector<int>& nums) {\n    int answer=0;\n    for (int value : nums) answer ^= value;\n    return answer;\n}`,
    },
    refs: {
      JAVASCRIPT: `const fs=require("fs");const v=fs.readFileSync(0,"utf8").trim().split(/\\s+/).map(Number);console.log(singleNumber(v.slice(1)));`,
      PYTHON: `import sys\nv=list(map(int,sys.stdin.read().split())); print(single_number(v[1:]))`,
      JAVA: `public static void main(String[] z){Scanner s=new Scanner(System.in);int n=s.nextInt();int[] a=new int[n];for(int i=0;i<n;i++)a[i]=s.nextInt();System.out.println(singleNumber(a));}`,
      C: `int main(void){int n;if(scanf("%d",&n)!=1)return 0;int a[200005];for(int i=0;i<n;i++)scanf("%d",&a[i]);printf("%d\\n",singleNumber(a,n));return 0;}`,
      CPP: `int main(){int n;if(!(cin>>n))return 0;vector<int>a(n);for(int&x:a)cin>>x;cout<<singleNumber(a)<<'\\n';}`,
    },
  },
  ...[false, true].map((hasNegatives) => {
    const title = hasNegatives ? "Longest Subarray with Sum K (Positive and Negative)" : "Longest Subarray with Sum K (Positive)";
    const fn = hasNegatives ? "longestSubarrayWithSumK" : "longestPositiveSubarrayWithSumK";
    const pyfn = hasNegatives ? "longest_subarray_with_sum_k" : "longest_positive_subarray_with_sum_k";
    const assumptions = hasNegatives ? "Array values may be positive, zero, or negative." : "All array values are positive integers.";
    const hint = hasNegatives ? "Keep the earliest index for each prefix sum. If currentPrefix - k was seen, the difference in indices is a candidate length." : "Use a sliding window: expand the right edge and shrink from the left while the sum exceeds k.";
    const js = hasNegatives
      ? `function ${fn}(nums, k) {\n    const firstIndex = new Map([[0, -1]]); let sum=0,best=0;\n    for(let i=0;i<nums.length;i++){sum+=nums[i];if(firstIndex.has(sum-k))best=Math.max(best,i-firstIndex.get(sum-k));if(!firstIndex.has(sum))firstIndex.set(sum,i);}\n    return best;\n}`
      : `function ${fn}(nums, k) {\n    let left=0,sum=0,best=0;\n    for(let right=0;right<nums.length;right++){sum+=nums[right];while(left<=right&&sum>k)sum-=nums[left++];if(sum===k)best=Math.max(best,right-left+1);}\n    return best;\n}`;
    const py = hasNegatives
      ? `def ${pyfn}(nums, k):\n    first_index = {0: -1}; total = best = 0\n    for i, value in enumerate(nums):\n        total += value\n        if total - k in first_index: best = max(best, i - first_index[total-k])\n        if total not in first_index: first_index[total] = i\n    return best`
      : `def ${pyfn}(nums, k):\n    left = total = best = 0\n    for right, value in enumerate(nums):\n        total += value\n        while left <= right and total > k:\n            total -= nums[left]; left += 1\n        if total == k: best = max(best, right - left + 1)\n    return best`;
    const java = hasNegatives
      ? `static int ${fn}(int[] nums,int k){Map<Long,Integer> first=new HashMap<>();first.put(0L,-1);long sum=0;int best=0;for(int i=0;i<nums.length;i++){sum+=nums[i];if(first.containsKey(sum-k))best=Math.max(best,i-first.get(sum-k));first.putIfAbsent(sum,i);}return best;}`
      : `static int ${fn}(int[] nums,int k){int left=0,sum=0,best=0;for(int right=0;right<nums.length;right++){sum+=nums[right];while(left<=right&&sum>k)sum-=nums[left++];if(sum==k)best=Math.max(best,right-left+1);}return best;}`;
    const c = hasNegatives
      ? `int ${fn}(const int a[],int n,int k){const int cap=524287;long long*keys=calloc(cap,sizeof(long long));int*indices=malloc(cap*sizeof(int));char*used=calloc(cap,sizeof(char));if(!keys||!indices||!used){free(keys);free(indices);free(used);return 0;}long long sum=0;int best=0;int slot=0;keys[slot]=0;indices[slot]=-1;used[slot]=1;for(int i=0;i<n;i++){sum+=a[i];long long target=sum-k;slot=(int)((target%cap+cap)%cap);while(used[slot]&&keys[slot]!=target)slot=(slot+1)%cap;if(used[slot]&&i-indices[slot]>best)best=i-indices[slot];slot=(int)((sum%cap+cap)%cap);while(used[slot]&&keys[slot]!=sum)slot=(slot+1)%cap;if(!used[slot]){used[slot]=1;keys[slot]=sum;indices[slot]=i;}}free(keys);free(indices);free(used);return best;}`
      : `int ${fn}(const int a[],int n,int k){int left=0,best=0;long long sum=0;for(int right=0;right<n;right++){sum+=a[right];while(left<=right&&sum>k)sum-=a[left++];if(sum==k&&right-left+1>best)best=right-left+1;}return best;}`;
    const cpp = hasNegatives
      ? `int ${fn}(const vector<int>& a,int k){unordered_map<long long,int> first{{0,-1}};long long sum=0;int best=0;for(int i=0;i<(int)a.size();i++){sum+=a[i];if(first.count(sum-k))best=max(best,i-first[sum-k]);if(!first.count(sum))first[sum]=i;}return best;}`
      : `int ${fn}(const vector<int>& a,int k){int left=0,best=0;long long sum=0;for(int right=0;right<(int)a.size();right++){sum+=a[right];while(left<=right&&sum>k)sum-=a[left++];if(sum==k)best=max(best,right-left+1);}return best;}`;
    const cases = hasNegatives
      ? [["6 3 1 2 -1 3 1 -2", "5", "nums = [1, 2, -1, 3, 1, -2], k = 3", "The subarray [2, -1, 3, 1, -2] sums to 3 and has length 5."], ["4 0 1 -1 5 -5", "4", "nums = [1, -1, 5, -5], k = 0", "The full array sums to zero, so its length 4 is valid."], ["3 7 -2 4 1", "0", "nums = [-2, 4, 1], k = 7", "No contiguous subarray has sum 7."]]
      : [["6 5 1 2 1 1 1 3", "4", "nums = [1, 2, 1, 1, 1, 3], k = 5", "The longest range summing to 5 is [1, 2, 1, 1], of length 4."], ["4 3 1 1 1 1", "3", "nums = [1, 1, 1, 1], k = 3", "Any three adjacent values sum to 3."], ["3 20 2 4 6", "0", "nums = [2, 4, 6], k = 20", "No subarray reaches sum 20."]];
    return {
      title, tags: ["Arrays", "Prefix Sum", ...(hasNegatives ? ["Hashing"] : ["Sliding Window", "Two Pointers"])],
      description: `Given an integer array and a target k, return the length of the longest contiguous subarray whose elements sum to k. If no such subarray exists, return 0. ${assumptions}`,
      constraints: `1 <= n <= 200000; -10^9 <= k <= 10^9; ${hasNegatives ? "-10^9 <= nums[i] <= 10^9" : "1 <= nums[i] <= 10^9"}`,
      hint, format: "Input: n and k, followed by n space-separated integers. Output the maximum length.",
      cases, snippets: { JAVASCRIPT: js, PYTHON: py, JAVA: java, C: c, CPP: cpp },
      refs: {
        JAVASCRIPT: `const fs=require("fs");const v=fs.readFileSync(0,"utf8").trim().split(/\\s+/).map(Number);const n=v[0],k=v[1];console.log(${fn}(v.slice(2,2+n),k));`,
        PYTHON: `import sys\nv=list(map(int,sys.stdin.read().split())); n,k=v[0],v[1]\nprint(${pyfn}(v[2:2+n],k))`,
        JAVA: `public static void main(String[] z){Scanner s=new Scanner(System.in);int n=s.nextInt(),k=s.nextInt();int[] a=new int[n];for(int i=0;i<n;i++)a[i]=s.nextInt();System.out.println(${fn}(a,k));}`,
        C: `int main(void){int n,k;if(scanf("%d%d",&n,&k)!=2)return 0;int a[200005];for(int i=0;i<n;i++)scanf("%d",&a[i]);printf("%d\\n",${fn}(a,n,k));return 0;}`,
        CPP: `int main(){int n,k;if(!(cin>>n>>k))return 0;vector<int>a(n);for(int&x:a)cin>>x;cout<<${fn}(a,k)<<'\\n';}`,
      },
    };
  }),
];

function program(p, lang, reference) {
  const fn = p.snippets[lang];
  const main = p.refs[lang];
  const isUnion = p.title === "Find the Union of Two Sorted Arrays";
  if (lang === "JAVASCRIPT") {
    const body = reference ? fn : `${fn.slice(0, fn.indexOf("{"))}{\n    // Implement the operation and return the required answer.\n    return ${isUnion ? "[]" : "0"};\n}`;
    return `const fs = require("fs");\n\n${body}\n\n${main}`;
  }
  if (lang === "PYTHON") {
    const body = reference ? fn : `${fn.slice(0, fn.indexOf("\n"))}\n    # Implement the operation and return the required answer.\n    return ${isUnion ? "[]" : "0"}`;
    return `import sys\n\n${body}\n\n${main}`;
  }
  if (lang === "JAVA") {
    const body = reference ? fn : `${fn.slice(0, fn.indexOf("{"))}{\n        // Implement the operation and return the required answer.\n        return ${isUnion ? "new int[0]" : "0"};\n    }`;
    return `import java.util.*;\n\nclass Main {\n    ${body}\n\n    ${main}\n}`;
  }
  const includes = lang === "C" ? "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>" : "#include <bits/stdc++.h>\nusing namespace std;";
  const body = reference ? fn : `${fn.slice(0, fn.indexOf("{"))}{\n    // Implement the operation and return the required answer.\n    ${lang === "CPP" && isUnion ? "return {};" : "return 0;"}\n}`;
  return `${includes}\n\n${body}\n\n${main}`;
}

try {
  const admin = await db.user.findFirst({ where: { role: "ADMIN" }, select: { id: true } });
  if (!admin) throw new Error("Create an ADMIN account before importing this batch.");
  let added = 0, refreshed = 0;
  for (const p of specs) {
    const testcases = p.cases.map(([input, output, displayInput, explanation], i) => ({ input, output, displayInput, explanation, isPublic: true, testCaseNumber: i + 1 }));
    const data = {
      description: `${p.description}\n\n${p.format}`,
      constraints: p.constraints, difficulty: "EASY", tags: p.tags,
      hints: p.hint,
      editorial: "Select the data structure or traversal pattern that matches the input constraints. Preserve required ordering and handle duplicates or negative values exactly as specified.",
      examples: p.cases.map(([, output, input, explanation]) => ({ input, output, explanation })),
      testcases,
      codeSnippets: Object.fromEntries(langs.map((lang) => [lang, program(p, lang, false)])),
      referenceSolutions: Object.fromEntries(langs.map((lang) => [lang, program(p, lang, true)])),
    };
    const old = await db.problem.findFirst({ where: { title: p.title, tags: { has: "Arrays" } }, select: { id: true } });
    if (old) { await db.problem.update({ where: { id: old.id }, data }); refreshed++; }
    else { await db.problem.create({ data: { ...data, title: p.title, userId: admin.id } }); added++; }
  }
  console.log(`Arrays Easy remaining batch complete: ${added} added, ${refreshed} refreshed.`);
} finally { await db.$disconnect(); }
