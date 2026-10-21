import { db } from "../src/libs/db.js";

const rows = [];
const P = (title,difficulty,tags,task,constraints,hint,format,cases) => rows.push({title,difficulty,tags,task,constraints,hint,format,cases});

P("Product of Array Except Self","MEDIUM",["Arrays","Prefix Product"],"For each index, return the product of every array value except the value at that index. Do not use division.","2 <= n <= 200000; products fit in signed 64-bit integers.","Combine the product to the left of an index with the product to its right.","Input: n followed by n integers. Output n result values.",[
["4 1 2 3 4","24 12 8 6","values = [1,2,3,4]","Each output multiplies the other three values."],
["5 -1 1 0 -3 3","0 0 9 0 0","values = [-1,1,0,-3,3]","The zero makes every product zero except the one that excludes it."],
["2 2 3","3 2","values = [2,3]","Each position receives the other single value."]
]);
P("Container With Most Water","MEDIUM",["Arrays","Two Pointers","Greedy"],"Choose two vertical lines so they and the x-axis contain the maximum possible amount of water. Return that maximum area.","2 <= n <= 200000; 0 <= height[i] <= 10^9.","Start at both ends; after measuring the area, move the pointer at the shorter line inward.","Input: n followed by n heights. Output the maximum area.",[
["9 1 8 6 2 5 4 8 3 7","49","lines at indices 1 and 8 have heights 8 and 7","Their width is 7 and the limiting height is 7, giving area 49."],
["2 1 1","1","two lines of height 1","Width and limiting height are both 1."],
["5 4 3 2 1 4","16","the end lines both have height 4","Width 4 times height 4 gives area 16."]
]);
P("Group Anagrams","MEDIUM",["Strings","Hashing","Sorting"],"Group words that contain the same letters. Sort words inside each group and order groups by their first word.","1 <= n <= 100000; words are lowercase English letters; total characters <= 200000.","Use a canonical key such as the sorted letters of each word, then sort the groups for deterministic output.","Input: n followed by n words. Output one sorted group per line.",[
["6 eat tea tan ate nat bat","ate eat tea\nbat\nnat tan","words = [eat, tea, tan, ate, nat, bat]","The words are grouped by letter counts; groups and members are sorted."],
["3 abc bca cab","abc bca cab","three anagrams","All words belong to one alphabetically sorted group."],
["1 x","x","one word","A single word forms one group."]
]);
P("Top K Frequent Words","MEDIUM",["Heap","Hashing","Strings"],"Return the k most frequent words. Break frequency ties by lexicographic order.","1 <= n <= 200000; 1 <= k <= number of distinct words; words are non-empty tokens.","Count words, then rank by descending frequency and ascending word.","Input: n k followed by n words. Output the selected words in rank order.",[
["6 2 I love Leetcode I love coding","I love","I and love both occur twice","The tied words are ordered lexicographically."],
["10 2 the day is sunny the the the sunny is is","the is","the occurs four times and is occurs three times","These are the two highest frequencies."],
["5 2 b a b a c","a b","a and b both occur twice","The lexicographically smaller tied word comes first."]
]);
P("Find All Anagrams in a String","MEDIUM",["Strings","Sliding Window","Hashing"],"Return every starting index where a substring of s is an anagram of p. Include overlapping matches.","0 <= |s| <= 200000; 1 <= |p| <= 200000; lowercase English letters.","Maintain character counts for a window of length |p| and compare them as the window slides.","Input: s and p on separate lines. Output matching zero-based indices, or -1.",[
["cbaebabacd\nabc","0 6","anagrams occur at cba and bac","Both windows contain one each of a, b, and c."],
["abab\nab","0 1 2","overlapping windows","Each two-character window is an anagram of ab."],
["aa\nab","-1","no matching window","The text has no b."]
]);
P("Longest Valid Parentheses","HARD",["Strings","Stack","Dynamic Programming"],"Return the length of the longest contiguous substring that forms a valid parentheses sequence.","0 <= string length <= 200000; characters are '(' or ')'.","Track unmatched opening positions with a stack or compute valid suffix lengths.","Input: one parentheses string. Output the maximum valid length.",[
["(()","2","the substring () is valid","The final two characters form the longest valid substring."],
[")()())","4","the substring ()() is valid","Four consecutive characters form a balanced sequence."],
["()(())","6","the entire string is balanced","All six characters belong to one valid substring."]
]);
P("Decode String","MEDIUM",["Strings","Stack","Parsing"],"Decode expressions where k[encoded] means the bracketed string repeated k times. Encoded text may contain nested expressions.","1 <= encoded length <= 200000; repeat counts are non-negative integers; decoded length <= 1000000.","Use stacks for repeat counts and partial strings, restoring the previous string when a closing bracket is found.","Input: one encoded string. Output its decoded string.",[
["3[a]2[bc]","aaabcbc","a repeats three times and bc twice","Concatenate aaa and bcbc."],
["3[a2[c]]","accaccacc","nested repeats","First decode a2[c] as acc, then repeat it three times."],
["2[abc]3[cd]ef","abcabccdcdcdef","two repeated groups followed by ef","Expand each bracketed group and append the suffix."]
]);
P("Evaluate Division","MEDIUM",["Graph","DFS","Weighted Graph"],"Given equations such as a/b=2, answer division queries. Return -1 for unknown variables or disconnected pairs.","1 <= equations, queries <= 10000; ratios are positive; variable names are lowercase tokens.","Represent each equation as weighted edges in both directions and search for a path, multiplying edge ratios.","Input: equation count; each equation as a b value; query count; then query pairs. Output each ratio with 5 decimal places, or -1.00000.",[
["2 a b 2.0 b c 3.0 5 a c b a a e a a x x","6.00000\n0.50000\n-1.00000\n1.00000\n-1.00000","a/b=2 and b/c=3","Multiply ratios along connected paths; unknown variables return -1."],
["1 x y 4.0 3 x y y x x x","4.00000\n0.25000\n1.00000","x/y=4","The reverse ratio is 1/4 and a variable divided by itself is 1."],
["0 1 a b","-1.00000","no equations are known","The variables are unknown."]
]);
P("Word Search II","HARD",["Trie","Backtracking","Matrix"],"Return all dictionary words that can be formed by adjacent horizontal or vertical board cells. A cell cannot be used twice in one word.","1 <= rows, cols <= 12; board and words use lowercase letters; at most 30000 words.","Build a trie of the words and run backtracking from each cell, pruning paths absent from the trie.","Input: rows cols, row strings, word count, then words. Output found words once in lexicographic order, or NONE.",[
["4 4 oaan etae ihkr iflv 4 oath pea eat rain","eat oath","board is the standard 4-by-4 word-search example","eat and oath can be traced through adjacent cells."],
["2 2 ab cd 3 ab ac bd","ab ac bd","a 2-by-2 board","Each listed word follows horizontal or vertical neighbors."],
["1 1 a 2 a b","a","one cell and two words","Only a can be formed."]
]);
P("Design Add and Search Words Data Structure","MEDIUM",["Trie","Strings","Backtracking"],"Support addWord(word) and search(pattern). In a search pattern, '.' matches exactly one lowercase letter. Print a boolean for every search.","1 <= operations <= 100000; words contain lowercase letters and patterns contain lowercase letters or '.'; total characters <= 200000.","Store words in a trie; when search reaches '.', try each existing child.","Input: q followed by add word or search pattern commands. Output each search result on its own line.",[
["5 addWord bad addWord dad addWord mad search pad search .ad","false\ntrue","add bad, dad, mad; search pad and .ad","pad is absent; .ad matches all three stored words."],
["4 addWord a search . search a search ..","true\ntrue\nfalse","one-letter word a","A dot matches one character, and two dots require a two-letter word."],
["3 addWord book search b..k search b...","true\ntrue","word book","Both patterns match exactly four letters."]
]);
P("3Sum Closest","MEDIUM",["Arrays","Sorting","Two Pointers"],"Choose three array values whose sum is closest to target and return that sum. If tied, return the smaller sum.","3 <= n <= 200000; values and target are signed 32-bit integers; a unique closest sum exists or ties are resolved as stated.","Sort the array, fix one value, and move two pointers according to whether the current sum is below or above target.","Input: n target followed by n values. Output the closest sum.",[
["4 1 -1 2 1 -4","2","-1 + 1 + 2 = 2","The distance from 2 to target 1 is 1, the minimum possible."],
["3 5 1 2 4","7","only one triple","The only sum is 1 + 2 + 4 = 7."],
["5 0 -2 -1 1 2 3","0","triple -2 + -1 + 3 = 0","The target is reached exactly."]
]);
P("Gas Station","MEDIUM",["Greedy","Arrays"],"A circular route has gas[i] at station i and costs[i] fuel to travel to the next station. Return a valid starting index, or -1 if completing the circuit is impossible.","1 <= n <= 200000; gas[i], cost[i] are non-negative; if a solution exists, it is unique.","If total gas is at least total cost, scan once and restart after any point where the running fuel becomes negative.","Input: n, n gas values, then n cost values. Output the starting index or -1.",[
["5 1 2 3 4 5 3 4 5 1 2","3","gas=[1,2,3,4,5], cost=[3,4,5,1,2]","Starting at 3 lets the car complete the circular route."],
["3 2 3 4 3 4 3","-1","total gas is less than total cost","No starting station can supply the missing fuel."],
["1 5 4","0","one station","The station leaves one unit of fuel for the full loop."]
]);
P("Design Hit Counter","MEDIUM",["Design","Queue","Sliding Window"],"Design a hit counter that records hit(timestamp) and returns the number of hits in the previous 300 seconds at getHits(timestamp). A hit at timestamp t counts for queries t <= now < t+300.","Timestamps are non-decreasing; up to 200000 operations.","Keep hit timestamps in a queue and discard hits whose timestamp is at most now-300.","Input: q followed by hit t or getHits t commands. Output each getHits result on its own line.",[
["7 hit 1 hit 2 hit 3 getHits 4 hit 300 getHits 300 getHits 301","3\n4\n3","three early hits, then a hit at 300","At 300, hit 1 is still within 300 seconds; at 301 it expires."],
["4 hit 1 getHits 300 getHits 301 getHits 600","1\n0\n0","one hit at time 1","The hit expires once the query time reaches 301."],
["2 hit 10 getHits 10","1","hit and query at the same time","The current timestamp is included."]
]);
P("Time-Based Key-Value Store","MEDIUM",["Design","Hashing","Binary Search"],"Support set(key,value,timestamp) and get(key,timestamp). Return the value stored at the greatest timestamp not exceeding the query time, or EMPTY if none exists.","1 <= operations <= 200000; timestamps for each key are strictly increasing; keys and values are tokens.","Store each key's timestamp-value list and binary-search for the last timestamp <= the query.","Input: q followed by set key value time or get key time commands. Output every get result on its own line.",[
["5 set foo bar 1 set foo baz 4 get foo 1 get foo 3 get foo 5","bar\nbar\nbaz","foo is set at times 1 and 4","Each query selects the latest stored time not later than its timestamp."],
["3 get missing 5 set x one 2 get x 1","EMPTY\nEMPTY","query an unknown key and an earlier timestamp","No value exists at either requested time."],
["4 set k a 2 set k b 8 get k 8 get k 9","b\nb","query at and after the latest set","Both queries return the value from timestamp 8."]
]);
P("Find K Pairs with Smallest Sums","MEDIUM",["Heap","Arrays","Priority Queue"],"Given two sorted arrays, return the k pairs (a,b) with the smallest sums. Order ties by a, then b; each index pair is distinct.","1 <= n,m <= 100000; arrays are sorted; 1 <= k <= n*m; values are signed 32-bit integers.","Use a min-heap to expand the next smallest pair without enumerating every combination.","Input: n m k, then both arrays. Output up to k pairs, one pair per line.",[
["3 3 3 1 7 11 2 4 6","1 2\n1 4\n1 6","A=[1,7,11], B=[2,4,6]","These are the three smallest pair sums in order."],
["2 2 3 1 1 1 2","1 1\n1 1\n1 2","duplicate values at distinct indices","Each index pair is distinct even when printed values repeat."],
["2 2 4 1 2 3 4","1 3\n1 4\n2 3\n2 4","all four possible pairs","The pairs are ordered by sum, then by their values."]
]);
P("First Missing Positive","HARD",["Arrays","In-Place Algorithms"],"Return the smallest positive integer that does not appear in the unsorted array.","0 <= n <= 200000; values are signed 32-bit integers; use O(1) extra space beyond the output.","Place each value x in position x-1 when 1 <= x <= n, then find the first mismatched position.","Input: n followed by n integers. Output the smallest missing positive integer.",[
["3 1 2 0","3","positive values 1 and 2 are present","The first missing positive is 3."],
["4 3 4 -1 1","2","values include 1, 3, and 4","Two is the first positive value absent."],
["3 7 8 9","1","no value from 1 through 3 appears","One is missing."]
]);

const languages=["JAVASCRIPT","PYTHON","JAVA","C","CPP"];
function starter(lang,format){
  if(lang==="JAVASCRIPT")return "// "+format+"\nfunction solve(input) {\n  // Parse the input and return the requested result.\n  return \"\";\n}\nconst fs = require(\"fs\");\nprocess.stdout.write(solve(fs.readFileSync(0, \"utf8\")));";
  if(lang==="PYTHON")return "# "+format+"\nimport sys\n\ndef solve(input_data):\n    # Parse the input and return the requested result.\n    return \"\"\n\nif __name__ == \"__main__\":\n    sys.stdout.write(solve(sys.stdin.read()))";
  if(lang==="JAVA")return "import java.io.*;\nimport java.util.*;\n\nclass Main {\n  // "+format+"\n  static String solve(String input) {\n    // Parse the input and return the requested result.\n    return \"\";\n  }\n  public static void main(String[] args) throws Exception {\n    System.out.print(solve(new String(System.in.readAllBytes())));\n  }\n}";
  if(lang==="C")return "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\n/* "+format+" */\nvoid solve(const char *input, char *output) {\n    /* Parse the input and write the requested result. */\n    output[0] = '\\0';\n}\nint main(void) {\n    size_t cap = 1u << 20, len = 0;\n    char *input = malloc(cap), *output = calloc(cap, 1);\n    if (!input || !output) return 1;\n    int ch; while ((ch = getchar()) != EOF && len + 1 < cap) input[len++] = (char)ch;\n    input[len] = '\\0'; solve(input, output); fputs(output, stdout);\n    free(input); free(output); return 0;\n}";
  return "#include <bits/stdc++.h>\nusing namespace std;\n\n// "+format+"\nstring solve(const string& input) {\n    // Parse the input and return the requested result.\n    return \"\";\n}\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    string input((istreambuf_iterator<char>(cin)), istreambuf_iterator<char>());\n    cout << solve(input);\n}";
}
try{
  const admin=await db.user.findFirst({where:{role:"ADMIN"},select:{id:true}});
  if(!admin)throw new Error("Create an ADMIN account before importing problems.");
  const seen=new Set();let added=0,skipped=0;
  for(const item of rows){
    if(seen.has(item.title))throw new Error("Duplicate seed title: "+item.title);seen.add(item.title);
    if(item.cases.length!==3||item.cases.some(c=>c.length!==4||c[0]===undefined||c[1]===undefined||!c[2]||!c[3]))throw new Error("Every question needs three complete examples: "+item.title);
    const existing=await db.problem.findFirst({where:{title:item.title},select:{id:true}});
    if(existing){skipped++;continue;}
    const testcases=item.cases.map(([input,output,displayInput,explanation],i)=>({input,output,displayInput,explanation,isPublic:true,testCaseNumber:i+1}));
    const hint=item.hint;
    await db.problem.create({data:{
      title:item.title,userId:admin.id,description:item.task+"\n\n"+item.format,difficulty:item.difficulty,tags:item.tags,
      constraints:item.constraints,hints:hint,editorial:hint+"\n\n"+item.format,
      examples:item.cases.map(([input,output,displayInput,explanation])=>({input:displayInput,output,explanation})),
      testcases,codeSnippets:Object.fromEntries(languages.map(lang=>[lang,starter(lang,item.format)])),referenceSolutions:{}
    }});
    added++;console.log("Added "+item.title);
  }
  console.log("FAANG interview import complete: "+added+" added, "+skipped+" already present, "+rows.length+" reviewed.");
}finally{await db.$disconnect();}
