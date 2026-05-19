import React, { useState, useRef, useEffect } from "react";
import { askAITutor, explainConcept, generateHint } from "../services/aiService";
import { renderMarkdown } from "../utils/markdown";
import { DSA_TOPICS, AGENT_SWARM } from "../data/mockData";

const QUICK = [
  { label:"Explain Segment Trees", msg:"Explain segment trees from scratch. I know prefix sums. Give intuition, C++ template, and 2 classic problems.", icon:"📊" },
  { label:"DP on Trees intuition", msg:"Give me the core intuition for DP on trees. Why rerooting? Concrete example with code.", icon:"🌲" },
  { label:"Level-1 hint: RSQ", msg:"I'm stuck on Range Sum Query - Mutable (LeetCode 307). Give me a level-1 conceptual hint only.", icon:"💡" },
  { label:"Review my code", msg:"Review this segment tree:\n```cpp\nclass SegTree {\n  vector<int> t;\n  int n;\npublic:\n  SegTree(int n):n(n),t(2*n){}\n  void update(int i,int v){\n    for(t[i+=n]=v;i>1;i>>=1)t[i>>1]=t[i]+t[i^1];\n  }\n  int query(int l,int r){\n    int res=0;\n    for(l+=n,r+=n;l<r;l>>=1,r>>=1){\n      if(l&1)res+=t[l++];\n      if(r&1)res+=t[--r];\n    }\n    return res;\n  }\n};\n```", icon:"🔍" },
  { label:"Contest strategy", msg:"I'm Expert (1647) targeting Candidate Master. What's my optimal contest strategy for the next 3 months?", icon:"🎯" },
  { label:"Bitmask DP", msg:"Explain bitmask DP for competitive programming. Start with the subset sum problem, then TSP. Include C++ code.", icon:"⚙️" },
];

function Msg({ m }) {
  const isU = m.role === "user";
  return (
    <div style={{display:"flex",flexDirection:isU?"row-reverse":"row",gap:12,marginBottom:20,alignItems:"flex-start"}}>
      <div style={{
        width:34,height:34,borderRadius:"50%",flexShrink:0,
        background:isU?"linear-gradient(135deg,#bf00ff,#00f5ff)":"linear-gradient(135deg,#00ff88,#00f5ff)",
        display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:13,fontWeight:700,color:"#00000a",fontFamily:"JetBrains Mono, monospace",
        boxShadow:isU?"0 0 15px rgba(191,0,255,.3)":"0 0 15px rgba(0,255,136,.3)"
      }}>
        {isU?"U":"N"}
      </div>
      <div style={{maxWidth:"80%",minWidth:0}}>
        <div style={{
          background:isU?"rgba(191,0,255,.08)":"rgba(0,245,255,.05)",
          border:`1px solid ${isU?"rgba(191,0,255,.2)":"rgba(0,245,255,.12)"}`,
          borderRadius:isU?"16px 4px 16px 16px":"4px 16px 16px 16px",
          padding:"12px 16px",
          boxShadow:isU?"0 0 20px rgba(191,0,255,.05)":"0 0 20px rgba(0,245,255,.05)"
        }}>
          {m.loading?(
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div className="spin"/>
              <span style={{fontSize:12,color:"#3a5a80",fontFamily:"JetBrains Mono, monospace"}}>NEXUS AI processing…</span>
            </div>
          ):(
            <div className="air" dangerouslySetInnerHTML={{__html:renderMarkdown(m.content)}}/>
          )}
        </div>
        <div style={{fontSize:9,color:"#1a2a40",marginTop:4,textAlign:isU?"right":"left",fontFamily:"JetBrains Mono, monospace",letterSpacing:".05em"}}>
          {isU?"USER":"NEXUS AI"} · {m.time}
        </div>
      </div>
    </div>
  );
}

function HintEngine({ disabled }) {
  const [prob, setProb] = useState("");
  const [plat, setPlat] = useState("LeetCode");
  const [diff, setDiff] = useState("Medium");
  const [code, setCode] = useState("");
  const [lvl, setLvl] = useState(1);
  const [hint, setHint] = useState("");
  const [loading, setLoading] = useState(false);

  const get = async () => {
    setHint(""); setLoading(true);
    try { const h = await generateHint({name:prob,platform:plat,difficulty:diff},lvl,code); setHint(h); }
    catch { setHint("Failed. Check API connection."); }
    setLoading(false);
  };

  return (
    <div className="g2">
      <div className="hc"><div className="cb">
        <div className="ct" style={{marginBottom:16}}>HINT ENGINE</div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div>
            <div style={{fontSize:10,color:"#3a5a80",fontFamily:"JetBrains Mono, monospace",textTransform:"uppercase",letterSpacing:".1em",marginBottom:5}}>Problem</div>
            <input value={prob} onChange={e=>setProb(e.target.value)} placeholder="e.g. Range Sum Query - Mutable"/>
          </div>
          <div style={{display:"flex",gap:10}}>
            <div style={{flex:1}}>
              <div style={{fontSize:10,color:"#3a5a80",fontFamily:"JetBrains Mono, monospace",textTransform:"uppercase",letterSpacing:".1em",marginBottom:5}}>Platform</div>
              <select value={plat} onChange={e=>setPlat(e.target.value)}>
                <option>LeetCode</option><option>Codeforces</option><option>AtCoder</option><option>HackerRank</option>
              </select>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:10,color:"#3a5a80",fontFamily:"JetBrains Mono, monospace",textTransform:"uppercase",letterSpacing:".1em",marginBottom:5}}>Difficulty</div>
              <select value={diff} onChange={e=>setDiff(e.target.value)}>
                <option>Easy</option><option>Medium</option><option>Hard</option><option>1400</option><option>1600</option><option>1800</option><option>2000</option>
              </select>
            </div>
          </div>
          <div>
            <div style={{fontSize:10,color:"#3a5a80",fontFamily:"JetBrains Mono, monospace",textTransform:"uppercase",letterSpacing:".1em",marginBottom:5}}>Your Code (optional)</div>
            <textarea value={code} onChange={e=>setCode(e.target.value)} placeholder="Paste your attempt…" rows={5} style={{fontFamily:"JetBrains Mono, monospace",fontSize:12,resize:"none"}}/>
          </div>
          <div>
            <div style={{fontSize:10,color:"#3a5a80",fontFamily:"JetBrains Mono, monospace",textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}}>Hint Level</div>
            <div style={{display:"flex",gap:8}}>
              {[[1,"💡 Nudge"],[2,"🔧 Direction"],[3,"📝 Skeleton"]].map(([l,lbl])=>(
                <button key={l} onClick={()=>setLvl(l)} style={{
                  flex:1,padding:"8px 6px",borderRadius:8,cursor:"pointer",
                  background:lvl===l?"rgba(0,245,255,.12)":"rgba(5,10,18,.8)",
                  border:`1px solid ${lvl===l?"rgba(0,245,255,.35)":"rgba(0,245,255,.08)"}`,
                  color:lvl===l?"#00f5ff":"#3a5a80",
                  fontSize:11,fontFamily:"JetBrains Mono, monospace",
                  boxShadow:lvl===l?"0 0 12px rgba(0,245,255,.1)":""
                }}>{lbl}</button>
              ))}
            </div>
          </div>
          <button className="btn btn-p" onClick={get} disabled={loading||!prob} style={{justifyContent:"center"}}>
            {loading?<><div className="spin"/>Processing…</>:"Get Hint →"}
          </button>
        </div>
      </div></div>
      <div className="hc ac"><div className="cb">
        <div className="ct" style={{marginBottom:16}}>HINT OUTPUT · LEVEL {lvl}</div>
        {!hint&&!loading&&(
          <div style={{textAlign:"center",padding:"32px 0",color:"#1a2a40",fontFamily:"JetBrains Mono, monospace",fontSize:12}}>
            Fill problem details → get Socratic hint
          </div>
        )}
        {loading&&(
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"24px 0"}}>
            <div className="spin"/>
            <span style={{color:"#3a5a80",fontSize:12,fontFamily:"JetBrains Mono, monospace"}}>Generating level {lvl} hint…</span>
          </div>
        )}
        {hint&&<div className="air" dangerouslySetInnerHTML={{__html:renderMarkdown(hint)}}/>}
      </div></div>
    </div>
  );
}

function ConceptExplorer() {
  const [sel, setSel] = useState(null);
  const [exp, setExp] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async t => {
    setSel(t); setExp(""); setLoading(true);
    try { const r = await explainConcept(t.name, t.mastery); setExp(r); }
    catch { setExp("Failed to load."); }
    setLoading(false);
  };

  return (
    <div className="g2">
      <div className="hc"><div className="cb">
        <div className="ct" style={{marginBottom:14}}>TOPIC INDEX</div>
        <div style={{display:"flex",flexDirection:"column",gap:5,maxHeight:480,overflowY:"auto"}}>
          {DSA_TOPICS.map(t=>{
            const c=t.mastery<40?"#ff2244":t.mastery<60?"#ffaa00":t.mastery<80?"#00e5ff":"#00ff88";
            return (
              <button key={t.id} onClick={()=>load(t)} style={{
                display:"flex",alignItems:"center",gap:12,padding:"9px 12px",
                background:sel?.id===t.id?"rgba(0,245,255,.08)":"rgba(5,10,18,.7)",
                border:`1px solid ${sel?.id===t.id?"rgba(0,245,255,.3)":"rgba(0,245,255,.07)"}`,
                borderRadius:8,cursor:"pointer",textAlign:"left",width:"100%",
                fontFamily:"JetBrains Mono, monospace",transition:"all .15s"
              }}>
                <span style={{fontSize:16}}>{t.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:600,color:"#e8f4ff"}}>{t.name}</div>
                  <div style={{fontSize:9,color:"#3a5a80",marginTop:1}}>{t.problems} solved</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div className="pt" style={{width:50}}><div className="pf" style={{width:`${t.mastery}%`,background:c}}/></div>
                  <span style={{fontSize:10,color:c,width:28,textAlign:"right"}}>{t.mastery}%</span>
                </div>
              </button>
            );
          })}
        </div>
      </div></div>
      <div className="hc ac"><div className="cb">
        <div className="ct" style={{marginBottom:14}}>{sel?sel.name.toUpperCase():"SELECT TOPIC"}</div>
        {!sel&&<div style={{textAlign:"center",padding:"32px 0",color:"#1a2a40",fontFamily:"JetBrains Mono, monospace",fontSize:12}}>← Pick a topic for AI explanation</div>}
        {loading&&(
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"24px 0"}}>
            <div className="spin"/>
            <span style={{color:"#3a5a80",fontSize:12,fontFamily:"JetBrains Mono, monospace"}}>Generating personalized explanation…</span>
          </div>
        )}
        {exp&&(
          <div style={{maxHeight:480,overflowY:"auto"}}>
            <div className="air" dangerouslySetInnerHTML={{__html:renderMarkdown(exp)}}/>
          </div>
        )}
      </div></div>
    </div>
  );
}

export default function AITutor() {
  const [tab, setTab] = useState("chat");
  const [msgs, setMsgs] = useState([{
    role:"assistant",id:0,time:"NOW",
    content:"## NEXUS AI — Online\n\nI'm your personal competitive programming superintelligence. I've analyzed your profile: **1647 rating** (Expert) with critical gaps in **Segment Trees (31%)**, **DP on Trees (52%)**, and **Bit Manipulation (44%)**.\n\nAsk me anything — explanations, code review, contest strategy, hints. I adapt to your exact skill level."
  }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({behavior:"smooth"}); }, [msgs]);

  const send = async txt => {
    const msg = txt || input.trim();
    if(!msg) return;
    setInput("");
    const now = new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
    const uid = Date.now();
    setMsgs(p=>[...p,{role:"user",content:msg,time:now,id:uid},{role:"assistant",content:"",loading:true,time:"...",id:uid+1}]);
    setBusy(true);
    try {
      const r = await askAITutor(msg,{rating:1647,weakTopics:["Segment Trees","DP on Trees","Bit Manipulation"],phase:"Foundation Repair"});
      setMsgs(p=>p.map(m=>m.loading?{role:"assistant",content:r,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),id:m.id}:m));
    } catch {
      setMsgs(p=>p.map(m=>m.loading?{role:"assistant",content:"⚠ Connection error. Check API key.",time:"ERR",id:m.id}:m));
    }
    setBusy(false);
  };

  const TABS = [["chat","◈ Chat"],["concepts","📚 Concepts"],["hints","💡 Hints"]];

  return (
    <div className="page">
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:24}} className="s1">
        <div>
          <div className="ph-eye">ai superintelligence</div>
          <h1 className="ph-title">NEXUS <span className="c1">TUTOR</span></h1>
          <p className="ph-sub">Multi-agent AI mentor swarm — Socratic tutoring · Code review · Contest strategy</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:4,marginBottom:20,background:"rgba(5,10,18,.9)",padding:4,borderRadius:10,width:"fit-content",border:"1px solid rgba(0,245,255,.1)"}} className="s2">
        {TABS.map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} style={{
            padding:"7px 18px",borderRadius:8,border:"none",cursor:"pointer",
            background:tab===t?"rgba(0,245,255,.1)":"transparent",
            color:tab===t?"#00f5ff":"#3a5a80",
            fontSize:12,fontWeight:600,fontFamily:"JetBrains Mono, monospace",
            border:tab===t?"1px solid rgba(0,245,255,.25)":"1px solid transparent",
            textTransform:"uppercase",letterSpacing:".05em",transition:"all .15s"
          }}>{l}</button>
        ))}
      </div>

      {tab==="chat"&&(
        <div className="s3">
          <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:16}}>
            {QUICK.map((q,i)=>(
              <button key={i} className="btn btn-g btn-sm" onClick={()=>send(q.msg)} disabled={busy} style={{fontSize:11}}>
                {q.icon} {q.label}
              </button>
            ))}
          </div>
          <div className="hc ac">
            <div className="cb">
              <div style={{height:420,overflowY:"auto",padding:"4px 0"}}>
                {msgs.map(m=><Msg key={m.id} m={m}/>)}
                <div ref={bottomRef}/>
              </div>
              <div className="div"/>
              <div style={{display:"flex",gap:10,alignItems:"flex-end"}}>
                <textarea value={input} onChange={e=>setInput(e.target.value)}
                  onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
                  placeholder="Ask anything… Enter to send · Shift+Enter for newline"
                  rows={3} style={{resize:"none",flex:1,fontFamily:"JetBrains Mono, monospace",fontSize:12}} disabled={busy}/>
                <button className="btn btn-s" onClick={()=>send()} disabled={busy||!input.trim()} style={{flexShrink:0,height:44,minWidth:80}}>
                  {busy?<div className="spin"/>:"SEND ↑"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {tab==="concepts"&&<div className="s3"><ConceptExplorer/></div>}
      {tab==="hints"&&<div className="s3"><HintEngine disabled={busy}/></div>}
    </div>
  );
}
