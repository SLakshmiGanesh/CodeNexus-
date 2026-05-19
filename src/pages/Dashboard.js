import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { USER_PROFILE, DSA_TOPICS, RATING_HISTORY, RECENT_CONTESTS, DAILY_PLAN, ACHIEVEMENTS, HEATMAP_DATA, AGENT_SWARM } from "../data/mockData";

const CT = ({ active, payload, label }) => active && payload?.length ? (
  <div style={{background:"rgba(0,0,10,.97)",border:"1px solid rgba(0,245,255,.25)",borderRadius:8,padding:"10px 14px",fontFamily:"JetBrains Mono, monospace"}}>
    <div style={{fontSize:10,color:"#3a5a80",marginBottom:4}}>{label}</div>
    <div style={{fontSize:16,fontWeight:700,color:"#00f5ff",textShadow:"0 0 10px rgba(0,245,255,.5)"}}>{payload[0].value}</div>
  </div>
) : null;

function NeuralMastery({ t, i }) {
  const [w, setW] = useState(0);
  useEffect(() => { const id = setTimeout(() => setW(t.mastery), 100 + i*80); return () => clearTimeout(id); }, [t.mastery, i]);
  const cls = t.mastery<40?"mc-crit":t.mastery<60?"mc-low":t.mastery<80?"mc-mid":"mc-high";
  const col = t.mastery<40?"#ff2244":t.mastery<60?"#ffaa00":t.mastery<80?"#00e5ff":"#00ff88";
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
      <span style={{fontSize:15,width:20,textAlign:"center"}}>{t.icon}</span>
      <div style={{width:116,fontSize:11.5,color:t.mastery<60?"#ffaa00":"#7aa0c8",fontWeight:t.mastery<55?700:400,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",fontFamily:"JetBrains Mono, monospace"}}>{t.name}</div>
      <div className="pt" style={{flex:1}}><div className={`pf ${cls}`} style={{width:`${w}%`}}/></div>
      <span style={{fontFamily:"JetBrains Mono, monospace",fontSize:10,color:col,width:30,textAlign:"right"}}>{t.mastery}%</span>
    </div>
  );
}

function HeatCell({ v }) {
  const bg = v===0?"rgba(0,245,255,.04)":v===1?"rgba(0,245,255,.15)":v===2?"rgba(0,245,255,.3)":v===3?"rgba(0,255,136,.4)":"rgba(0,255,136,.75)";
  return <div style={{width:11,height:11,borderRadius:2,background:bg,cursor:"default",transition:"background .2s",boxShadow:v>=4?"0 0 6px rgba(0,255,136,.5)":""}} title={`${v} solved`}/>;
}

export default function Dashboard({ onNavigate }) {
  const done = DAILY_PLAN.filter(t=>t.done).length;
  const weakTop = [...DSA_TOPICS].sort((a,b)=>a.mastery-b.mastery).slice(0,6);
  const tCol = {practice:"#7c6ff7",study:"#00f5ff",ai:"#00ff88",revision:"#ffaa00",contest:"#ff2244"};

  return (
    <div className="page">
      {/* Header */}
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:28}} className="s1">
        <div>
          <div className="ph-eye">command center</div>
          <h1 className="ph-title">NEXUS <span className="c1">DASHBOARD</span></h1>
          <p className="ph-sub">Good morning, {USER_PROFILE.name.split(" ")[0]} — AI systems nominal · {USER_PROFILE.streak} streak · {6-done} ops remaining</p>
        </div>
        <div style={{display:"flex",gap:8,flexShrink:0,marginTop:4}}>
          <button className="btn btn-g btn-sm" onClick={()=>onNavigate("weakness")}>◎ Analyze</button>
          <button className="btn btn-p btn-sm" onClick={()=>onNavigate("neural")}>◉ Neural Twin</button>
          <button className="btn btn-s btn-sm" onClick={()=>onNavigate("tutor")}>◈ Ask AI</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid s2">
        {[
          {v:USER_PROFILE.rating,l:"CF Rating",d:"↑47 last round",cls:"hc",icon:"⭐"},
          {v:USER_PROFILE.totalSolved,l:"Problems",d:"↑12 this week",cls:"hg",icon:"✓"},
          {v:USER_PROFILE.contestsParticipated,l:"Contests",d:"Top 4.4% global",cls:"",icon:"🏆"},
          {v:`${done}/${DAILY_PLAN.length}`,l:"Today's Ops",d:`${DAILY_PLAN.length-done} remaining`,cls:"",icon:"◉"},
          {v:"52%",l:"DP Mastery",d:"⚠ Critical gap",cls:"",icon:"⚠"},
        ].map((s,i)=>(
          <div key={i} className={`sm ${s.cls}`}>
            <span style={{fontSize:17,marginBottom:8,display:"block"}}>{s.icon}</span>
            <div className="sm-v">{s.v}</div>
            <div className="sm-l">{s.l}</div>
            <div className={`sm-d ${i<3?"du":i===3?"dn":"dd"}`}>{s.d}</div>
          </div>
        ))}
      </div>

      {/* Agent status */}
      <div className="hc ac mb16 s3" style={{marginBottom:16}}>
        <div className="cb">
          <div className="ch">
            <div><div className="ct">AI Agent Swarm</div><div className="cs">6 specialized agents — 2 active</div></div>
            <span className="tag tc">LIVE</span>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {AGENT_SWARM.map(a=>(
              <div key={a.id} style={{
                display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderRadius:8,
                background:"rgba(5,10,18,.8)",border:`1px solid ${a.status==="active"?a.color+"33":"rgba(0,245,255,.07)"}`,
                boxShadow:a.status==="active"?`0 0 15px ${a.color}22`:"",
                transition:"all .2s"
              }}>
                <span style={{color:a.color,textShadow:`0 0 8px ${a.color}`,fontSize:15}}>{a.icon}</span>
                <div>
                  <div style={{fontSize:11,fontWeight:600,color:a.status==="active"?a.color:"#7aa0c8",fontFamily:"JetBrains Mono, monospace"}}>{a.name}</div>
                  <div style={{fontSize:9,color:"#3a5a80",fontFamily:"JetBrains Mono, monospace",textTransform:"uppercase",letterSpacing:".08em"}}>{a.status}</div>
                </div>
                {a.status==="active"&&<div style={{width:6,height:6,borderRadius:"50%",background:a.color,boxShadow:`0 0 8px ${a.color}`,animation:"blink 1.5s ease-in-out infinite"}}/>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="g2 mb16 s4">
        {/* Rating */}
        <div className="hc ag">
          <div className="cb">
            <div className="ch">
              <div><div className="ct">Rating Trajectory</div><div className="cs">Codeforces · 9mo history</div></div>
              <span className="tag tg">+444 pts</span>
            </div>
            <ResponsiveContainer width="100%" height={170}>
              <AreaChart data={RATING_HISTORY} margin={{top:4,right:4,bottom:0,left:-22}}>
                <defs>
                  <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff88" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{fill:"#3a5a80",fontSize:10,fontFamily:"JetBrains Mono, monospace"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:"#3a5a80",fontSize:10}} axisLine={false} tickLine={false} domain={["dataMin-80","dataMax+80"]}/>
                <Tooltip content={<CT/>}/>
                <Area type="monotone" dataKey="rating" stroke="#00ff88" strokeWidth={2.5} fill="url(#rg)"
                  dot={{fill:"#00ff88",r:3,strokeWidth:0}} activeDot={{r:6,fill:"#00f5ff",strokeWidth:0}}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily ops */}
        <div className="hc ac">
          <div className="cb">
            <div className="ch">
              <div><div className="ct">Daily Operations</div><div className="cs">AI-generated mission briefing</div></div>
              <span style={{fontFamily:"JetBrains Mono, monospace",fontSize:12,color:"#00ff88",fontWeight:700}}>{done}/{DAILY_PLAN.length}</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {DAILY_PLAN.map((t,i)=>(
                <div key={i} style={{
                  display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:8,
                  background:t.done?"rgba(0,255,136,.04)":"rgba(5,10,18,.8)",
                  border:`1px solid ${t.done?"rgba(0,255,136,.12)":"rgba(0,245,255,.07)"}`,
                  opacity:t.done?.6:1,transition:"opacity .2s"
                }}>
                  <span style={{fontSize:14,color:t.done?"#00ff88":"#1a2a40",fontFamily:"JetBrains Mono, monospace"}}>{t.done?"✓":"○"}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,color:t.done?"#3a5a80":"#e8f4ff",textDecoration:t.done?"line-through":"none"}}>{t.task}</div>
                    <div style={{fontSize:9,color:"#1a2a40",marginTop:1,fontFamily:"JetBrains Mono, monospace"}}>{t.time}</div>
                  </div>
                  <div style={{width:6,height:6,borderRadius:"50%",flexShrink:0,background:tCol[t.type],boxShadow:t.done?`0 0 8px ${tCol[t.type]}`:""}}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="g2 mb16 s5">
        {/* Mastery */}
        <div className="hc">
          <div className="cb">
            <div className="ch">
              <div><div className="ct">Topic Mastery Map</div><div className="cs">Root-cause weakness analysis</div></div>
              <button className="btn btn-g btn-xs" onClick={()=>onNavigate("weakness")}>Full map →</button>
            </div>
            {weakTop.map((t,i)=><NeuralMastery key={t.id} t={t} i={i}/>)}
            <div style={{display:"flex",gap:12,marginTop:14,flexWrap:"wrap"}}>
              {[["#ff2244","Critical"],["#ffaa00","Weak"],["#00e5ff","Mid"],["#00ff88","Strong"]].map(([c,l])=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:"#3a5a80",fontFamily:"JetBrains Mono, monospace"}}>
                  <div style={{width:8,height:8,borderRadius:2,background:c,boxShadow:`0 0 6px ${c}`}}/>{l}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contests */}
        <div className="hc">
          <div className="cb">
            <div className="ch">
              <div><div className="ct">Contest History</div><div className="cs">Recent performance</div></div>
              <button className="btn btn-g btn-xs" onClick={()=>onNavigate("analytics")}>Analytics →</button>
            </div>
            {RECENT_CONTESTS.map((c,i)=>(
              <div key={i} style={{
                display:"flex",alignItems:"center",gap:12,padding:"12px 14px",
                background:"rgba(5,10,18,.8)",borderRadius:10,marginBottom:8,
                border:`1px solid ${c.delta>0?"rgba(0,255,136,.12)":"rgba(255,34,68,.12)"}`,
                borderLeft:`3px solid ${c.delta>0?"#00ff88":"#ff2244"}`
              }}>
                <div style={{flex:1}}>
                  <div style={{fontSize:12.5,fontWeight:600,color:"#e8f4ff"}}>{c.name}</div>
                  <div style={{fontSize:10,color:"#3a5a80",fontFamily:"JetBrains Mono, monospace",marginTop:2}}>{c.date} · #{c.rank.toLocaleString()}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:16,fontWeight:700,fontFamily:"JetBrains Mono, monospace",color:c.delta>0?"#00ff88":"#ff2244",textShadow:`0 0 10px ${c.delta>0?"#00ff88":"#ff2244"}`}}>
                    {c.delta>0?"+":""}{c.delta}
                  </div>
                  <div style={{fontSize:9,color:"#3a5a80",fontFamily:"JetBrains Mono, monospace"}}>{c.solved} solved</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="hc mb16 s6">
        <div className="cb">
          <div className="ch">
            <div><div className="ct">Activity Matrix</div><div className="cs">52-week solve heatmap</div></div>
            <span className="tag tg">347 problems</span>
          </div>
          <div style={{display:"flex",gap:3,overflowX:"auto",paddingBottom:6}}>
            {HEATMAP_DATA.map((wk,wi)=>(
              <div key={wi} style={{display:"flex",flexDirection:"column",gap:3}}>
                {wk.map((v,di)=><HeatCell key={di} v={v}/>)}
              </div>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,marginTop:12,justifyContent:"flex-end"}}>
            <span style={{fontSize:9,color:"#3a5a80",fontFamily:"JetBrains Mono, monospace"}}>Less</span>
            {[0,1,2,3,4].map(v=><HeatCell key={v} v={v}/>)}
            <span style={{fontSize:9,color:"#3a5a80",fontFamily:"JetBrains Mono, monospace"}}>More</span>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="hc">
        <div className="cb">
          <div className="ch">
            <div><div className="ct">Achievement System</div><div className="cs">{ACHIEVEMENTS.filter(a=>a.earned).length}/{ACHIEVEMENTS.length} unlocked</div></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(168px,1fr))",gap:10}}>
            {ACHIEVEMENTS.map(a=>(
              <div key={a.id} style={{
                padding:"14px",borderRadius:12,position:"relative",overflow:"hidden",
                background:a.earned?"rgba(0,245,255,.04)":"rgba(5,10,18,.8)",
                border:`1px solid ${a.earned?"rgba(0,245,255,.18)":"rgba(0,245,255,.06)"}`,
                opacity:a.earned?1:.45,transition:"all .2s"
              }}>
                {a.earned&&<div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,#00f5ff,transparent)"}}/>}
                <div style={{fontSize:26,marginBottom:8}}>{a.icon}</div>
                <div style={{fontFamily:"JetBrains Mono, monospace",fontSize:12,fontWeight:700,color:a.earned?"#00f5ff":"#7aa0c8"}}>{a.name}</div>
                <div style={{fontSize:10,color:"#3a5a80",marginTop:3}}>{a.desc}</div>
                {!a.earned&&a.progress!==undefined&&(
                  <div style={{marginTop:10}}>
                    <div className="pt8"><div className="pf8 mc-mid" style={{width:`${Math.min((a.progress/(a.id==="a8"?2100:30))*100,100)}%`}}/></div>
                    <div style={{fontSize:9,color:"#3a5a80",marginTop:3,fontFamily:"JetBrains Mono, monospace"}}>{a.progress}{a.id==="a8"?"/2100":"/30"}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
