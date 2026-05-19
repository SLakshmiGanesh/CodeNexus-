import React, { useState, useEffect } from "react";
import { DSA_TOPICS, WEAK_TOPICS } from "../data/mockData";

const PRI = {
  critical:{ c:"#ff2244", l:"CRITICAL", bg:"rgba(255,34,68,.07)",  br:"rgba(255,34,68,.22)" },
  high:    { c:"#ffaa00", l:"HIGH",     bg:"rgba(255,170,0,.07)",  br:"rgba(255,170,0,.2)"  },
  medium:  { c:"#00f5ff", l:"MEDIUM",   bg:"rgba(0,245,255,.06)",  br:"rgba(0,245,255,.18)" },
};

function KnowledgeGraph({ selected, onSelect }) {
  const nodes = [
    { id:"arrays",  x:18,  y:22,  label:"Arrays",    mastery:88 },
    { id:"binary",  x:158, y:22,  label:"BinSearch",  mastery:83 },
    { id:"twoptr",  x:298, y:22,  label:"TwoPtr",    mastery:85 },
    { id:"prefix",  x:18,  y:130, label:"Prefix∑",   mastery:58 },
    { id:"segtree", x:158, y:130, label:"SegTree",   mastery:31 },
    { id:"graphs",  x:298, y:130, label:"Graphs",    mastery:67 },
    { id:"trees",   x:158, y:238, label:"Trees",     mastery:74 },
    { id:"dp",      x:18,  y:238, label:"DP",        mastery:52 },
    { id:"dptree",  x:88,  y:330, label:"DP+Trees",  mastery:44 },
    { id:"bit",     x:298, y:238, label:"BitManip",  mastery:44 },
  ];
  const edges = [
    ["arrays","prefix"],["arrays","twoptr"],["binary","arrays"],
    ["prefix","segtree"],["graphs","trees"],["trees","dptree"],
    ["dp","dptree"],["trees","dp"],["arrays","bit"]
  ];
  const get = id => nodes.find(n => n.id === id);
  const col = m => m<40?"#ff2244":m<60?"#ffaa00":m<80?"#00e5ff":"#00ff88";

  return (
    <svg viewBox="0 0 420 390" style={{width:"100%",maxHeight:340}}>
      <defs>
        <marker id="arw" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M2 2L8 5L2 8" fill="none" stroke="rgba(0,245,255,.15)" strokeWidth={1.5}/>
        </marker>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {edges.map(([a,b],i) => {
        const na = get(a), nb = get(b);
        if(!na||!nb) return null;
        return (
          <line key={i}
            x1={na.x+38} y1={na.y+18} x2={nb.x+38} y2={nb.y+18}
            stroke="rgba(0,245,255,.1)" strokeWidth={1.5} markerEnd="url(#arw)"
            strokeDasharray={na.mastery<60||nb.mastery<60?"4 3":"none"}
          />
        );
      })}

      {nodes.map(n => {
        const c = col(n.mastery);
        const weak = n.mastery < 60;
        const sel = selected === n.id;
        return (
          <g key={n.id} onClick={() => onSelect(n.id === selected ? null : n.id)} style={{cursor:"pointer"}}>
            {weak && (
              <circle cx={n.x+38} cy={n.y+18} r={32} fill="none"
                stroke={c} strokeWidth={1} strokeDasharray="3 3" opacity={0.35}>
                <animate attributeName="r" values="28;34;28" dur="2.8s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values=".35;.65;.35" dur="2.8s" repeatCount="indefinite"/>
              </circle>
            )}
            <rect x={n.x} y={n.y} width={76} height={36} rx={8}
              fill={sel?`${c}1a`:weak?`${c}0d`:"rgba(8,15,28,.9)"}
              stroke={c} strokeWidth={sel?2:weak?1.5:0.6}
              filter={sel||weak?"url(#glow)":"none"}/>
            {sel && <rect x={n.x} y={n.y} width={76} height={2} rx={1} fill={c}/>}
            <text x={n.x+38} y={n.y+22} textAnchor="middle"
              style={{fontSize:10,fill:c,fontFamily:"JetBrains Mono, monospace",fontWeight:weak?700:400}}>
              {n.label}
            </text>
            <text x={n.x+38} y={n.y+33} textAnchor="middle"
              style={{fontSize:8,fill:"rgba(255,255,255,.22)",fontFamily:"JetBrains Mono, monospace"}}>
              {n.mastery}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function ScanTerminal({ scanning, done, progress }) {
  const lines = [
    { t:"prompt", txt:"nexus@weakness-engine:~$" },
    { t:"cmd",    txt:" bfs_traverse --graph knowledge_graph.neo4j --depth 6" },
    { t:"out",    txt:"[◉] Loading DSA dependency graph (147 nodes, 312 edges)…" },
    { t:"out",    txt:"[◉] BFS from root nodes: Arrays, Math, Strings…" },
    { t:"warn",   txt:"[⚠] Weakness detected: Prefix Sums → Segment Trees path broken" },
    { t:"warn",   txt:"[⚠] Root cause: mastery(Prefix Sums)=58% < threshold(70%)" },
    { t:"err",    txt:"[✗] CRITICAL: Segment Trees mastery=31% — 3 contest failures linked" },
    { t:"out",    txt:"[◉] Cross-referencing contest history…" },
    { t:"out",    txt:"[◉] Running Bayesian inference on error patterns…" },
    { t:"out",    txt:"[✓] Analysis complete. 3 critical gaps identified." },
  ];
  const visible = scanning ? lines.slice(0, Math.floor(progress / 12)) : done ? lines : [];
  return (
    <div className="term" style={{marginBottom:20}}>
      <div className="term-body">
        {visible.map((l,i) => (
          <div key={i} className="tl" style={{marginBottom:2}}>
            {l.t==="prompt"&&<span style={{color:"#00ff88",fontFamily:"JetBrains Mono,monospace",fontSize:11}}>{l.txt}</span>}
            {l.t==="cmd"   &&<span style={{color:"#00f5ff",fontFamily:"JetBrains Mono,monospace",fontSize:11}}>{l.txt}</span>}
            {l.t==="out"   &&<span style={{color:"#3a5a80",fontFamily:"JetBrains Mono,monospace",fontSize:11}}>{l.txt}</span>}
            {l.t==="warn"  &&<span style={{color:"#ffaa00",fontFamily:"JetBrains Mono,monospace",fontSize:11}}>{l.txt}</span>}
            {l.t==="err"   &&<span style={{color:"#ff2244",fontFamily:"JetBrains Mono,monospace",fontSize:11}}>{l.txt}</span>}
          </div>
        ))}
        {scanning && <span className="tc-blink"/>}
      </div>
    </div>
  );
}

export default function WeaknessDetector({ onNavigate }) {
  const [sel, setSel] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState(false);
  const [prog, setProg] = useState(0);

  const runScan = () => {
    setScanning(true); setDone(false); setProg(0);
    const steps = [8,20,35,50,65,78,90,100];
    steps.forEach((p,i) => setTimeout(() => {
      setProg(p);
      if(i === steps.length-1) { setScanning(false); setDone(true); }
    }, (i+1)*300));
  };

  const sorted = [...DSA_TOPICS].sort((a,b) => a.mastery - b.mastery);
  const selNode = DSA_TOPICS.find(t => t.id === sel);

  return (
    <div className="page">
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:28}} className="s1">
        <div>
          <div className="ph-eye">graph-based analysis</div>
          <h1 className="ph-title">WEAKNESS <span className="c3">DETECTOR</span></h1>
          <p className="ph-sub">BFS traversal of DSA dependency graph — identifies root-cause gaps, not just symptoms</p>
        </div>
        <button className="btn btn-s" onClick={runScan} disabled={scanning} style={{marginTop:4}}>
          {scanning ? <><div className="spin"/>SCANNING…</> : "▶ RUN BFS SCAN"}
        </button>
      </div>

      {/* Scan progress bar */}
      {(scanning || done) && (
        <div style={{
          padding:"14px 18px",borderRadius:12,marginBottom:20,
          background:done?"rgba(0,255,136,.05)":"rgba(0,245,255,.05)",
          border:`1px solid ${done?"rgba(0,255,136,.2)":"rgba(0,245,255,.18)"}`,
        }} className="s2">
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
            <span style={{fontFamily:"JetBrains Mono,monospace",fontSize:12,fontWeight:700,color:done?"#00ff88":"#00f5ff"}}>
              {done?"✓ ANALYSIS COMPLETE — 3 CRITICAL GAPS DETECTED":"◉ TRAVERSING KNOWLEDGE GRAPH…"}
            </span>
            <span style={{fontFamily:"JetBrains Mono,monospace",fontSize:12,color:done?"#00ff88":"#00f5ff"}}>{prog}%</span>
          </div>
          <div className="pt8">
            <div className="pf8" style={{
              width:`${prog}%`,
              background:done?"linear-gradient(90deg,#00ff88,#00f5ff)":"linear-gradient(90deg,#00f5ff,#bf00ff)",
              transition:"width .35s ease"
            }}/>
          </div>
        </div>
      )}

      {/* Terminal output */}
      {(scanning || done) && <ScanTerminal scanning={scanning} done={done} progress={prog}/>}

      <div className="g2 mb16 s3">
        {/* Graph */}
        <div className={`hc ac scanner ${scanning?"on":""}`}>
          <div className="cb">
            <div className="ch">
              <div><div className="ct">Knowledge Graph</div><div className="cs">Pulsing nodes = weak · click to inspect</div></div>
              {done && <span className="tag tr">3 GAPS</span>}
            </div>
            <KnowledgeGraph selected={sel} onSelect={setSel}/>
            <div style={{display:"flex",gap:14,flexWrap:"wrap",marginTop:8}}>
              {[["#ff2244","Critical (<40%)"],["#ffaa00","Weak (40-60%)"],["#00e5ff","Mid (60-80%)"],["#00ff88","Strong (80%+)"]].map(([c,l])=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:9,color:"#3a5a80",fontFamily:"JetBrains Mono,monospace"}}>
                  <div style={{width:8,height:8,borderRadius:2,background:c,boxShadow:`0 0 6px ${c}`}}/>{l}
                </div>
              ))}
            </div>
            {selNode && (
              <div style={{
                marginTop:14,padding:"12px 14px",borderRadius:10,
                background:`${selNode.mastery<60?"rgba(255,34,68,.06)":"rgba(0,245,255,.05)"}`,
                border:`1px solid ${selNode.mastery<60?"rgba(255,34,68,.2)":"rgba(0,245,255,.15)"}`
              }}>
                <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:12,fontWeight:700,color:selNode.mastery<60?"#ff2244":"#00f5ff"}}>
                  {selNode.name.toUpperCase()} — {selNode.mastery}% MASTERY
                </div>
                <div style={{fontSize:11,color:"#3a5a80",marginTop:4}}>{selNode.problems} problems solved · {selNode.mastery<60?"Needs attention":"On track"}</div>
                <button className="btn btn-g btn-xs" style={{marginTop:8}} onClick={()=>onNavigate("roadmap")}>Fix this →</button>
              </div>
            )}
          </div>
        </div>

        {/* Topic list */}
        <div className="hc">
          <div className="cb">
            <div className="ch"><div className="ct">All Topics — Ranked</div><div className="cs">Weakest first</div></div>
            <div style={{display:"flex",flexDirection:"column",gap:5,maxHeight:400,overflowY:"auto"}}>
              {sorted.map(t => {
                const c = t.mastery<40?"#ff2244":t.mastery<60?"#ffaa00":t.mastery<80?"#00e5ff":"#00ff88";
                return (
                  <div key={t.id} onClick={()=>setSel(sel===t.id?null:t.id)} style={{
                    display:"flex",alignItems:"center",gap:10,padding:"9px 12px",
                    background:sel===t.id?"rgba(0,245,255,.06)":"rgba(5,10,18,.7)",
                    borderRadius:8,cursor:"pointer",
                    border:`1px solid ${sel===t.id?c:"rgba(0,245,255,.06)"}`,
                    transition:"all .15s"
                  }}>
                    <span style={{fontSize:15}}>{t.icon}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,fontWeight:t.mastery<60?700:500,color:t.mastery<60?c:"#e8f4ff",fontFamily:"JetBrains Mono,monospace"}}>{t.name}</div>
                      <div style={{fontSize:9,color:"#1a2a40",marginTop:1}}>{t.problems} solved</div>
                    </div>
                    <div style={{width:70}}><div className="pt"><div className="pf" style={{width:`${t.mastery}%`,background:c}}/></div></div>
                    <span style={{fontFamily:"JetBrains Mono,monospace",fontSize:10,color:c,width:28,textAlign:"right"}}>{t.mastery}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Critical gap deep-dives */}
      <div className="s4">
        <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:10,color:"#3a5a80",letterSpacing:".15em",textTransform:"uppercase",marginBottom:14}}>
          ◉ ROOT CAUSE ANALYSIS — CRITICAL GAPS
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {WEAK_TOPICS.map((wt,wi) => {
            const cfg = PRI[wt.priority];
            return (
              <div key={wt.id} style={{
                background:cfg.bg, border:`1px solid ${cfg.br}`,
                borderRadius:14, padding:20, position:"relative", overflow:"hidden"
              }}>
                <div style={{position:"absolute",top:0,left:0,bottom:0,width:3,background:cfg.c,borderRadius:"14px 0 0 14px"}}/>
                <div style={{position:"absolute",top:0,right:0,width:80,height:80,borderRadius:"50%",background:`${cfg.c}06`,filter:"blur(20px)"}}/>
                <div style={{marginLeft:14}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,flexWrap:"wrap"}}>
                    <span style={{fontFamily:"JetBrains Mono,monospace",fontSize:15,fontWeight:800,color:cfg.c,textShadow:`0 0 15px ${cfg.c}88`}}>{wt.name}</span>
                    <span style={{fontFamily:"JetBrains Mono,monospace",fontSize:9,background:cfg.bg,color:cfg.c,border:`1px solid ${cfg.br}`,padding:"2px 8px",borderRadius:20,letterSpacing:".1em"}}>{cfg.l}</span>
                    <span style={{fontFamily:"JetBrains Mono,monospace",fontSize:11,color:cfg.c}}>{wt.mastery}%</span>
                    <div style={{flex:1}}/>
                    <button className="btn btn-g btn-xs" onClick={()=>onNavigate("roadmap")}>Fix this →</button>
                  </div>
                  <div style={{fontSize:13,color:"#7aa0c8",marginBottom:4,lineHeight:1.6}}>{wt.reason}</div>
                  <div style={{fontSize:11,color:"#3a5a80",marginBottom:14,fontStyle:"italic",fontFamily:"JetBrains Mono,monospace"}}>
                    ◎ Root cause: {wt.rootCause}
                  </div>
                  <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:9,color:"#3a5a80",textTransform:"uppercase",letterSpacing:".12em",marginBottom:8}}>Recommended problems</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                    {wt.problems.map(p => (
                      <div key={p.id} style={{
                        display:"flex",alignItems:"center",gap:8,
                        background:"rgba(5,10,18,.9)",border:"1px solid rgba(0,245,255,.1)",
                        borderRadius:8,padding:"6px 12px"
                      }}>
                        <span style={{fontSize:12,color:"#e8f4ff",fontWeight:600}}>{p.name}</span>
                        <span className={`tag ${p.difficulty==="Easy"?"tg":p.difficulty==="Medium"?"ta":"tr"}`}>{p.difficulty}</span>
                        <span style={{fontSize:10,color:"#3a5a80",fontFamily:"JetBrains Mono,monospace"}}>{p.platform}</span>
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
