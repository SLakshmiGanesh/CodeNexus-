import React, { useState, useEffect, useRef } from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { USER_PROFILE, COGNITIVE_PROFILE, NEURAL_PREDICTIONS, AGENT_SWARM, DSA_TOPICS } from "../data/mockData";
import { askAITutor } from "../services/aiService";
import { renderMarkdown } from "../utils/markdown";

function CogMeter({ label, val, color, icon }) {
  const [w, setW] = useState(0);
  useEffect(() => { const id = setTimeout(() => setW(val), 200); return () => clearTimeout(id); }, [val]);
  return (
    <div style={{marginBottom:14}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
        <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,fontFamily:"JetBrains Mono, monospace",color:"#7aa0c8"}}>
          <span>{icon}</span>{label}
        </div>
        <span style={{fontFamily:"JetBrains Mono, monospace",fontSize:11,color,fontWeight:700}}>{val}%</span>
      </div>
      <div className="pt8"><div className="pf8" style={{width:`${w}%`,background:color,boxShadow:`0 0 8px ${color}`,transition:"width 1s cubic-bezier(.4,0,.2,1)"}}/></div>
    </div>
  );
}

const RADAR_DATA = DSA_TOPICS.slice(0,8).map(t=>({subject:t.name.split(" ")[0],val:t.mastery}));

function NeuralCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;
    const nodes = Array.from({length:28},(_,i)=>({
      x:Math.random()*W, y:Math.random()*H,
      vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.3,
      r:Math.random()*3+1, active:Math.random()>.7
    }));
    let af;
    const draw = () => {
      ctx.clearRect(0,0,W,H);
      nodes.forEach(n=>{
        n.x+=n.vx; n.y+=n.vy;
        if(n.x<0||n.x>W) n.vx*=-1;
        if(n.y<0||n.y>H) n.vy*=-1;
      });
      nodes.forEach((a,i)=>{
        nodes.forEach((b,j)=>{
          if(j<=i) return;
          const dx=a.x-b.x, dy=a.y-b.y, dist=Math.sqrt(dx*dx+dy*dy);
          if(dist<120){
            ctx.beginPath();
            ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
            const alpha=(1-dist/120)*0.15;
            ctx.strokeStyle=`rgba(0,245,255,${alpha})`;
            ctx.lineWidth=.5; ctx.stroke();
          }
        });
        ctx.beginPath();
        ctx.arc(a.x,a.y,a.r,0,Math.PI*2);
        ctx.fillStyle=a.active?"rgba(0,255,136,0.8)":"rgba(0,245,255,0.5)";
        ctx.shadowBlur=a.active?15:6;
        ctx.shadowColor=a.active?"#00ff88":"#00f5ff";
        ctx.fill();
        ctx.shadowBlur=0;
      });
      af=requestAnimationFrame(draw);
    };
    draw();
    return()=>cancelAnimationFrame(af);
  },[]);
  return <canvas ref={canvasRef} style={{width:"100%",height:"100%",display:"block"}}/>;
}

export default function NeuralTwin({ onNavigate }) {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeAgent, setActiveAgent] = useState(null);

  const getInsight = async () => {
    setLoading(true); setInsight("");
    try {
      const txt = await askAITutor(
        `Analyze this programmer's cognitive profile and give a 3-paragraph strategic insight:\n- Rating: ${USER_PROFILE.rating}\n- Weak topics: Segment Trees (31%), DP (52%), Bit Manipulation (44%)\n- Error tendencies: off-by-one, wrong base case, integer overflow\n- Strong patterns: sliding window, two pointers, BFS\n- Thinking speed: 72/100\n- Stress under contest: 68/100\n\nGive actionable AI-grade analysis of their cognitive programming DNA and what to fix first.`,
        {}
      );
      setInsight(txt);
    } catch { setInsight("AI insight unavailable — check API connection."); }
    setLoading(false);
  };

  const CP = COGNITIVE_PROFILE;
  return (
    <div className="page">
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:28}} className="s1">
        <div>
          <div className="ph-eye">cognitive modeling</div>
          <h1 className="ph-title">NEURAL <span className="c2">TWIN</span></h1>
          <p className="ph-sub">AI model of your cognitive programming DNA — continuously evolving with every interaction</p>
        </div>
        <div style={{display:"flex",gap:8,flexShrink:0,marginTop:4}}>
          <button className="btn btn-p btn-sm" onClick={getInsight} disabled={loading}>
            {loading?<><div className="spin"/>Analyzing...</>:"◈ Get AI Insight"}
          </button>
        </div>
      </div>

      {/* Neural canvas + cognitive meters */}
      <div className="g23 mb16 s2">
        {/* Neural network viz */}
        <div className="hc ac" style={{height:320}}>
          <div className="cb" style={{height:"100%"}}>
            <div className="ch">
              <div><div className="ct">Neural Activity Map</div><div className="cs">Real-time cognitive graph simulation</div></div>
              <span className="tag tc">LIVE</span>
            </div>
            <div style={{height:220,borderRadius:8,overflow:"hidden",background:"rgba(0,0,10,.6)",border:"1px solid rgba(0,245,255,.07)"}}>
              <NeuralCanvas/>
            </div>
          </div>
        </div>

        {/* Cognitive meters */}
        <div className="hc">
          <div className="cb">
            <div className="ch">
              <div><div className="ct">Cognitive State</div><div className="cs">Real-time mental load analysis</div></div>
              <span className="tag tg">Active</span>
            </div>
            <CogMeter label="Focus Score" val={CP.focusScore} color="#00f5ff" icon="◎"/>
            <CogMeter label="Confidence Index" val={CP.confidenceIndex} color="#00ff88" icon="▲"/>
            <CogMeter label="Thinking Speed" val={CP.thinkingSpeed} color="#bf00ff" icon="⚡"/>
            <CogMeter label="Cognitive Load" val={CP.cognitiveLoad} color="#ffaa00" icon="⊞"/>
            <CogMeter label="Fatigue Level" val={CP.fatigueLevel} color="#ff2244" icon="↓"/>
            <div style={{marginTop:14,padding:"10px 12px",borderRadius:8,background:"rgba(0,255,136,.04)",border:"1px solid rgba(0,255,136,.12)"}}>
              <div style={{fontSize:10,fontFamily:"JetBrains Mono, monospace",color:"#00ff88",marginBottom:4}}>◉ FLOW STATE: {CP.flowState?"ACTIVE":"NOT DETECTED"}</div>
              <div style={{fontSize:11,color:"#3a5a80"}}>Current mood signature: <span style={{color:"#00f5ff",fontStyle:"italic"}}>{CP.currentMood}</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="g2 mb16 s3">
        {/* Skill radar */}
        <div className="hc">
          <div className="cb">
            <div className="ch"><div><div className="ct">Performance DNA</div><div className="cs">8-axis cognitive skill map</div></div></div>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={RADAR_DATA} margin={{top:10,right:30,bottom:0,left:30}}>
                <PolarGrid stroke="rgba(0,245,255,.07)"/>
                <PolarAngleAxis dataKey="subject" tick={{fill:"#3a5a80",fontSize:9,fontFamily:"JetBrains Mono, monospace"}}/>
                <Radar name="Mastery" dataKey="val" stroke="#00f5ff" fill="#00f5ff" fillOpacity={0.12} strokeWidth={2} dot={{fill:"#00f5ff",r:3}}/>
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Predictions */}
        <div className="hc ar">
          <div className="cb">
            <div className="ch">
              <div><div className="ct">Predictive Intelligence</div><div className="cs">AI forecasts your forgetting curve</div></div>
              <span className="tag tr">Alerts</span>
            </div>
            {NEURAL_PREDICTIONS.map((p,i)=>(
              <div key={i} style={{
                padding:"12px 14px",borderRadius:10,marginBottom:8,
                background:"rgba(5,10,18,.8)",
                border:`1px solid ${i===0?"rgba(255,34,68,.2)":"rgba(255,170,0,.12)"}`,
                borderLeft:`3px solid ${i===0?"#ff2244":"#ffaa00"}`
              }}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontFamily:"JetBrains Mono, monospace",fontSize:12,fontWeight:700,color:"#e8f4ff"}}>{p.topic}</span>
                  <span className={`tag ${i===0?"tr":"ta"}`}>{p.action}</span>
                </div>
                <div style={{fontSize:11,color:"#3a5a80",marginBottom:6}}>Forgetting in: <span style={{color:i===0?"#ff2244":"#ffaa00",fontWeight:700}}>{p.forgettingIn}</span></div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div className="pt" style={{flex:1}}><div className="pf" style={{width:`${p.confidence}%`,background:i===0?"#ff2244":"#ffaa00"}}/></div>
                  <span style={{fontSize:10,fontFamily:"JetBrains Mono, monospace",color:"#3a5a80"}}>{p.confidence}% conf</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent swarm */}
      <div className="hc mb16 s4">
        <div className="cb">
          <div className="ch">
            <div><div className="ct">AI Agent Swarm</div><div className="cs">Multi-agent intelligence network — agents debate before answering</div></div>
            <span className="tag tc">6 AGENTS</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:10}}>
            {AGENT_SWARM.map(a=>(
              <div key={a.id} onClick={()=>setActiveAgent(activeAgent===a.id?null:a.id)} style={{
                padding:"14px 16px",borderRadius:12,cursor:"pointer",
                background:activeAgent===a.id?`${a.color}0f`:"rgba(5,10,18,.8)",
                border:`1px solid ${activeAgent===a.id?a.color+"44":a.status==="active"?a.color+"22":"rgba(0,245,255,.07)"}`,
                boxShadow:a.status==="active"?`0 0 20px ${a.color}18`:"",
                transition:"all .2s"
              }}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                  <span style={{fontSize:22,color:a.color,textShadow:`0 0 12px ${a.color}`}}>{a.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"JetBrains Mono, monospace",fontSize:12,fontWeight:700,color:a.status==="active"?a.color:"#7aa0c8"}}>{a.name}</div>
                    <div style={{fontSize:9,color:"#3a5a80",textTransform:"uppercase",letterSpacing:".08em",fontFamily:"JetBrains Mono, monospace",marginTop:1}}>
                      {a.status==="active"?"● ACTIVE":"○ STANDBY"}
                    </div>
                  </div>
                  {a.status==="active"&&<div style={{width:8,height:8,borderRadius:"50%",background:a.color,boxShadow:`0 0 10px ${a.color}`}}/>}
                </div>
                <div style={{fontSize:11,color:"#3a5a80"}}>{a.specialty}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insight */}
      <div className="hc ap s5">
        <div className="cb">
          <div className="ch">
            <div><div className="ct">AI Cognitive Insight</div><div className="cs">Claude-powered analysis of your programming DNA</div></div>
            <button className="btn btn-p btn-sm" onClick={getInsight} disabled={loading}>
              {loading?<><div className="spin"/>...</>:"Generate →"}
            </button>
          </div>
          {!insight && !loading && (
            <div style={{textAlign:"center",padding:"32px 0",color:"#1a2a40",fontFamily:"JetBrains Mono, monospace",fontSize:13}}>
              Click "Generate" to get an AI analysis of your cognitive profile
            </div>
          )}
          {loading && (
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"24px 0"}}>
              <div className="spin"/>
              <span style={{color:"#3a5a80",fontSize:13,fontFamily:"JetBrains Mono, monospace"}}>
                Agents collaborating · Analyzing cognitive DNA · Building insight…
              </span>
            </div>
          )}
          {insight && <div className="air" dangerouslySetInnerHTML={{__html:renderMarkdown(insight)}}/>}
        </div>
      </div>

      {/* Error tendencies + stress profile */}
      <div className="g2 s6" style={{marginTop:16}}>
        <div className="hc ar">
          <div className="cb">
            <div className="ch"><div><div className="ct">Error Tendency Profile</div><div className="cs">AI-identified bug patterns</div></div></div>
            {CP.errorTendency.map((e,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:8,background:"rgba(255,34,68,.04)",border:"1px solid rgba(255,34,68,.1)",marginBottom:6}}>
                <span style={{color:"#ff2244",fontSize:14}}>◉</span>
                <span style={{fontFamily:"JetBrains Mono, monospace",fontSize:11,color:"#e8f4ff"}}>{e}</span>
              </div>
            ))}
            <div style={{marginTop:12}}>
              <div style={{fontFamily:"JetBrains Mono, monospace",fontSize:10,color:"#3a5a80",marginBottom:8,textTransform:"uppercase",letterSpacing:".1em"}}>Stress Response Profile</div>
              {Object.entries(CP.stressProfile).map(([k,v])=>(
                <div key={k} style={{marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontFamily:"JetBrains Mono, monospace",fontSize:10,color:"#7aa0c8",textTransform:"capitalize"}}>{k}</span>
                    <span style={{fontFamily:"JetBrains Mono, monospace",fontSize:10,color:v>70?"#ff2244":"#ffaa00"}}>{v}%</span>
                  </div>
                  <div className="pt"><div className="pf" style={{width:`${v}%`,background:v>70?"#ff2244":"#ffaa00"}}/></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="hc ag">
          <div className="cb">
            <div className="ch"><div><div className="ct">Strong Patterns</div><div className="cs">Mastered cognitive frameworks</div></div></div>
            {CP.strongPatterns.map((p,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:8,background:"rgba(0,255,136,.04)",border:"1px solid rgba(0,255,136,.1)",marginBottom:6}}>
                <span style={{color:"#00ff88",fontSize:14}}>✓</span>
                <span style={{fontFamily:"JetBrains Mono, monospace",fontSize:11,color:"#e8f4ff"}}>{p}</span>
              </div>
            ))}
            <div style={{marginTop:12}}>
              <div style={{fontFamily:"JetBrains Mono, monospace",fontSize:10,color:"#3a5a80",marginBottom:8,textTransform:"uppercase",letterSpacing:".1em"}}>Memory Retention Curve</div>
              <div style={{display:"flex",alignItems:"flex-end",gap:4,height:48}}>
                {CP.retentionCurve.map((v,i)=>(
                  <div key={i} style={{flex:1,background:`rgba(0,255,136,${v/100*.8})`,borderRadius:"2px 2px 0 0",height:`${v}%`,boxShadow:`0 0 6px rgba(0,255,136,${v/100*.4})`}} title={`Day ${i+1}: ${v}%`}/>
                ))}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                <span style={{fontSize:9,color:"#3a5a80",fontFamily:"JetBrains Mono, monospace"}}>Day 1</span>
                <span style={{fontSize:9,color:"#3a5a80",fontFamily:"JetBrains Mono, monospace"}}>Day 8</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
