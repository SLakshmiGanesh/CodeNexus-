import React, { useState } from "react";
import { ROADMAP_PHASES, DSA_TOPICS } from "../data/mockData";

const phaseColors = { active: "#7C6FF7", upcoming: "#42a5f5", locked: "#5a6179" };

function PhaseCard({ phase, index, onExpand, expanded }) {
  const color = phaseColors[phase.status];
  return (
    <div style={{
      background: "var(--bg2)", border: `1px solid ${phase.status === "active" ? "rgba(124,111,247,0.3)" : "var(--border)"}`,
      borderRadius: 14, overflow: "hidden",
      boxShadow: phase.status === "active" ? "0 0 20px rgba(124,111,247,0.08)" : "none"
    }}>
      <div style={{ padding: "18px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 16 }}
        onClick={() => onExpand(index)}>
        {/* Phase number */}
        <div style={{
          width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
          background: phase.status === "locked" ? "var(--bg4)" : `${color}22`,
          border: `2px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, fontWeight: 800, color, fontFamily: "JetBrains Mono, monospace"
        }}>
          {phase.status === "locked" ? "🔒" : `0${phase.phase}`}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>{phase.title}</span>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10,
              background: `${color}18`, color, border: `1px solid ${color}44`,
              textTransform: "uppercase", letterSpacing: "0.05em"
            }}>{phase.status}</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--text3)" }}>
            {phase.duration} · {phase.topics.length} topics
          </div>
          {phase.status === "active" && (
            <div style={{ marginTop: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: "var(--text3)" }}>Progress</span>
                <span style={{ fontSize: 11, color, fontFamily: "JetBrains Mono, monospace" }}>{phase.progress}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${phase.progress}%`, background: color }} />
              </div>
            </div>
          )}
        </div>

        <div style={{ color: "var(--text3)", fontSize: 18, transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "none" }}>
          ▾
        </div>
      </div>

      {expanded && (
        <div style={{ padding: "0 20px 20px", borderTop: "1px solid var(--border)" }}>
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 12, color: "var(--text3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
              Topics in this phase
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {phase.topics.map(t => {
                const topic = DSA_TOPICS.find(dt => dt.name.toLowerCase().includes(t.toLowerCase().split(" ")[0]));
                return (
                  <div key={t} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "var(--bg3)", border: "1px solid var(--border2)", borderRadius: 8, padding: "6px 12px"
                  }}>
                    <span style={{ fontSize: 13, color: "var(--text)" }}>{t}</span>
                    {topic && (
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <div className="progress-track" style={{ width: 40 }}>
                          <div className="progress-fill" style={{ width: `${topic.mastery}%`, background: topic.mastery < 60 ? "#ffa726" : "#22c87a" }} />
                        </div>
                        <span style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "var(--text3)" }}>{topic.mastery}%</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {phase.status !== "locked" && (
            <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
              <button className="btn btn-primary btn-sm">
                {phase.status === "active" ? "▶ Continue Phase" : "Start Phase"}
              </button>
              <button className="btn btn-ghost btn-sm">View Problems</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Roadmap({ onNavigate }) {
  const [expanded, setExpanded] = useState(0);

  const toggleExpand = (i) => setExpanded(expanded === i ? null : i);

  const totalProgress = Math.round(ROADMAP_PHASES.reduce((sum, p) => sum + p.progress, 0) / ROADMAP_PHASES.length);

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div className="page-title">🗺 My <span>Roadmap</span></div>
            <div className="page-sub">Personalized learning path generated from your weakness analysis</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate("weakness")}>Re-analyze gaps →</button>
        </div>
      </div>

      {/* Overall progress */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-val">{totalProgress}%</div>
          <div className="stat-lbl">Overall Progress</div>
          <div className="progress-track" style={{ marginTop: 8 }}>
            <div className="progress-fill mastery-med" style={{ width: `${totalProgress}%` }} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-val">16</div>
          <div className="stat-lbl">Total Duration (weeks)</div>
          <div className="stat-delta delta-up">Est. completion: Aug 2025</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">1</div>
          <div className="stat-lbl">Active Phase</div>
          <div className="stat-delta delta-up">Foundation Repair</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">+453</div>
          <div className="stat-lbl">Predicted Rating Gain</div>
          <div className="stat-delta delta-up">On completion (87% conf.)</div>
        </div>
      </div>

      {/* Roadmap phases */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
        {ROADMAP_PHASES.map((phase, i) => (
          <PhaseCard key={phase.phase} phase={phase} index={i} onExpand={toggleExpand} expanded={expanded === i} />
        ))}
      </div>

      {/* Revision calendar */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Spaced Repetition Schedule</div>
          <div className="card-sub">SM-2 algorithm — next reviews due</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
          {[
            { topic: "Binary Search", due: "Today", interval: "7 days", mastery: 83 },
            { topic: "Two Pointers", due: "Tomorrow", interval: "14 days", mastery: 85 },
            { topic: "BFS/DFS", due: "May 17", interval: "5 days", mastery: 67 },
            { topic: "Greedy", due: "May 19", interval: "10 days", mastery: 79 },
            { topic: "Prefix Sums", due: "May 20", interval: "3 days", mastery: 58 },
            { topic: "Hash Maps", due: "May 22", interval: "21 days", mastery: 91 },
          ].map((r, i) => (
            <div key={i} style={{
              background: "var(--bg3)", border: `1px solid ${r.due === "Today" ? "rgba(239,83,80,0.3)" : "var(--border)"}`,
              borderRadius: 10, padding: "12px 14px",
              boxShadow: r.due === "Today" ? "0 0 12px rgba(239,83,80,0.08)" : "none"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{r.topic}</div>
                <span className={`tag ${r.due === "Today" ? "tag-red" : r.due === "Tomorrow" ? "tag-amber" : "tag-blue"}`}>{r.due}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div className="progress-track" style={{ flex: 1 }}>
                  <div className="progress-fill mastery-high" style={{ width: `${r.mastery}%` }} />
                </div>
                <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "var(--text3)" }}>{r.mastery}%</span>
              </div>
              <div style={{ fontSize: 11, color: "var(--text3)" }}>Review interval: {r.interval}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
