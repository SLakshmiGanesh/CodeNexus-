export const USER_PROFILE = {
  name: "Arjun Sharma",
  handle: "arjun_cf",
  rating: 1647,
  maxRating: 1782,
  rank: "Expert",
  country: "India",
  avatar: "AS",
  streak: 12,
  totalSolved: 347,
  contestsParticipated: 28,
  joinDate: "2023-08-01"
};

export const DSA_TOPICS = [
  { id: "arrays", name: "Arrays & Strings", mastery: 88, problems: 45, color: "#7F77DD", icon: "⬛" },
  { id: "dp", name: "Dynamic Programming", mastery: 52, problems: 38, color: "#E24B4A", icon: "🔷" },
  { id: "graphs", name: "Graphs & BFS/DFS", mastery: 67, problems: 52, color: "#1D9E75", icon: "🕸️" },
  { id: "trees", name: "Trees & BST", mastery: 74, problems: 41, color: "#EF9F27", icon: "🌲" },
  { id: "segtree", name: "Segment Trees", mastery: 31, problems: 12, color: "#D85A30", icon: "📊" },
  { id: "greedy", name: "Greedy Algorithms", mastery: 79, problems: 35, color: "#378ADD", icon: "💡" },
  { id: "math", name: "Number Theory", mastery: 61, problems: 28, color: "#9966CC", icon: "🔢" },
  { id: "binary", name: "Binary Search", mastery: 83, problems: 31, color: "#639922", icon: "🔍" },
  { id: "hashing", name: "Hashing & Maps", mastery: 91, problems: 29, color: "#0F6E56", icon: "#️⃣" },
  { id: "twoptr", name: "Two Pointers", mastery: 85, problems: 22, color: "#185FA5", icon: "👆" },
  { id: "divconq", name: "Divide & Conquer", mastery: 58, problems: 18, color: "#993556", icon: "✂️" },
  { id: "bitmanip", name: "Bit Manipulation", mastery: 44, problems: 15, color: "#634AB7", icon: "⚙️" }
];

export const WEAK_TOPICS = [
  {
    id: "segtree",
    name: "Segment Trees",
    mastery: 31,
    reason: "You've avoided range-query problems. 3 failed attempts in last contest.",
    rootCause: "Weak prerequisite: Prefix Sums (mastery 58%)",
    priority: "critical",
    problems: [
      { id: "p1", name: "Range Sum Query", difficulty: "Easy", platform: "LeetCode", url: "#" },
      { id: "p2", name: "Count of Smaller Numbers", difficulty: "Hard", platform: "LeetCode", url: "#" },
      { id: "p3", name: "Ynoi2015 - 苔原", difficulty: "2400", platform: "Codeforces", url: "#" }
    ]
  },
  {
    id: "dp",
    name: "DP on Trees",
    mastery: 52,
    reason: "Pattern recognition gap. Solve time 3.2x average for DP problems.",
    rootCause: "Linked to: Tree Traversal (74%) + DP Foundation (52%)",
    priority: "high",
    problems: [
      { id: "p4", name: "House Robber III", difficulty: "Medium", platform: "LeetCode", url: "#" },
      { id: "p5", name: "Binary Tree Cameras", difficulty: "Hard", platform: "LeetCode", url: "#" },
      { id: "p6", name: "Vertex Cover", difficulty: "1900", platform: "Codeforces", url: "#" }
    ]
  },
  {
    id: "bitmanip",
    name: "Bit Manipulation",
    mastery: 44,
    reason: "Low exposure. Only 15 problems solved, none above 1600 difficulty.",
    rootCause: "Isolated topic — recommend 5 problems to build intuition",
    priority: "medium",
    problems: [
      { id: "p7", name: "Single Number III", difficulty: "Medium", platform: "LeetCode", url: "#" },
      { id: "p8", name: "XOR Queries of a Subarray", difficulty: "Medium", platform: "LeetCode", url: "#" },
      { id: "p9", name: "Kth Bit in Nth Binary String", difficulty: "1400", platform: "Codeforces", url: "#" }
    ]
  }
];

export const RATING_HISTORY = [
  { date: "Sep '24", rating: 1203 },
  { date: "Oct '24", rating: 1287 },
  { date: "Nov '24", rating: 1341 },
  { date: "Dec '24", rating: 1298 },
  { date: "Jan '25", rating: 1412 },
  { date: "Feb '25", rating: 1489 },
  { date: "Mar '25", rating: 1521 },
  { date: "Apr '25", rating: 1580 },
  { date: "May '25", rating: 1647 }
];

export const RECENT_CONTESTS = [
  { name: "Codeforces Round 987", date: "May 10", rank: 812, solved: 3, delta: +47, totalParts: 18234 },
  { name: "Div.2 Round 984", date: "Apr 28", rank: 1243, solved: 2, delta: -23, totalParts: 14891 },
  { name: "Educational Round 172", date: "Apr 14", rank: 645, solved: 4, delta: +62, totalParts: 11023 },
  { name: "Codeforces Round 981", date: "Mar 30", rank: 987, solved: 3, delta: +31, totalParts: 15442 }
];

export const ROADMAP_PHASES = [
  {
    phase: 1,
    title: "Foundation Repair",
    duration: "2 weeks",
    status: "active",
    topics: ["Prefix Sums", "Sliding Window", "Recursion Depth"],
    progress: 60
  },
  {
    phase: 2,
    title: "Segment Tree Mastery",
    duration: "2 weeks",
    status: "upcoming",
    topics: ["Point Update", "Range Query", "Lazy Propagation"],
    progress: 0
  },
  {
    phase: 3,
    title: "DP on Trees",
    duration: "2 weeks",
    status: "upcoming",
    topics: ["Tree DP", "Rerooting", "LCA + DP"],
    progress: 0
  },
  {
    phase: 4,
    title: "Advanced Techniques",
    duration: "3 weeks",
    status: "locked",
    topics: ["Bit DP", "Divide & Conquer DP", "Bitmasking"],
    progress: 0
  }
];

export const DAILY_PLAN = [
  { time: "9:00 AM", task: "Warm-up: Arrays easy problem", done: true, type: "practice" },
  { time: "10:00 AM", task: "Study: Prefix Sum patterns", done: true, type: "study" },
  { time: "11:30 AM", task: "Solve: Range Sum Query (LeetCode 307)", done: false, type: "practice" },
  { time: "2:00 PM", task: "AI Explanation: Segment Tree internals", done: false, type: "ai" },
  { time: "4:00 PM", task: "Revision: Binary Search (due today)", done: false, type: "revision" },
  { time: "7:00 PM", task: "Mock: 45-min Codeforces Div.2 sim", done: false, type: "contest" }
];

export const ACHIEVEMENTS = [
  { id: "a1", name: "First Blood", desc: "Solved your first problem", icon: "🩸", earned: true },
  { id: "a2", name: "Week Warrior", desc: "7-day solve streak", icon: "🔥", earned: true },
  { id: "a3", name: "Graph Guru", desc: "50 graph problems solved", icon: "🕸️", earned: true },
  { id: "a4", name: "Expert Tier", desc: "Reached 1600 rating", icon: "⭐", earned: true },
  { id: "a5", name: "Speed Demon", desc: "Solved A+B in under 5 min", icon: "⚡", earned: true },
  { id: "a6", name: "DP Slayer", desc: "Solve 30 DP problems", icon: "🔷", earned: false, progress: 18 },
  { id: "a7", name: "Segment Tree Sage", desc: "Master segment trees", icon: "📊", earned: false, progress: 4 },
  { id: "a8", name: "Master Tier", desc: "Reach 2100 rating", icon: "👑", earned: false, progress: 1647 }
];

export const HEATMAP_DATA = (() => {
  const data = [];
  for (let i = 0; i < 52; i++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      week.push(Math.random() > 0.3 ? Math.floor(Math.random() * 5) : 0);
    }
    data.push(week);
  }
  return data;
})();

// Extended for Neural Twin
export const COGNITIVE_PROFILE = {
  focusScore: 78,
  fatigueLevel: 22,
  confidenceIndex: 65,
  flowState: false,
  currentMood: "determined",
  thinkingSpeed: 72,
  errorTendency: ["off-by-one", "integer overflow", "wrong base case"],
  strongPatterns: ["sliding window", "two pointers", "BFS"],
  weakPatterns: ["segment tree lazy", "DP transition design", "bitmask enumeration"],
  cognitiveLoad: 44,
  retentionCurve: [100,82,65,50,38,28,20,14],
  stressProfile: { contest: 68, timed: 72, interview: 80 },
};

export const NEURAL_PREDICTIONS = [
  { topic: "Segment Trees", forgettingIn: "3 days", confidence: 88, action: "Review now" },
  { topic: "DP on Intervals", forgettingIn: "1 week", confidence: 74, action: "Schedule review" },
  { topic: "Dijkstra variants", forgettingIn: "2 weeks", confidence: 62, action: "Light practice" },
];

export const AGENT_SWARM = [
  { id:"prof",   name:"Theory Professor",   status:"idle",    specialty:"Mathematical foundations", color:"#00f5ff", icon:"◈" },
  { id:"icpc",   name:"ICPC Strategist",    status:"active",  specialty:"Contest tactics & timing", color:"#00ff88", icon:"⚔" },
  { id:"cf",     name:"CF Grandmaster",     status:"idle",    specialty:"Codeforces meta-strategy",  color:"#ffaa00", icon:"★" },
  { id:"faang",  name:"FAANG Interviewer",  status:"idle",    specialty:"System design & LC patterns",color:"#bf00ff", icon:"◉" },
  { id:"psych",  name:"Psych Coach",        status:"active",  specialty:"Burnout detection & pacing", color:"#ff2244", icon:"♥" },
  { id:"debug",  name:"Debug Agent",        status:"idle",    specialty:"Runtime & logic analysis",  color:"#aaff00", icon:"⚙" },
];

export const PERFORMANCE_DNA = [
  { angle: 0,   val: 88, label: "Array intuition" },
  { angle: 45,  val: 52, label: "DP transitions" },
  { angle: 90,  val: 67, label: "Graph modeling" },
  { angle: 135, val: 74, label: "Tree recursion" },
  { angle: 180, val: 31, label: "Seg tree ops" },
  { angle: 225, val: 79, label: "Greedy proof" },
  { angle: 270, val: 61, label: "Number theory" },
  { angle: 315, val: 83, label: "Binary search" },
];
