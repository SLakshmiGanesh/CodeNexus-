import React, { useState, useEffect, useRef } from "react";

const MOCK_PROBLEMS = [
  {
    id: "A", title: "A. Balanced Brackets",
    difficulty: "800", tag: "strings",
    statement: "Given a string of brackets, determine if it is balanced. A string is balanced if every opening bracket has a corresponding closing bracket in the correct order.\n\nInput: A single string s (1 ≤ |s| ≤ 10^5) containing only '(' and ')'.\nOutput: Print 'YES' if balanced, 'NO' otherwise.\n\nExample:\nInput: (()())\nOutput: YES\n\nInput: )(\nOutput: NO",
    solved: false, timeSpent: 0, attempts: 0
  },
  {
    id: "B", title: "B. Array Maximum",
    difficulty: "1100", tag: "greedy",
    statement: "Given an array of n integers, you can perform at most k operations. In each operation, you can add 1 to any element. Find the maximum possible value of the minimum element after k operations.\n\nInput: First line contains n and k (1 ≤ n ≤ 2×10^5, 0 ≤ k ≤ 10^9). Second line contains n integers a_i (-10^9 ≤ a_i ≤ 10^9).\nOutput: Print the maximum possible minimum value.\n\nExample:\nInput: 3 5\n1 2 3\nOutput: 3",
    solved: false, timeSpent: 0, attempts: 0
  },
  {
    id: "C", title: "C. Tree Paths",
    difficulty: "1600", tag: "trees, dfs",
    statement: "Given a tree with n nodes rooted at node 1, find the number of paths (u, v) where u is an ancestor of v, and the sum of node values along the path is divisible by k.\n\nInput: First line n and k (1 ≤ n ≤ 10^5, 1 ≤ k ≤ 10^6). Second line n integers a_i. Next n-1 lines each contain two integers u v denoting an edge.\nOutput: Print the count of valid paths.\n\nExample:\nInput: 5 3\n1 2 3 1 2\n1 2\n1 3\n2 4\n2 5\nOutput: 4",
    solved: false, timeSpent: 0, attempts: 0
  },
  {
    id: "D", title: "D. Segment Queries",
    difficulty: "2000", tag: "segment tree, lazy propagation",
    statement: "Given an array of n integers, process q queries of two types:\n1 l r x — Add x to all elements in [l, r]\n2 l r — Find the maximum element in [l, r]\n\nInput: First line n and q (1 ≤ n, q ≤ 2×10^5). Second line n integers. Next q lines each describe a query.\nOutput: For each type 2 query, print the answer.\n\nExample:\nInput: 5 4\n1 3 2 4 5\n1 1 3 2\n2 1 5\n1 2 4 -1\n2 2 3",
    solved: false, timeSpent: 0, attempts: 0
  }
];

const LEADERBOARD = [
  { rank: 1, name: "tourist", rating: 3979, solved: 4, time: "00:47:23", delta: "+89" },
  { rank: 2, name: "Um_nik", rating: 3664, solved: 4, time: "00:52:11", delta: "+84" },
  { rank: 3, name: "neal_wu", rating: 3590, solved: 3, time: "00:38:05", delta: "+71" },
  { rank: 4, name: "arjun_cf", rating: 1647, solved: 0, time: "--:--:--", delta: "?", isYou: true },
  { rank: 5, name: "galen_colin", rating: 3456, solved: 3, time: "00:41:22", delta: "+68" },
];

function Timer({ running, elapsed }) {
  const fmt = (s) => {
    const h = Math.floor(s / 3600).toString().padStart(2, "0");
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };
  return (
    <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 28, fontWeight: 800, color: running ? "#22c87a" : "#5a6179", letterSpacing: "0.05em" }}>
      {fmt(elapsed)}
    </span>
  );
}

export default function ContestArena() {
  const [mode, setMode] = useState("lobby"); // lobby | contest | review
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [problems, setProblems] = useState(MOCK_PROBLEMS);
  const [code, setCode] = useState("// Write your solution in C++\n#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    // Your solution here\n    \n    return 0;\n}\n");
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [verdict, setVerdict] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [running]);

  const startContest = () => {
    setMode("contest");
    setRunning(true);
    setSelectedProblem(problems[0]);
    setElapsed(0);
  };

  const submitSolution = () => {
    setVerdict("judging");
    setTimeout(() => {
      const pass = Math.random() > 0.35;
      setVerdict(pass ? "AC" : "WA");
      if (pass && selectedProblem) {
        setProblems(prev => prev.map(p => p.id === selectedProblem.id ? { ...p, solved: true, timeSpent: elapsed } : p));
      }
    }, 1800);
  };

  if (mode === "lobby") {
    return (
      <div className="page">
        <div className="page-header">
          <div className="page-title">⚔ Battle <span>Arena</span></div>
          <div className="page-sub">AI-calibrated mock contests · Real-time execution · Leaderboards</div>
        </div>

        <div className="grid-2" style={{ marginBottom: 20 }}>
          {/* Mock contest card */}
          <div style={{
            background: "linear-gradient(135deg, rgba(124,111,247,0.15), rgba(124,111,247,0.05))",
            border: "1px solid rgba(124,111,247,0.3)", borderRadius: 16, padding: 24,
            display: "flex", flexDirection: "column", gap: 16
          }}>
            <div style={{ fontSize: 36 }}>🏆</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text)" }}>Personalized Mock Contest</div>
              <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 4 }}>4 problems calibrated to your rating (±200). Mirrors Codeforces Div.2 format with 2h time limit.</div>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span className="tag tag-purple">4 problems</span>
              <span className="tag tag-amber">Rating: 1447–1847</span>
              <span className="tag tag-green">2 hours</span>
              <span className="tag tag-blue">Codeforces format</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {MOCK_PROBLEMS.map(p => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 10px", background: "var(--bg3)", borderRadius: 8 }}>
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13, fontWeight: 700, color: "var(--accent2)", width: 16 }}>{p.id}</span>
                  <span style={{ fontSize: 13, color: "var(--text)", flex: 1 }}>{p.title}</span>
                  <span className={`tag ${parseInt(p.difficulty) < 1200 ? "tag-green" : parseInt(p.difficulty) < 1800 ? "tag-amber" : "tag-red"}`}>{p.difficulty}</span>
                </div>
              ))}
            </div>
            <button className="btn btn-primary" onClick={startContest} style={{ width: "100%", justifyContent: "center" }}>
              ▶ Start Contest
            </button>
          </div>

          {/* 1v1 coming soon + leaderboard */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{
              background: "rgba(239,83,80,0.06)", border: "1px solid rgba(239,83,80,0.2)",
              borderRadius: 16, padding: 20, flex: 0
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>⚔</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text)" }}>1v1 Battle Mode</div>
              <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 4 }}>Challenge a peer to a real-time coding duel. Same problem, first to AC wins. Live progress tracking via WebSocket.</div>
              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <span className="tag tag-red">Coming Soon</span>
                <span className="tag tag-amber">WebSocket + Docker</span>
              </div>
            </div>

            <div className="card" style={{ flex: 1 }}>
              <div className="card-header">
                <div className="card-title">Global Leaderboard</div>
                <div className="card-sub">Mock contest rankings</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {LEADERBOARD.map(u => (
                  <div key={u.rank} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8,
                    background: u.isYou ? "rgba(124,111,247,0.1)" : "var(--bg3)",
                    border: `1px solid ${u.isYou ? "rgba(124,111,247,0.3)" : "var(--border)"}`
                  }}>
                    <span style={{ width: 20, fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: u.rank <= 3 ? "#ffa726" : "var(--text3)", fontWeight: 700 }}>#{u.rank}</span>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 13, fontWeight: u.isYou ? 700 : 500, color: u.isYou ? "var(--accent2)" : "var(--text)" }}>{u.name}</span>
                      {u.isYou && <span style={{ fontSize: 10, marginLeft: 6, color: "var(--accent2)" }}>you</span>}
                    </div>
                    <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "var(--text3)" }}>{u.time}</span>
                    <span style={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: parseInt(u.delta) > 0 ? "#22c87a" : "var(--text3)", width: 36, textAlign: "right" }}>{u.delta}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Contest mode
  const solved = problems.filter(p => p.solved).length;
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Problem list sidebar */}
      <div style={{ width: 220, background: "var(--bg2)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "16px 14px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>Mock Contest</div>
          <Timer running={running} elapsed={elapsed} />
          <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 4 }}>{solved}/{problems.length} solved</div>
        </div>
        <div style={{ flex: 1, padding: "10px 8px", display: "flex", flexDirection: "column", gap: 4 }}>
          {problems.map(p => (
            <button key={p.id} onClick={() => { setSelectedProblem(p); setVerdict(null); }} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 10px",
              background: selectedProblem?.id === p.id ? "rgba(124,111,247,0.12)" : "none",
              border: `1px solid ${selectedProblem?.id === p.id ? "rgba(124,111,247,0.3)" : "transparent"}`,
              borderRadius: 8, cursor: "pointer", textAlign: "left", fontFamily: "var(--sans)", width: "100%"
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
                background: p.solved ? "rgba(34,200,122,0.15)" : "var(--bg3)",
                border: `1px solid ${p.solved ? "rgba(34,200,122,0.3)" : "var(--border)"}`,
                fontSize: 12, fontWeight: 800, color: p.solved ? "#22c87a" : "var(--text3)",
                fontFamily: "JetBrains Mono, monospace"
              }}>{p.solved ? "✓" : p.id}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: p.solved ? "#22c87a" : "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title.replace(`${p.id}. `, "")}</div>
                <div style={{ fontSize: 10, color: "var(--text3)" }}>{p.difficulty}</div>
              </div>
            </button>
          ))}
        </div>
        <div style={{ padding: "12px 8px", borderTop: "1px solid var(--border)" }}>
          <button className="btn btn-danger btn-sm" style={{ width: "100%", justifyContent: "center" }} onClick={() => { setRunning(false); setMode("lobby"); }}>
            End Contest
          </button>
        </div>
      </div>

      {/* Main contest area */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Problem statement */}
        <div style={{ width: "40%", padding: "20px", overflowY: "auto", borderRight: "1px solid var(--border)" }}>
          {selectedProblem && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: "var(--accent2)", fontFamily: "JetBrains Mono, monospace" }}>{selectedProblem.id}</span>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>{selectedProblem.title}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                    <span className={`tag ${parseInt(selectedProblem.difficulty) < 1200 ? "tag-green" : parseInt(selectedProblem.difficulty) < 1800 ? "tag-amber" : "tag-red"}`}>{selectedProblem.difficulty}</span>
                    <span className="tag tag-blue">{selectedProblem.tag}</span>
                  </div>
                </div>
              </div>
              <pre style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--text2)", lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {selectedProblem.statement}
              </pre>
            </>
          )}
        </div>

        {/* Code editor */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "10px 16px", background: "var(--bg2)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: "var(--text3)" }}>C++17</span>
            <div style={{ flex: 1 }} />
            {verdict && (
              <span style={{
                fontSize: 13, fontWeight: 700, fontFamily: "JetBrains Mono, monospace",
                color: verdict === "AC" ? "#22c87a" : verdict === "WA" ? "#ef5350" : "#ffa726",
                padding: "3px 10px", borderRadius: 6,
                background: verdict === "AC" ? "rgba(34,200,122,0.1)" : verdict === "WA" ? "rgba(239,83,80,0.1)" : "rgba(255,167,38,0.1)"
              }}>
                {verdict === "judging" ? "⏳ Judging..." : verdict === "AC" ? "✓ Accepted!" : "✗ Wrong Answer"}
              </span>
            )}
            <button className="btn btn-ghost btn-sm" onClick={() => setVerdict(null)}>Reset</button>
            <button className="btn btn-success btn-sm" onClick={submitSolution} disabled={verdict === "judging"}>
              {verdict === "judging" ? "Judging..." : "▶ Submit"}
            </button>
          </div>
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            style={{
              flex: 1, resize: "none", background: "#0d1117", color: "#cdd6f4",
              fontFamily: "JetBrains Mono, monospace", fontSize: 13, lineHeight: 1.6,
              border: "none", outline: "none", padding: "16px 20px",
              borderRadius: 0, width: "100%"
            }}
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
