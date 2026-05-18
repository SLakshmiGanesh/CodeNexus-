import React, { useState } from "react";
import { DSA_TOPICS, WEAK_TOPICS } from "../data/mockData";

const priorityConfig = {
  critical: { color: "#ef5350", label: "CRITICAL", bg: "rgba(239,83,80,0.1)", border: "rgba(239,83,80,0.25)" },
  high: { color: "#ffa726", label: "HIGH", bg: "rgba(255,167,38,0.1)", border: "rgba(255,167,38,0.25)" },
  medium: { color: "#42a5f5", label: "MEDIUM", bg: "rgba(66,165,245,0.1)", border: "rgba(66,165,245,0.25)" }
};

function KnowledgeGraph() {
  const nodes = [
    { id: "arrays", x: 60, y: 80, label: "Arrays", mastery: 88 },
    { id: "binary", x: 200, y: 40, label: "Binary Search", mastery: 83 },
    { id: "twoptr", x: 340, y: 80, label: "Two Pointers", mastery: 85 },
    { id: "prefix", x: 60, y: 200, label: "Prefix Sums", mastery: 58 },
    { id: "segtree", x: 200, y: 200, label: "Seg Tree", mastery: 31, weak: true },
    { id: "graphs", x: 340, y: 200, label: "Graphs", mastery: 67 },
    { id: "trees", x: 200, y: 320, label: "Trees", mastery: 74 },
    { id: "dp", x: 60, y: 320, label: "DP", mastery: 52, weak: true },
    { id: "dptree", x: 130, y: 400, label: "DP on Trees", mastery: 44, weak: true },
    { id: "bit", x: 340, y: 320, label: "Bit Manip", mastery: 44, weak: true },
  ];
  const edges = [
    ["arrays", "prefix"], ["arrays", "twoptr"], ["binary", "arrays"],
    ["prefix", "segtree"], ["graphs", "trees"], ["trees", "dptree"],
    ["dp", "dptree"], ["trees", "dp"], ["arrays", "bit"],
  ];

  const getColor = (mastery) => {
    if (mastery < 40) return "#ef5350";
    if (mastery < 60) return "#ffa726";
    if (mastery < 80) return "#42a5f5";
    return "#22c87a";
  };

  return (
    <svg viewBox="0 0 440 460" style={{ width: "100%", height: "100%", maxHeight: 320 }}>
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M2 2L8 5L2 8" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        </marker>
      </defs>
      {edges.map(([a, b], i) => {
        const na = nodes.find(n => n.id === a), nb = nodes.find(n => n.id === b);
        return <line key={i} x1={na.x + 36} y1={na.y + 16} x2={nb.x + 36} y2={nb.y + 16}
          stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" markerEnd="url(#arr)" />;
      })}
      {nodes.map(n => (
        <g key={n.id}>
          {n.weak && (
            <circle cx={n.x + 36} cy={n.y + 16} r={32} fill="none"
              stroke={getColor(n.mastery)} strokeWidth="1" strokeDasharray="3,3" opacity="0.5">
              <animate attributeName="r" values="30;34;30" dur="2s" repeatCount="indefinite" />
            </circle>
          )}
          <rect x={n.x} y={n.y} width={72} height={32} rx={8}
            fill={n.weak ? `${getColor(n.mastery)}22` : "#1e2230"}
            stroke={getColor(n.mastery)} strokeWidth={n.weak ? 1.5 : 0.75} />
          <text x={n.x + 36} y={n.y + 20} textAnchor="middle"
            style={{ fontSize: 11, fill: getColor(n.mastery), fontFamily: "Outfit, sans-serif", fontWeight: n.weak ? 700 : 400 }}>
            {n.label}
          </text>
          <text x={n.x + 36} y={n.y + 30} textAnchor="middle"
            style={{ fontSize: 9, fill: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono, monospace" }}>
            {n.mastery}%
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function WeaknessDetector({ onNavigate }) {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanDone, setScanDone] = useState(false);

  const runScan = () => {
    setScanning(true);
    setScanDone(false);
    setTimeout(() => { setScanning(false); setScanDone(true); }, 2200);
  };

  const sorted = [...DSA_TOPICS].sort((a, b) => a.mastery - b.mastery);

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div className="page-title">🎯 Weakness <span>Detector</span></div>
            <div className="page-sub">BFS traversal over your DSA knowledge graph to find root-cause gaps</div>
          </div>
          <button className="btn btn-primary" onClick={runScan} disabled={scanning}>
            {scanning ? <><div className="spinner" />Scanning graph...</> : "▶ Run Analysis"}
          </button>
        </div>
      </div>

      {scanning && (
        <div style={{ background: "rgba(124,111,247,0.08)", border: "1px solid rgba(124,111,247,0.2)", borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="spinner" />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--accent2)" }}>Traversing knowledge graph...</div>
              <div style={{ fontSize: 12, color: "var(--text3)", fontFamily: "JetBrains Mono, monospace" }}>
                BFS from root nodes → detecting prerequisite failures → computing mastery deltas
              </div>
            </div>
          </div>
        </div>
      )}

      {scanDone && (
        <div style={{ background: "rgba(239,83,80,0.06)", border: "1px solid rgba(239,83,80,0.2)", borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#ef5350" }}>⚠ Analysis Complete — 3 critical gaps detected</div>
          <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 4 }}>
            Root cause: Segment Tree deficiency traces back to weak Prefix Sum mastery (58%). Fix foundation first.
          </div>
        </div>
      )}

      <div className="grid-2" style={{ marginBottom: 20 }}>
        {/* Knowledge Graph */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Knowledge Graph</div>
              <div className="card-sub">Animated nodes = identified weak points</div>
            </div>
          </div>
          <KnowledgeGraph />
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 8 }}>
            {[["#ef5350", "Critical"], ["#ffa726", "Weak"], ["#42a5f5", "Developing"], ["#22c87a", "Strong"]].map(([c, l]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--text3)" }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />{l}
              </div>
            ))}
          </div>
        </div>

        {/* Mastery list */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">All Topics by Mastery</div>
            <div className="card-sub">Lowest first</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 360, overflowY: "auto" }}>
            {sorted.map(t => {
              const c = t.mastery < 40 ? "#ef5350" : t.mastery < 60 ? "#ffa726" : t.mastery < 80 ? "#42a5f5" : "#22c87a";
              return (
                <div key={t.id} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
                  background: "var(--bg3)", borderRadius: 8, cursor: "pointer",
                  border: `1px solid ${selectedTopic === t.id ? c : "var(--border)"}`,
                  transition: "border-color 0.15s"
                }} onClick={() => setSelectedTopic(selectedTopic === t.id ? null : t.id)}>
                  <div style={{ fontSize: 16 }}>{t.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: t.mastery < 60 ? c : "var(--text)" }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>{t.problems} solved</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 80 }}>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${t.mastery}%`, background: c }} />
                      </div>
                    </div>
                    <div style={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: c, width: 32, textAlign: "right" }}>{t.mastery}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Weak topic deep dives */}
      <div style={{ marginBottom: 8 }}>
        <div className="card-title" style={{ marginBottom: 12 }}>🔴 Critical Gaps — Recommended Actions</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {WEAK_TOPICS.map(wt => {
            const cfg = priorityConfig[wt.priority];
            return (
              <div key={wt.id} style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 12, padding: 18 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: cfg.color }}>{wt.name}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, padding: "2px 8px", borderRadius: 10 }}>{cfg.label}</span>
                      <span style={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: cfg.color }}>{wt.mastery}% mastery</span>
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 4 }}>{wt.reason}</div>
                    <div style={{ fontSize: 12, color: "var(--text3)", fontStyle: "italic" }}>Root cause: {wt.rootCause}</div>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => onNavigate("roadmap")}>Fix this →</button>
                </div>
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: 12, color: "var(--text3)", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Recommended Problems</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {wt.problems.map(p => (
                      <div key={p.id} style={{ background: "var(--bg3)", border: "1px solid var(--border2)", borderRadius: 8, padding: "6px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{p.name}</span>
                        <span className={`tag ${p.difficulty === "Easy" ? "tag-green" : p.difficulty === "Medium" ? "tag-amber" : "tag-red"}`}>{p.difficulty}</span>
                        <span style={{ fontSize: 11, color: "var(--text3)" }}>{p.platform}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
