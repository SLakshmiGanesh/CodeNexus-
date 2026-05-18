import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { USER_PROFILE, DSA_TOPICS, RATING_HISTORY, RECENT_CONTESTS, DAILY_PLAN, ACHIEVEMENTS, HEATMAP_DATA } from "../data/mockData";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#1e2230", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px" }}>
        <p style={{ color: "#9aa0b4", fontSize: 12 }}>{label}</p>
        <p style={{ color: "#7C6FF7", fontFamily: "JetBrains Mono, monospace", fontWeight: 700 }}>{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

function HeatmapCell({ value }) {
  const colors = ["#1e2230", "#2d3548", "#4a5c8a", "#7C6FF7", "#a99ff9"];
  return (
    <div style={{
      width: 12, height: 12, borderRadius: 2,
      background: colors[Math.min(value, 4)],
      transition: "transform 0.1s"
    }} title={`${value} problems`} />
  );
}

function MasteryBar({ topic }) {
  const cls = topic.mastery < 40 ? "mastery-critical" : topic.mastery < 60 ? "mastery-low" : topic.mastery < 80 ? "mastery-med" : "mastery-high";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
      <div style={{ width: 130, fontSize: 13, color: topic.mastery < 60 ? "#ffa726" : "#9aa0b4", flexShrink: 0, fontWeight: topic.mastery < 50 ? 600 : 400 }}>
        {topic.name}
      </div>
      <div className="progress-track" style={{ flex: 1 }}>
        <div className={`progress-fill ${cls}`} style={{ width: `${topic.mastery}%` }} />
      </div>
      <div style={{ width: 36, textAlign: "right", fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: topic.mastery < 60 ? "#ffa726" : "#5a6179" }}>
        {topic.mastery}%
      </div>
    </div>
  );
}

export default function Dashboard({ onNavigate }) {
  const topTopics = [...DSA_TOPICS].sort((a, b) => a.mastery - b.mastery).slice(0, 5);
  const todayDone = DAILY_PLAN.filter(t => t.done).length;

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div className="page-title">Good morning, <span>{USER_PROFILE.name.split(" ")[0]}</span> 👋</div>
            <div className="page-sub">You're on a {USER_PROFILE.streak}-day streak. {6 - todayDone} tasks left today.</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate("weakness")}>🎯 Analyze Weaknesses</button>
            <button className="btn btn-primary btn-sm" onClick={() => onNavigate("tutor")}>🤖 Ask AI</button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          { val: USER_PROFILE.rating, lbl: "CF Rating", delta: "+47 last contest", up: true },
          { val: USER_PROFILE.totalSolved, lbl: "Problems Solved", delta: "+12 this week", up: true },
          { val: USER_PROFILE.contestsParticipated, lbl: "Contests", delta: "Div.2 rank 812", up: true },
          { val: `${todayDone}/${DAILY_PLAN.length}`, lbl: "Today's Tasks", delta: "2 remaining", up: false },
          { val: "52%", lbl: "DP Mastery", delta: "Critical gap ⚠", up: false },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-val">{s.val}</div>
            <div className="stat-lbl">{s.lbl}</div>
            <div className={`stat-delta ${s.up ? "delta-up" : "delta-dn"}`}>{s.delta}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 16 }}>
        {/* Rating Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Rating Trajectory</div>
              <div className="card-sub">Codeforces performance over 9 months</div>
            </div>
            <span className="tag tag-purple">+444 total</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={RATING_HISTORY} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="ratingGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C6FF7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7C6FF7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: "#5a6179", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#5a6179", fontSize: 11 }} axisLine={false} tickLine={false} domain={["dataMin - 100", "dataMax + 100"]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="rating" stroke="#7C6FF7" strokeWidth={2} fill="url(#ratingGrad)" dot={{ fill: "#7C6FF7", r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: "#a99ff9" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Today's Plan */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Today's Study Plan</div>
              <div className="card-sub">AI-generated based on your gaps</div>
            </div>
            <span style={{ fontSize: 13, color: "#22c87a", fontWeight: 600 }}>{todayDone}/{DAILY_PLAN.length} done</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {DAILY_PLAN.map((task, i) => {
              const typeColors = { practice: "#7C6FF7", study: "#42a5f5", ai: "#22c87a", revision: "#ffa726", contest: "#ef5350" };
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 10px", borderRadius: 8,
                  background: task.done ? "rgba(34,200,122,0.05)" : "var(--bg3)",
                  border: `1px solid ${task.done ? "rgba(34,200,122,0.15)" : "var(--border)"}`,
                  opacity: task.done ? 0.6 : 1
                }}>
                  <div style={{ fontSize: 16 }}>{task.done ? "✓" : "○"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: task.done ? "#5a6179" : "var(--text)", textDecoration: task.done ? "line-through" : "none" }}>{task.task}</div>
                    <div style={{ fontSize: 11, color: "#5a6179" }}>{task.time}</div>
                  </div>
                  <div style={{ width: 6, height: 6, borderRadius: 3, background: typeColors[task.type] }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 16 }}>
        {/* Topic Mastery */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Topic Mastery Map</div>
              <div className="card-sub">Weakest topics highlighted</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate("weakness")}>Full analysis →</button>
          </div>
          {topTopics.map(t => <MasteryBar key={t.id} topic={t} />)}
          <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[["#ef5350", "Critical (<40%)"], ["#ffa726", "Weak (40-60%)"], ["#42a5f5", "Mid (60-80%)"], ["#22c87a", "Strong (80%+)"]].map(([c, l]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#5a6179" }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />{l}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Contests */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Recent Contests</div>
              <div className="card-sub">Last 4 Codeforces rounds</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate("analytics")}>Analytics →</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {RECENT_CONTESTS.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--bg3)", borderRadius: 8, border: "1px solid var(--border)" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>{c.date} · Rank #{c.rank.toLocaleString()} of {c.totalParts.toLocaleString()}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: c.delta > 0 ? "#22c87a" : "#ef5350", fontFamily: "JetBrains Mono, monospace" }}>{c.delta > 0 ? "+" : ""}{c.delta}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>{c.solved} solved</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <div className="card-title">Activity Heatmap</div>
          <div className="card-sub">52 weeks of solve activity</div>
        </div>
        <div style={{ display: "flex", gap: 3, overflowX: "auto", paddingBottom: 8 }}>
          {HEATMAP_DATA.map((week, wi) => (
            <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {week.map((val, di) => <HeatmapCell key={di} value={val} />)}
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Achievements</div>
          <div className="card-sub">{ACHIEVEMENTS.filter(a => a.earned).length}/{ACHIEVEMENTS.length} earned</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
          {ACHIEVEMENTS.map(a => (
            <div key={a.id} style={{
              padding: "12px", borderRadius: 10,
              background: a.earned ? "rgba(124,111,247,0.08)" : "var(--bg3)",
              border: `1px solid ${a.earned ? "rgba(124,111,247,0.2)" : "var(--border)"}`,
              opacity: a.earned ? 1 : 0.5
            }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{a.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: a.earned ? "var(--accent2)" : "var(--text2)" }}>{a.name}</div>
              <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{a.desc}</div>
              {!a.earned && a.progress !== undefined && (
                <div style={{ marginTop: 8 }}>
                  <div className="progress-track">
                    <div className="progress-fill mastery-med" style={{ width: `${Math.min((a.progress / (a.id === "a8" ? 2100 : 30)) * 100, 100)}%` }} />
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 3 }}>{a.progress}{a.id === "a8" ? "/2100" : "/30"}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
