import React, { useState, useEffect, useRef } from "react";

const PROBLEMS = [
  { id:"A", title:"Balanced Brackets", diff:"800", tag:"strings",
    stmt:"Given a string of brackets, determine if it is balanced.\n\nInput: string s (1 ≤ |s| ≤ 10⁵) containing only '(' and ')'\nOutput: 'YES' if balanced, 'NO' otherwise\n\nExample:\nInput:  (()())\nOutput: YES\n\nInput:  )(\nOutput: NO" },
  { id:"B", title:"Array Maximum", diff:"1100", tag:"greedy, binary search",
    stmt:"Given an array of n integers, perform at most k operations (add 1 to any element). Find the maximum possible minimum element.\n\nInput: n k (1 ≤ n ≤ 2×10⁵, 0 ≤ k ≤ 10⁹)\nSecond line: n integers\nOutput: Maximum possible minimum\n\nExample:\nInput:  3 5\n        1 2 3\nOutput: 3" },
  { id:"C", title:"Tree Paths", diff:"1600", tag:"trees, dfs, prefix sums",
    stmt:"Given a tree with n nodes rooted at 1, find paths (u,v) where u is an ancestor of v and the sum along the path is divisible by k.\n\nInput: n k (1 ≤ n ≤ 10⁵, 1 ≤ k ≤ 10⁶)\nNode values, then n-1 edges\nOutput: Count of valid paths\n\nExample:\nInput:  5 3\n        1 2 3 1 2\n        Edges: 1-2, 1-3, 2-4, 2-5\nOutput: 4" },
  { id:"D", title:"Segment Queries", diff:"2000", tag:"segment tree, lazy propagation",
    stmt:"Given an array, process q queries:\nType 1: l r x — add x to [l,r]\nType 2: l r — find max in [l,r]\n\nInput: n q (1 ≤ n,q ≤ 2×10⁵)\nSecond line: n integers\nNext q lines: queries\nOutput: Answer each type-2 query\n\nExample:\nInput:  5 4\n        1 3 2 4 5\n        1 1 3 2\n        2 1 5\nOutput: 7" },
];

const BOARD = [
  { rank:1, name:"tourist",   rating:3979, solved:4, time:"00:47:23", delta:"+89" },
  { rank:2, name:"Um_nik",    rating:3664, solved:4, time:"00:52:11", delta:"+84" },
  { rank:3, name:"neal_wu",   rating:3590, solved:3, time:"00:38:05", delta:"+71" },
  { rank:4, name:"arjun_cf",  rating:1647, solved:0, time:"--:--:--", delta:"?",  you:true },
  { rank:5, name:"galen_colin",rating:3456,solved:3, time:"00:41:22", delta:"+68" },
];

function Timer({ elapsed, running }) {
  const f = s => {
    const h=Math.floor(s/3600).toString().padStart(2,"0");
    const m=Math.floor((s%3600)/60).toString().padStart(2,"0");
    const ss=(s%60).toString().padStart(2,"0");
    return `${h}:${m}:${ss}`;
  };
  return (
    <span style={{fontFamily:"JetBrains Mono, monospace",fontSize:28,fontWeight:700,
      color:running?"#00ff88":"#3a5a80",letterSpacing:".06em",
      textShadow:running?"0 0 20px rgba(0,255,136,.5)":""}}>
      {f(elapsed)}
    </span>
  );
}

export default function ContestArena() {
  const [mode, setMode] = useState("lobby");
  const [problems, setProblems] = useState(PROBLEMS.map(p=>({...p,solved:false})));
  const [selP, setSelP] = useState(null);
  const [code, setCode] = useState(`// NEXUS Judge — C++17\n#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    // Your solution here\n    \n    return 0;\n}\n`);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [verdict, setVerdict] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if(running) timerRef.current = setInterval(()=>setElapsed(e=>e+1),1000);
    else clearInterval(timerRef.current);
    return ()=>clearInterval(timerRef.current);
  },[running]);

  const start = () => {
    setMode("contest"); setRunning(true);
    setSelP(PROBLEMS[0]); setElapsed(0);
  };

  const submit = () => {
    setVerdict("judging");
    setTimeout(()=>{
      const ac = Math.random()>.35;
      setVerdict(ac?"AC":"WA");
      if(ac && selP) setProblems(p=>p.map(x=>x.id===selP.id?{...x,solved:true}:x));
    },1800);
  };

  const solved = problems.filter(p=>p.solved).length;

  if(mode==="lobby") return (
    <div className="page">
      <div style={{marginBottom:28}} className="s1">
        <div className="ph-eye">competitive arena</div>
        <h1 className="ph-title">BATTLE <span className="c3">ARENA</span></h1>
        <p className="ph-sub">AI-calibrated mock contests · sandboxed code execution · real-time leaderboards</p>
      </div>

      <div className="g2 mb16 s2">
        {/* Mock contest */}
        <div className="hc ac" style={{border:"1px solid rgba(0,245,255,.2)",boxShadow:"0 0 40px rgba(0,245,255,.05)"}}>
          <div className="cb">
            <div style={{fontSize:36,marginBottom:12}}>🏆</div>
            <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:16,fontWeight:800,color:"#e8f4ff",letterSpacing:".06em",marginBottom:6}}>PERSONALIZED MOCK CONTEST</div>
            <div style={{fontSize:13,color:"#7aa0c8",marginBottom:16,lineHeight:1.6}}>4 problems calibrated to your rating (±200). Mirrors Codeforces Div.2 format. 2-hour time limit.</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:18}}>
              {[["4 Problems","tc"],["Rating 1447-1847","ta"],["2 Hours","tg"],["CF Format","tp"]].map(([l,c])=>(
                <span key={l} className={`tag ${c}`}>{l}</span>
              ))}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:20}}>
              {PROBLEMS.map(p=>(
                <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:"rgba(5,10,18,.8)",borderRadius:8,border:"1px solid rgba(0,245,255,.08)"}}>
                  <span style={{fontFamily:"JetBrains Mono,monospace",fontSize:13,fontWeight:700,color:"#00f5ff",width:16}}>{p.id}</span>
                  <span style={{fontSize:13,color:"#e8f4ff",flex:1}}>{p.title}</span>
                  <span className={`tag ${parseInt(p.diff)<1200?"tg":parseInt(p.diff)<1800?"ta":"tr"}`}>{p.diff}</span>
                </div>
              ))}
            </div>
            <button className="btn btn-s" onClick={start} style={{width:"100%",justifyContent:"center",fontSize:14}}>
              ▶ LAUNCH CONTEST
            </button>
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {/* 1v1 teaser */}
          <div className="hc ar" style={{flex:0}}>
            <div className="cb">
              <div style={{fontSize:28,marginBottom:8}}>⚔</div>
              <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:14,fontWeight:800,color:"#e8f4ff",letterSpacing:".06em",marginBottom:6}}>1v1 BATTLE MODE</div>
              <div style={{fontSize:13,color:"#7aa0c8",marginBottom:12}}>Challenge peers to real-time coding duels. Same problem, first to AC wins. Live progress via WebSocket.</div>
              <div style={{display:"flex",gap:8}}>
                <span className="tag tr">COMING SOON</span>
                <span className="tag ta">WebSocket + Docker</span>
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="hc" style={{flex:1}}>
            <div className="cb">
              <div className="ch"><div><div className="ct">Leaderboard</div><div className="cs">Global mock rankings</div></div></div>
              {BOARD.map(u=>(
                <div key={u.rank} style={{
                  display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:8,marginBottom:6,
                  background:u.you?"rgba(0,245,255,.06)":"rgba(5,10,18,.8)",
                  border:`1px solid ${u.you?"rgba(0,245,255,.25)":"rgba(0,245,255,.06)"}`,
                  boxShadow:u.you?"0 0 15px rgba(0,245,255,.05)":""
                }}>
                  <span style={{width:22,fontFamily:"JetBrains Mono,monospace",fontSize:12,color:u.rank<=3?"#ffaa00":"#3a5a80",fontWeight:700}}>#{u.rank}</span>
                  <div style={{flex:1}}>
                    <span style={{fontSize:13,fontWeight:u.you?700:500,color:u.you?"#00f5ff":"#e8f4ff"}}>{u.name}</span>
                    {u.you&&<span style={{fontSize:9,marginLeft:6,color:"#00f5ff",fontFamily:"JetBrains Mono,monospace"}}>[YOU]</span>}
                  </div>
                  <span style={{fontSize:11,fontFamily:"JetBrains Mono,monospace",color:"#3a5a80"}}>{u.time}</span>
                  <span style={{fontSize:12,fontFamily:"JetBrains Mono,monospace",color:u.delta.startsWith("+")?"#00ff88":"#3a5a80",width:36,textAlign:"right"}}>{u.delta}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Contest mode — full screen
  return (
    <div style={{display:"flex",height:"100vh",overflow:"hidden"}}>
      {/* Problem sidebar */}
      <div style={{width:220,background:"rgba(2,4,8,.97)",borderRight:"1px solid rgba(0,245,255,.1)",display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"16px 14px",borderBottom:"1px solid rgba(0,245,255,.08)"}}>
          <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:10,color:"#3a5a80",textTransform:"uppercase",letterSpacing:".12em",marginBottom:8}}>Mock Contest</div>
          <Timer elapsed={elapsed} running={running}/>
          <div style={{fontSize:10,color:"#3a5a80",marginTop:4,fontFamily:"JetBrains Mono,monospace"}}>{solved}/{problems.length} SOLVED</div>
          <div className="pt8" style={{marginTop:8}}>
            <div className="pf8 pg" style={{width:`${(solved/problems.length)*100}%`}}/>
          </div>
        </div>
        <div style={{flex:1,padding:"8px",display:"flex",flexDirection:"column",gap:4}}>
          {problems.map(p=>(
            <button key={p.id} onClick={()=>{setSelP(p);setVerdict(null);}} style={{
              display:"flex",alignItems:"center",gap:10,padding:"10px 10px",
              background:selP?.id===p.id?"rgba(0,245,255,.08)":"none",
              border:`1px solid ${selP?.id===p.id?"rgba(0,245,255,.25)":"transparent"}`,
              borderRadius:8,cursor:"pointer",textAlign:"left",fontFamily:"JetBrains Mono,monospace",width:"100%"
            }}>
              <div style={{
                width:28,height:28,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",
                background:p.solved?"rgba(0,255,136,.12)":"rgba(5,10,18,.9)",
                border:`1px solid ${p.solved?"rgba(0,255,136,.3)":"rgba(0,245,255,.1)"}`,
                fontSize:11,fontWeight:800,color:p.solved?"#00ff88":"#3a5a80",
                boxShadow:p.solved?"0 0 8px rgba(0,255,136,.2)":""
              }}>{p.solved?"✓":p.id}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:11,fontWeight:600,color:p.solved?"#00ff88":"#e8f4ff",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.title}</div>
                <div style={{fontSize:9,color:"#3a5a80",marginTop:1}}>{p.diff}</div>
              </div>
            </button>
          ))}
        </div>
        <div style={{padding:"10px 8px",borderTop:"1px solid rgba(0,245,255,.08)"}}>
          <button className="btn btn-d btn-sm" style={{width:"100%",justifyContent:"center"}} onClick={()=>{setRunning(false);setMode("lobby");}}>
            END CONTEST
          </button>
        </div>
      </div>

      {/* Main area */}
      <div style={{flex:1,display:"flex",overflow:"hidden"}}>
        {/* Problem statement */}
        <div style={{width:"38%",padding:"20px",overflowY:"auto",borderRight:"1px solid rgba(0,245,255,.08)",background:"rgba(2,4,8,.9)"}}>
          {selP && (
            <>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                <span style={{fontFamily:"JetBrains Mono,monospace",fontSize:22,fontWeight:800,color:"#00f5ff",textShadow:"0 0 15px rgba(0,245,255,.5)"}}>{selP.id}</span>
                <div>
                  <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:14,fontWeight:700,color:"#e8f4ff"}}>{selP.title}</div>
                  <div style={{display:"flex",gap:6,marginTop:4}}>
                    <span className={`tag ${parseInt(selP.diff)<1200?"tg":parseInt(selP.diff)<1800?"ta":"tr"}`}>{selP.diff}</span>
                    <span className="tag tc">{selP.tag}</span>
                  </div>
                </div>
              </div>
              <pre style={{fontFamily:"JetBrains Mono,monospace",fontSize:12,color:"#7aa0c8",lineHeight:1.7,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
                {selP.stmt}
              </pre>
            </>
          )}
        </div>

        {/* Editor */}
        <div style={{flex:1,display:"flex",flexDirection:"column",background:"rgba(0,0,8,.98)"}}>
          <div style={{padding:"10px 16px",background:"rgba(5,10,18,.9)",borderBottom:"1px solid rgba(0,245,255,.08)",display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontFamily:"JetBrains Mono,monospace",fontSize:10,color:"#3a5a80",textTransform:"uppercase",letterSpacing:".1em"}}>C++17</span>
            <div style={{flex:1}}/>
            {verdict && (
              <span style={{
                fontSize:12,fontWeight:700,fontFamily:"JetBrains Mono,monospace",
                color:verdict==="AC"?"#00ff88":verdict==="WA"?"#ff2244":"#ffaa00",
                padding:"3px 12px",borderRadius:6,letterSpacing:".08em",
                background:verdict==="AC"?"rgba(0,255,136,.1)":verdict==="WA"?"rgba(255,34,68,.1)":"rgba(255,170,0,.1)",
                border:`1px solid ${verdict==="AC"?"rgba(0,255,136,.25)":verdict==="WA"?"rgba(255,34,68,.25)":"rgba(255,170,0,.25)"}`,
                textShadow:verdict==="AC"?"0 0 10px rgba(0,255,136,.5)":verdict==="WA"?"0 0 10px rgba(255,34,68,.5)":""
              }}>
                {verdict==="judging"?"⏳ JUDGING…":verdict==="AC"?"✓ ACCEPTED":verdict==="WA"?"✗ WRONG ANSWER":""}
              </span>
            )}
            <button className="btn btn-g btn-xs" onClick={()=>setVerdict(null)}>Reset</button>
            <button className="btn btn-ok btn-sm" onClick={submit} disabled={verdict==="judging"} style={{textTransform:"uppercase",letterSpacing:".08em"}}>
              {verdict==="judging"?<><div className="spin"/>Judging…</>:"▶ SUBMIT"}
            </button>
          </div>
          <textarea value={code} onChange={e=>setCode(e.target.value)} style={{
            flex:1,resize:"none",
            background:"#00000d",color:"#cdd6f4",
            fontFamily:"JetBrains Mono, monospace",fontSize:13,lineHeight:1.65,
            border:"none",outline:"none",padding:"18px 22px",width:"100%",
          }} spellCheck={false}/>
        </div>
      </div>
    </div>
  );
}
