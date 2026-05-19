import React, { useState } from "react";
import { AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import { RATING_HISTORY, RECENT_CONTESTS, DSA_TOPICS } from "../data/mockData";

const CT = ({ active, payload, label }) => active && payload?.length ? (
  <div style={{background:"rgba(0,0,10,.97)",border:"1px solid rgba(0,245,255,.22)",borderRadius:8,padding:"10px 14px",fontFamily:"JetBrains Mono, monospace"}}>
    <div style={{fontSize:10,color:"#3a5a80",marginBottom:4}}>{label}</div>
    {payload.map((p,i)=>(
      <div key={i} style={{fontSize:14,fontWeight:700,color:p.color,textShadow:`0 0 10px ${p.color}`}}>{p.name}: {p.value}</div>
    ))}
  </div>
) : null;

const TOPIC_DATA = DSA_TOPICS.map(t=>({name:t.name.split(" ")[0],solved:t.problems,mastery:t.mastery}));
const RADAR_DATA = [{s:"Arrays",A:88},{s:"DP",A:52},{s:"Graphs",A:67},{s:"Trees",A:74},{s:"SegTree",A:31},{s:"Greedy",A:79},{s:"Math",A:61},{s:"Binary",A:83}];
const WEEK_DATA  = [{d:"Mon",e:2,m:1,h:0},{d:"Tue",e:1,m:2,h:1},{d:"Wed",e:3,m:1,h:0},{d:"Thu",e:0,m:3,h:1},{d:"Fri",e:2,m:0,h:2},{d:"Sat",e:4,m:2,h:1},{d:"Sun",e:1,m:1,h:0}];
const PLATFORMS  = [{n:"Codeforces",v:187,c:"#00f5ff"},{n:"LeetCode",v:124,c:"#00ff88"},{n:"AtCoder",v:28,c:"#ffaa00"},{n:"HackerRank",v:8,c:"#bf00ff"}];

export default function Analytics({ onNavigate }) {
  const [range, setRange] = useState("all");
  const filtered = range==="1m"?RATING_HISTORY.slice(-2):range==="3m"?RATING_HISTORY.slice(-4):RATING_HISTORY;

  return (
    <div className="page">
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:28}} className="s1">
        <div>
          <div className="ph-eye">performance intelligence</div>
          <h1 className="ph-title">ANALYTICS <span className="c1">ENGINE</span></h1>
          <p className="ph-sub">Deep-dive performance metrics · predictive rating modeling · multi-platform intelligence</p>
        </div>
        <div style={{display:"flex",gap:6,marginTop:4}}>
          {["1m","3m","all"].map(r=>(
            <button key={r} onClick={()=>setRange(r)} className={`btn btn-sm ${range===r?"btn-s":"btn-g"}`}>
              {r==="all"?"ALL TIME":r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid s2">
        {[
          {v:"1647",      l:"CF Rating",    d:"↑444 total",           hot:"hc"},
          {v:"Top 4.4%",  l:"Global Rank",  d:"Best: top 3.5%",       hot:"hg"},
          {v:"74%",       l:"Accept Rate",  d:"↑6% vs last month",    hot:""},
          {v:"2.3h",      l:"Avg Solve",    d:"↓18min improved",      hot:""},
          {v:"28",        l:"Contests",     d:"Next: May 18",         hot:""},
        ].map((s,i)=>(
          <div key={i} className={`sm ${s.hot}`}>
            <div className="sm-v">{s.v}</div>
            <div className="sm-l">{s.l}</div>
            <div className="sm-d du">{s.d}</div>
          </div>
        ))}
      </div>

      {/* Row 1 */}
      <div className="g2 mb16 s3">
        <div className="hc ag">
          <div className="cb">
            <div className="ch"><div><div className="ct">Rating Trajectory</div><div className="cs">Codeforces performance history</div></div><span className="tag tg">+444</span></div>
            <ResponsiveContainer width="100%" height={185}>
              <AreaChart data={filtered} margin={{top:4,right:4,bottom:0,left:-22}}>
                <defs>
                  <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff88" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{fill:"#3a5a80",fontSize:10,fontFamily:"JetBrains Mono, monospace"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:"#3a5a80",fontSize:10}} axisLine={false} tickLine={false} domain={["dataMin-80","dataMax+80"]}/>
                <Tooltip content={<CT/>}/>
                <Area type="monotone" dataKey="rating" stroke="#00ff88" strokeWidth={2.5} fill="url(#ag)"
                  dot={{fill:"#00ff88",r:3,strokeWidth:0}} activeDot={{r:6,fill:"#00f5ff",strokeWidth:0}} name="Rating"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="hc ac">
          <div className="cb">
            <div className="ch"><div><div className="ct">Skill Radar</div><div className="cs">8-axis mastery overview</div></div></div>
            <ResponsiveContainer width="100%" height={185}>
              <RadarChart data={RADAR_DATA} margin={{top:8,right:28,bottom:0,left:28}}>
                <PolarGrid stroke="rgba(0,245,255,.07)"/>
                <PolarAngleAxis dataKey="s" tick={{fill:"#3a5a80",fontSize:9,fontFamily:"JetBrains Mono, monospace"}}/>
                <Radar name="Mastery" dataKey="A" stroke="#00f5ff" fill="#00f5ff" fillOpacity={0.12} strokeWidth={2} dot={{fill:"#00f5ff",r:3}}/>
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="g2 mb16 s4">
        <div className="hc">
          <div className="cb">
            <div className="ch"><div><div className="ct">Weekly Volume</div><div className="cs">Solve count by difficulty</div></div></div>
            <ResponsiveContainer width="100%" height={165}>
              <BarChart data={WEEK_DATA} margin={{top:4,right:4,bottom:0,left:-22}}>
                <XAxis dataKey="d" tick={{fill:"#3a5a80",fontSize:11,fontFamily:"JetBrains Mono, monospace"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:"#3a5a80",fontSize:10}} axisLine={false} tickLine={false}/>
                <Tooltip content={<CT/>}/>
                <Bar dataKey="e" stackId="a" fill="#00ff88" name="Easy"/>
                <Bar dataKey="m" stackId="a" fill="#ffaa00" name="Medium"/>
                <Bar dataKey="h" stackId="a" fill="#ff2244" name="Hard" radius={[4,4,0,0]}/>
                <Legend wrapperStyle={{fontSize:10,color:"#3a5a80",fontFamily:"JetBrains Mono, monospace"}}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="hc">
          <div className="cb">
            <div className="ch"><div><div className="ct">By Topic</div><div className="cs">Problem distribution</div></div></div>
            <ResponsiveContainer width="100%" height={165}>
              <BarChart data={TOPIC_DATA} layout="vertical" margin={{top:0,right:18,bottom:0,left:30}}>
                <XAxis type="number" tick={{fill:"#3a5a80",fontSize:9}} axisLine={false} tickLine={false}/>
                <YAxis type="category" dataKey="name" tick={{fill:"#7aa0c8",fontSize:10,fontFamily:"JetBrains Mono, monospace"}} axisLine={false} tickLine={false} width={50}/>
                <Tooltip content={<CT/>}/>
                <Bar dataKey="solved" radius={[0,4,4,0]} name="Solved">
                  {TOPIC_DATA.map((e,i)=>(
                    <Cell key={i} fill={e.mastery<60?"#ffaa00":e.mastery<80?"#00f5ff":"#00ff88"}/>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3 */}
      <div className="g2 mb16 s5">
        <div className="hc">
          <div className="cb">
            <div className="ch"><div><div className="ct">Platform Breakdown</div><div className="cs">Multi-platform presence</div></div></div>
            <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:16}}>
              {PLATFORMS.map(p=>(
                <div key={p.n}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                    <span style={{fontSize:12,fontWeight:500,color:"#e8f4ff"}}>{p.n}</span>
                    <span style={{fontFamily:"JetBrains Mono,monospace",fontSize:11,color:p.c,fontWeight:700}}>{p.v}</span>
                  </div>
                  <div className="pt8"><div className="pf8" style={{width:`${(p.v/347)*100}%`,background:p.c,boxShadow:`0 0 8px ${p.c}66`}}/></div>
                </div>
              ))}
            </div>
            <div className="div"/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[{l:"CF Rating",v:"1647"},{l:"LC Rank",v:"~85k"},{l:"AtCoder",v:"712"},{l:"Total",v:"347"}].map((s,i)=>(
                <div key={i} style={{background:"rgba(5,10,18,.85)",borderRadius:10,padding:"10px 12px",border:"1px solid rgba(0,245,255,.07)"}}>
                  <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:16,fontWeight:700,color:"#e8f4ff"}}>{s.v}</div>
                  <div style={{fontSize:10,color:"#3a5a80",marginTop:2,fontFamily:"JetBrains Mono,monospace"}}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hc">
          <div className="cb">
            <div className="ch"><div><div className="ct">Contest Deltas</div><div className="cs">Rating change per round</div></div></div>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={RECENT_CONTESTS.map(c=>({name:c.name.replace("Codeforces Round ","CF ").replace("Educational Round ","EDU ").replace("Div.2 Round ","D2 "),delta:c.delta}))}
                margin={{top:4,right:4,bottom:0,left:-10}}>
                <XAxis dataKey="name" tick={{fill:"#3a5a80",fontSize:9,fontFamily:"JetBrains Mono, monospace"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:"#3a5a80",fontSize:9}} axisLine={false} tickLine={false}/>
                <Tooltip content={<CT/>}/>
                <Bar dataKey="delta" radius={[4,4,0,0]} name="Delta">
                  {RECENT_CONTESTS.map((c,i)=><Cell key={i} fill={c.delta>0?"#00ff88":"#ff2244"}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="div"/>
            {RECENT_CONTESTS.map((c,i)=>(
              <div key={i} style={{
                display:"flex",alignItems:"center",gap:10,padding:"9px 12px",
                background:"rgba(5,10,18,.8)",borderRadius:8,marginBottom:6,
                borderLeft:`3px solid ${c.delta>0?"#00ff88":"#ff2244"}`,
                border:`1px solid ${c.delta>0?"rgba(0,255,136,.12)":"rgba(255,34,68,.12)"}`
              }}>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:600,color:"#e8f4ff"}}>{c.name}</div>
                  <div style={{fontSize:9,color:"#3a5a80",fontFamily:"JetBrains Mono,monospace"}}>{c.date} · #{c.rank.toLocaleString()}</div>
                </div>
                <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:14,fontWeight:800,color:c.delta>0?"#00ff88":"#ff2244",textShadow:`0 0 10px ${c.delta>0?"#00ff88":"#ff2244"}`}}>
                  {c.delta>0?"+":""}{c.delta}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI prediction block */}
      <div className="hc ag s6" style={{border:"1px solid rgba(0,255,136,.2)",boxShadow:"0 0 40px rgba(0,255,136,.05)"}}>
        <div className="cb">
          <div className="ch">
            <div>
              <div className="ct" style={{color:"#00ff88",textShadow:"0 0 15px rgba(0,255,136,.4)"}}>◈ AI RATING PREDICTION</div>
              <div className="cs">LSTM model · 50k+ contest records · transformer-based trajectory forecasting</div>
            </div>
            <span className="tag tg">87% CONFIDENCE</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:12}}>
            {[
              {l:"Next contest delta",    v:"+38 → +61",     c:"#00ff88"},
              {l:"Projected (3 months)", v:"1820–1890",      c:"#00f5ff"},
              {l:"Target tier",          v:"Cand. Master",   c:"#ffaa00"},
              {l:"Critical unlock",      v:"Segment Trees",  c:"#ff2244"},
            ].map((p,i)=>(
              <div key={i} style={{background:"rgba(5,10,18,.85)",borderRadius:12,padding:"14px 16px",border:"1px solid rgba(0,245,255,.07)"}}>
                <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:16,fontWeight:700,color:p.c,textShadow:`0 0 12px ${p.c}66`}}>{p.v}</div>
                <div style={{fontSize:10,color:"#3a5a80",marginTop:5,fontFamily:"JetBrains Mono,monospace"}}>{p.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
