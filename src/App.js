import React, { useState } from "react";
import Dashboard from "./pages/Dashboard";
import WeaknessDetector from "./pages/WeaknessDetector";
import AITutor from "./pages/AITutor";
import Roadmap from "./pages/Roadmap";
import Analytics from "./pages/Analytics";
import ContestArena from "./pages/ContestArena";
import { USER_PROFILE } from "./data/mockData";
import "./App.css";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "⊞" },
  { id: "weakness", label: "Weakness Detector", icon: "🎯" },
  { id: "roadmap", label: "My Roadmap", icon: "🗺" },
  { id: "tutor", label: "AI Tutor", icon: "🤖" },
  { id: "analytics", label: "Analytics", icon: "📊" },
  { id: "arena", label: "Battle Arena", icon: "⚔" },
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const pages = { dashboard: Dashboard, weakness: WeaknessDetector, roadmap: Roadmap, tutor: AITutor, analytics: Analytics, arena: ContestArena };
  const PageComponent = pages[page] || Dashboard;

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">◈</span>
            {sidebarOpen && <span className="logo-text">CP<em>Mentor</em></span>}
          </div>
          <button className="collapse-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? "‹" : "›"}
          </button>
        </div>

        <div className="user-card">
          <div className="avatar">{USER_PROFILE.avatar}</div>
          {sidebarOpen && (
            <div className="user-info">
              <div className="user-name">{USER_PROFILE.name}</div>
              <div className="user-meta">
                <span className="rating-badge">{USER_PROFILE.rating}</span>
                <span className="rank-label">{USER_PROFILE.rank}</span>
              </div>
            </div>
          )}
        </div>

        <nav className="nav">
          {NAV.map(item => (
            <button
              key={item.id}
              className={`nav-item ${page === item.id ? "active" : ""}`}
              onClick={() => setPage(item.id)}
              title={!sidebarOpen ? item.label : ""}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
              {page === item.id && <span className="nav-indicator" />}
            </button>
          ))}
        </nav>

        {sidebarOpen && (
          <div className="sidebar-footer">
            <div className="streak-box">
              <span className="streak-fire">🔥</span>
              <div>
                <div className="streak-num">{USER_PROFILE.streak} day streak</div>
                <div className="streak-sub">Keep it going!</div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="main">
        <PageComponent onNavigate={setPage} />
      </main>
    </div>
  );
}
