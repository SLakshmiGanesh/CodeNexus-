import React, { useState, useEffect } from "react";
import { ROADMAP_PHASES, DSA_TOPICS } from "../data/mockData";

const PC = { active:"#00ff88", upcoming:"#00f5ff", locked:"#1a2a40" };

function Phase({ p, expanded, onToggle }) {
  const col = PC[p.status];
  const [w, setW] = useState(0);
  useEffect(() => {
    if(expanded && p.status === "active") {
      const id = setTimeout(() => setW(p.progress), 100);
      return () => clearTimeout(id);
    }
    setW(0);
  }, [expanded, p.progress, p.status]);

  return (
    <div style={{
      background:"rgba(5,10,18,.85)",borderRadius:14,overflow:"hidden",
      border:`1px solid ${p.status==="active"?"rgba(0,255,136,.2)":"rgba(0,245,255,.07)"}`,
      boxShadow:p.status==="active"?"0 0 30px rgba(0,255,136,.05)":"none",
      transition:"border-color .2s,box-shadow .2s"
    }}>
      {/* Header row */}
      <div style={{padding:"18px 20px",cursor:"pointer",display:"flex",alignItems:"center",gap:14}} onClick={onToggle}>
        <div style={{
          width:48,height:48,borderRadius:"50%",flexShrink:0,
          background:p.status==="locked"?"rgba(5,10,18,.9)":`${col}10`,
          border:`2px solid ${col}`,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontFamily:"JetBrains Mono, monospace",fontSize:14,fontWeight:700,color:col,
          boxShadow:p.status!=="locked"?`0 0 15px ${col}44`:""
        }}>
          {p.status==="locked"?"🔒":`0${p.phase}`}
        </div>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4,flexWrap:"wrap"}}>
            <span style={{fontFamily:"JetBrains Mono, monospace",fontSize:14,fontWeight:800,color:"#e8f4ff",letterSpacing:".04em"}}>{p.title.toUpperCase()}</span>
            <span style={{
              fontFamily:"JetBrains Mono, monospace",fontSize:9,padding:"2px 9px",borderRadius:20,
              background:`${col}12`,color:col,border:`1px solid ${col}33`,
              textTransform:"uppercase",letterSpacing:".1em"
            }}>{p.status}</span>
          </div>
          <div style={{fontSize:11,color:"#3a5a80",fontFamily:"JetBrains Mono, monospace"}}>{p.duration} · {p.topics.length} topics</div>
          {p.status==="active" && (
            <div style={{marginTop:9}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:9,color:"#3a5a80",fontFamily:"JetBrains Mono, monospace",textTransform:"uppercase",letterSpacing:".08em"}}>Progress</span>
                <span style={{fontFamily:"JetBrains Mono, monospace",fontSize:10,color:"#00ff88",fontWeight:700}}>{p.progress}%</span>
              </div>
              <div className="pt8"><div className="pf8 pg" style={{width:`${w}%`}}/></div>
            </div>
          )}
        </div>
        <span style={{color:"#1a2a40",fontSize:18,transform:expanded?"rotate(180deg)":"none",transition:"transform .2s"}}>▾</span>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div style={{padding:"0 20px 20px",borderTop:"1px solid rgba(0,245,255,.07)"}}>
          <div style={{fontFamily:"JetBrains Mono, monospace",fontSize:9,color:"#3a5a80",textTransform:"uppercase",letterSpacing:".12em",margin:"14px 0 10px"}}>Topics</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>
            {p.topics.map(t => {
              const topic = DSA_TOPICS.find(d => d.name.toLowerCase().includes(t.toLowerCase().split(" ")[0]));
              return (
                <div key={t} style={{
                  display:"flex",alignItems:"center",gap:8,
                  background:"rgba(5,10,18,.9)",border:"1px solid rgba(0,245,255,.1)",
                  borderRadius:8,padding:"7px 12px"
                }}>
                  <span style={{fontSize:12.5,fontWeight:500,color:"#e8f4ff"}}>{t}</span>
                  {topic && (
                    <>
                      <div className="pt" style={{width:44}}>
                        <div className="pf" style={{width:`${topic.mastery}%`,background:topic.mastery<60?"#ffaa00":"#00ff88"}}/>
                      </div>
                      <span style={{fontFamily:"JetBrains Mono, monospace",fontSize:9,color:"#3a5a80"}}>{topic.mastery}%</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
          {p.status !== "locked" && (
            <div style={{display:"flex",gap:8}}>
              <button className={`btn btn-sm ${p.status==="active"?"btn-s":"btn-p"}`}>
                {p.status==="active"?"▶ CONTINUE":"START PHASE"}
              </button>
              <button className="btn btn-g btn-sm">View Problems</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Roadmap({ onNavigate }) {
  const [exp, setExp] = useState(0);
  const total = Math.round(ROADMAP_PHASES.reduce((s,p)=>s+p.progress,0)/ROADMAP_PHASES.length);

  const revisions = [
    { t:"Binary Search",due:"Today",   iv:"7d",  m:83, urgent:true  },
    { t:"Two Pointers", due:"Tomorrow",iv:"14d", m:85, urgent:false },
    { t:"BFS/DFS",      due:"May 17",  iv:"5d",  m:67, urgent:false },
    { t:"Greedy",       due:"May 19",  iv:"10d", m:79, urgent:false },
    { t:"Prefix Sums",  due:"May 20",  iv:"3d",  m:58, urgent:false },
    { t:"Hash Maps",    due:"May 22",  iv:"21d", m:91, urgent:false },
  ];

  return (
    <div className="page">
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:28}} className="s1">
        <div>
          <div className="ph-eye">adaptive learning path</div>
          <h1 className="ph-title">MY <span className="c2">ROADMAP</span></h1>
          <p className="ph-sub">Topological-sort learning path · SM-2 spaced repetition · Updated after every session</p>
        </div>
        <button className="btn btn-g btn-sm" style={{marginTop:4}} onClick={()=>onNavigate("weakness")}>Re-analyze →</button>
      </div>

      {/* Stats */}
      <div className="stat-grid s2">
        {[
          { v:`${total}%`, l:"Overall Progress", d:"Foundation phase active", hot:"hc" },
          { v:"16",        l:"Total Weeks",       d:"Est. complete: Aug 2025" },
          { v:"Phase 1",   l:"Active Phase",      d:"Foundation Repair" },
          { v:"+453",      l:"Predicted Rating",  d:"87% confidence" },
        ].map((s,i)=>(
          <div key={i} className={`sm ${i===0?"hg":""}`}>
            <div className="sm-v">{s.v}</div>
            <div className="sm-l">{s.l}</div>
            <div className="sm-d du">{s.d}</div>
          </div>
        ))}
      </div>

      {/* Overall progress bar */}
      <div className="hc ag mb16 s3">
        <div className="cb" style={{padding:"16px 20px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <span style={{fontFamily:"JetBrains Mono,monospace",fontSize:10,color:"#3a5a80",textTransform:"uppercase",letterSpacing:".12em"}}>MISSION PROGRESS</span>
            <span style={{fontFamily:"JetBrains Mono,monospace",fontSize:14,fontWeight:700,color:"#00ff88"}}>{total}% complete</span>
          </div>
          <div className="pt8"><div className="pf8 pg" style={{width:`${total}%`}}/></div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
            <span style={{fontSize:9,color:"#1a2a40",fontFamily:"JetBrains Mono,monospace"}}>Foundation Repair</span>
            <span style={{fontSize:9,color:"#1a2a40",fontFamily:"JetBrains Mono,monospace"}}>Candidate Master</span>
          </div>
        </div>
      </div>

      {/* Phases */}
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}} className="s4">
        {ROADMAP_PHASES.map((p,i)=>(
          <Phase key={p.phase} p={p} expanded={exp===i} onToggle={()=>setExp(exp===i?null:i)}/>
        ))}
      </div>

      {/* SM-2 revision queue */}
      <div className="hc s5">
        <div className="cb">
          <div className="ch">
            <div><div className="ct">Spaced Repetition Queue</div><div className="cs">SM-2 algorithm · Elo-adjusted difficulty intervals</div></div>
            <span className="tag tg">6 DUE</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(196px,1fr))",gap:10}}>
            {revisions.map((r,i)=>(
              <div key={i} style={{
                padding:"12px 14px",borderRadius:10,
                background:"rgba(5,10,18,.85)",
                border:`1px solid ${r.urgent?"rgba(255,34,68,.25)":r.due==="Tomorrow"?"rgba(255,170,0,.15)":"rgba(0,245,255,.07)"}`,
                boxShadow:r.urgent?"0 0 15px rgba(255,34,68,.07)":"",
                position:"relative",overflow:"hidden"
              }}>
                {r.urgent&&<div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,#ff2244,transparent)"}}/>}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <span style={{fontSize:12,fontWeight:600,color:"#e8f4ff",fontFamily:"JetBrains Mono,monospace"}}>{r.t}</span>
                  <span className={`tag ${r.urgent?"tr":r.due==="Tomorrow"?"ta":"tc"}`}>{r.due}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                  <div className="pt" style={{flex:1}}>
                    <div className="pf" style={{width:`${r.m}%`,background:r.m<60?"#ffaa00":"#00ff88"}}/>
                  </div>
                  <span style={{fontFamily:"JetBrains Mono,monospace",fontSize:9,color:"#3a5a80"}}>{r.m}%</span>
                </div>
                <div style={{fontSize:9,color:"#1a2a40",fontFamily:"JetBrains Mono,monospace",textTransform:"uppercase",letterSpacing:".06em"}}>Interval: {r.iv}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
