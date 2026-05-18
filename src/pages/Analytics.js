import React, { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend
} from "recharts";
import { RATING_HISTORY, RECENT_CONTESTS, DSA_TOPICS } from "../data/mockData";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#1e2230", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px" }}>
        <p style={{ color: "#9aa0b4", fontSize: 12 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontFamily: "JetBrains Mono, monospace", fontWeight: 700, fontSize: 13 }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const SOLVE_BY_TOPIC = DSA_TOPICS.map(t => ({ name: t.name.split(" ")[0], solved: t.problems, mastery: t.mastery }));

const RADAR_DATA = [
  { subject: "Arrays", A: 88 }, { subject: "DP", A: 52 }, { subject: "Graphs", A: 67 },
  { subject: "Trees", A: 74 }, { subject: "SegTree", A: 31 }, { subject: "Greedy", A: 79 },
  { subject: "Math", A: 61 }, { subject: "Binary", A: 83 },
];

const SOLVE_TIME_DATA = [
  { day: "Mon", easy: 2, medium: 1, hard: 0 },
  { day: "Tue", easy: 1, medium: 2, hard: 1 },
  { day: "Wed", easy: 3, medium: 1, hard: 0 },
  { day: "Thu", easy: 0, medium: 3, hard: 1 },
  { day: "Fri", easy: 2, medium: 0, hard: 2 },
  { day: "Sat", easy: 4, medium: 2, hard: 1 },
  { day: "Sun", easy: 1, medium: 1, hard: 0 },
];

const PLATFORM_DATA = [
  { name: "Codeforces", solved: 187, color: "#7C6FF7" },
  { name: "LeetCode", solved: 124, color: "#22c87a" },
  { name: "AtCoder", solved: 28, color: "#ffa726" },
  { name: "HackerRank", solved: 8, color: "#42a5f5" },
];

export default function Analytics({ onNavigate }) {
  const [timeRange, setTimeRange] = useState("3m");

  const filteredRating = timeRange === "1m" ? RATING_HISTORY.slice(-2) :
    timeRange === "3m" ? RATING_HISTORY.slice(-4) : RATING_HISTORY;

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div className="page-title">📊 <span>Analytics</span></div>
            <div className="page-sub">Deep-dive into your competitive programming performance</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["1m", "3m", "all"].map(r => (
              <button key={r} onClick={() => setTimeRange(r)} className={`btn btn-sm ${timeRange === r ? "btn-primary" : "btn-ghost"}`}>
                {r === "all" ? "All time" : r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top stats */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {[
          { val: "1647", lbl: "Current Rating", delta: "+444 total gain", up: true },
          { val: "Top 4.4%", lbl: "Global Rank", delta: "Best: top 3.5%", up: true },
          { val: "74%", lbl: "Acceptance Rate", delta: "+6% vs last month", up: true },
          { val: "2.3h", lbl: "Avg Solve Time", delta: "-18min vs last month", up: true },
          { val: "28", lbl: "Contests", delta: "Next: May 18", up: true },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-val">{s.val}</div>
            <div className="stat-lbl">{s.lbl}</div>
            <div className={`stat-delta ${s.up ? "delta-up" : "delta-dn"}`}>{s.delta}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 16 }}>
        {/* Rating history */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Rating History</div>
            <div className="card-sub">Codeforces trajectory</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={filteredRating} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="rg2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C6FF7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7C6FF7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: "#5a6179", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#5a6179", fontSize: 11 }} axisLine={false} tickLine={false} domain={["dataMin - 80", "dataMax + 80"]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="rating" stroke="#7C6FF7" strokeWidth={2.5} fill="url(#rg2)"
                dot={{ fill: "#7C6FF7", r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: "#a99ff9" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Skill radar */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Skill Radar</div>
            <div className="card-sub">Topic mastery overview</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={RADAR_DATA} margin={{ top: 10, right: 30, bottom: 0, left: 30 }}>
              <PolarGrid stroke="rgba(255,255,255,0.07)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#5a6179", fontSize: 10 }} />
              <Radar name="Mastery" dataKey="A" stroke="#7C6FF7" fill="#7C6FF7" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 16 }}>
        {/* Weekly solve volume */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">This Week — Solve Volume</div>
            <div className="card-sub">Problems by difficulty</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={SOLVE_TIME_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <XAxis dataKey="day" tick={{ fill: "#5a6179", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#5a6179", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="easy" stackId="a" fill="#22c87a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="medium" stackId="a" fill="#ffa726" radius={[0, 0, 0, 0]} />
              <Bar dataKey="hard" stackId="a" fill="#ef5350" radius={[4, 4, 0, 0]} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#5a6179" }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Problems by topic */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Problems Solved by Topic</div>
            <div className="card-sub">Exposure distribution</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={SOLVE_BY_TOPIC} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 30 }}>
              <XAxis type="number" tick={{ fill: "#5a6179", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#9aa0b4", fontSize: 11 }} axisLine={false} tickLine={false} width={50} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="solved" radius={[0, 4, 4, 0]}>
                {SOLVE_BY_TOPIC.map((entry, i) => (
                  <Cell key={i} fill={entry.mastery < 60 ? "#ffa726" : entry.mastery < 80 ? "#42a5f5" : "#22c87a"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Platform breakdown + Contest history */}
      <div className="grid-2" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Platform Breakdown</div>
            <div className="card-sub">Where you solve</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {PLATFORM_DATA.map(p => (
              <div key={p.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{p.name}</span>
                  <span style={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: p.color }}>{p.solved} solved</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${(p.solved / 347) * 100}%`, background: p.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="divider" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { lbl: "Codeforces Rating", val: "1647" },
              { lbl: "LeetCode Ranking", val: "~85k" },
              { lbl: "AtCoder Rating", val: "712" },
              { lbl: "Total Problems", val: "347" },
            ].map((s, i) => (
              <div key={i} style={{ background: "var(--bg3)", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "JetBrains Mono, monospace", color: "var(--text)" }}>{s.val}</div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Contest Performance</div>
            <div className="card-sub">Rating delta per contest</div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={RECENT_CONTESTS.map(c => ({ name: c.name.replace("Codeforces Round ", "CF ").replace("Educational Round ", "EDU ").replace("Div.2 Round ", "D2 "), delta: c.delta }))} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
              <XAxis dataKey="name" tick={{ fill: "#5a6179", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#5a6179", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="delta" radius={[4, 4, 0, 0]}>
                {RECENT_CONTESTS.map((c, i) => <Cell key={i} fill={c.delta > 0 ? "#22c87a" : "#ef5350"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="divider" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {RECENT_CONTESTS.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: "var(--bg3)", borderRadius: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>{c.date} · Rank #{c.rank.toLocaleString()}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: c.delta > 0 ? "#22c87a" : "#ef5350", fontFamily: "JetBrains Mono, monospace" }}>
                    {c.delta > 0 ? "+" : ""}{c.delta}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>{c.solved}/5 solved</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prediction section */}
      <div className="card" style={{ background: "rgba(124,111,247,0.05)", border: "1px solid rgba(124,111,247,0.2)" }}>
        <div className="card-header">
          <div>
            <div className="card-title" style={{ color: "var(--accent2)" }}>🔮 AI Rating Prediction</div>
            <div className="card-sub">LSTM model based on last 4 contests + skill profile</div>
          </div>
          <span className="tag tag-purple">87% confidence</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
          {[
            { lbl: "Predicted next delta", val: "+38 to +61", color: "#22c87a" },
            { lbl: "Projected rating (3mo)", val: "1820–1890", color: "#7C6FF7" },
            { lbl: "Target rank tier", val: "Candidate Master", color: "#ffa726" },
            { lbl: "Key unlock", val: "Fix Seg Trees", color: "#ef5350" },
          ].map((p, i) => (
            <div key={i} style={{ background: "var(--bg3)", borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "JetBrains Mono, monospace", color: p.color }}>{p.val}</div>
              <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>{p.lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
