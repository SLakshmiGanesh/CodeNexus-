import React, { useState, useEffect, useRef } from "react";
import Dashboard from "./pages/Dashboard";
import WeaknessDetector from "./pages/WeaknessDetector";
import AITutor from "./pages/AITutor";
import Roadmap from "./pages/Roadmap";
import Analytics from "./pages/Analytics";
import ContestArena from "./pages/ContestArena";
import NeuralTwin from "./pages/NeuralTwin";
import { USER_PROFILE } from "./data/mockData";
import "./App.css";

const NAV = [
  { section: "INTELLIGENCE", items: [
    { id:"dashboard", label:"Command Center", icon:"⊞", k:"01" },
    { id:"neural",    label:"Neural Twin",    icon:"◉", k:"02" },
    { id:"weakness",  label:"Weak Detector",  icon:"◎", k:"03" },
  ]},
  { section: "LEARNING", items: [
    { id:"roadmap",   label:"Roadmap",        icon:"⬡", k:"04" },
    { id:"tutor",     label:"AI Tutor",       icon:"◈", k:"05" },
  ]},
  { section: "PERFORMANCE", items: [
    { id:"analytics", label:"Analytics",      icon:"▦", k:"06" },
    { id:"arena",     label:"Battle Arena",   icon:"⚔", k:"07" },
  ]},
];

const PAGES = { dashboard:Dashboard, neural:NeuralTwin, weakness:WeaknessDetector, roadmap:Roadmap, tutor:AITutor, analytics:Analytics, arena:ContestArena };

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [open, setOpen] = useState(true);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const Page = PAGES[page] || Dashboard;

  useEffect(() => {
    let mx=0,my=0,rx=0,ry=0;
    const move = e => { mx=e.clientX; my=e.clientY; };
    const tick = () => {
      rx+=(mx-rx)*.15; ry+=(my-ry)*.15;
      if(dotRef.current){ dotRef.current.style.left=mx+'px'; dotRef.current.style.top=my+'px'; }
      if(ringRef.current){ ringRef.current.style.left=rx+'px'; ringRef.current.style.top=ry+'px'; }
      requestAnimationFrame(tick);
    };
    const over = () => ringRef.current?.classList.add('big');
    const out  = () => ringRef.current?.classList.remove('big');
    document.addEventListener('mousemove', move);
    document.querySelectorAll('button,a,.nb').forEach(el=>{ el.addEventListener('mouseenter',over); el.addEventListener('mouseleave',out); });
    const raf = requestAnimationFrame(tick);
    return () => { document.removeEventListener('mousemove', move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className="app">
      <div className="cursor-dot" ref={dotRef}/>
      <div className="cursor-ring" ref={ringRef}/>

      <aside className={`sidebar ${open?'':'collapsed'}`}>
        <div className="sb-logo">
          <div className="logo-wrap">
            <div className="logo-hex"><span className="logo-inner">NX</span></div>
            {open && <div><div className="logo-name">NEXUS</div><div className="logo-sub">AI · OS · v4.2.1</div></div>}
          </div>
          <button className="sb-toggle" onClick={()=>setOpen(o=>!o)}>{open?'‹':'›'}</button>
        </div>

        <div className="user-pod">
          <div className="upod-inner">
            <div style={{position:'relative',flexShrink:0}}>
              <div className="user-av">{USER_PROFILE.avatar}</div>
              <div className="av-online"/>
            </div>
            {open && (
              <div className="user-dets">
                <div className="u-handle">{USER_PROFILE.handle || USER_PROFILE.name}</div>
                <div className="u-badges">
                  <span className="ub ub-r">{USER_PROFILE.rating}</span>
                  <span className="ub ub-k">{USER_PROFILE.rank}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <nav className="nav">
          {NAV.map(section => (
            <div key={section.section}>
              {open && <div className="nav-sec">{section.section}</div>}
              {section.items.map(n => (
                <button key={n.id} className={`nb ${page===n.id?'active':''}`}
                  onClick={()=>setPage(n.id)} title={!open?n.label:''}>
                  <span className="ni">{n.icon}</span>
                  {open && <span className="nl">{n.label}</span>}
                  {open && <span className="nk">{n.k}</span>}
                  {page===n.id && <span className="n-pip"/>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {open && (
          <div className="sb-foot">
            <div className="streak-mod">
              <span className="s-fire">🔥</span>
              <div><div className="s-val">{USER_PROFILE.streak}d</div><div className="s-lbl">Streak Active</div></div>
            </div>
            <div className="sys-row">
              <div className="sys-item">AI Online</div>
              <div className="sys-item">Models: 4</div>
              <div className="sys-item">Sync: Live</div>
            </div>
          </div>
        )}
      </aside>

      <main className="main"><Page onNavigate={setPage}/></main>
    </div>
  );
}
