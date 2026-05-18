import React, { useState, useRef, useEffect } from "react";
import { askAITutor, explainConcept, generateHint } from "../services/aiService";
import { renderMarkdown } from "../utils/markdown";
import { DSA_TOPICS, WEAK_TOPICS } from "../data/mockData";

const QUICK_PROMPTS = [
  { label: "Explain Segment Trees", msg: "Explain segment trees from scratch. I know prefix sums but struggle with range updates.", icon: "📊" },
  { label: "DP on Trees intuition", msg: "Give me the intuition for DP on trees. Why do we do rerooting? Show an example.", icon: "🌲" },
  { label: "Hint: Range Sum Query", msg: "I'm stuck on the Range Sum Query - Mutable problem (LeetCode 307). Give me a level-1 hint.", icon: "💡" },
  { label: "Review my code", msg: "Can you review my segment tree implementation?\n```cpp\nclass SegTree {\n  vector<int> tree;\n  int n;\npublic:\n  SegTree(int n) : n(n), tree(2*n) {}\n  void update(int i, int v) {\n    for(tree[i+=n]=v; i>1; i>>=1)\n      tree[i>>1]=tree[i]+tree[i^1];\n  }\n  int query(int l, int r) {\n    int res=0;\n    for(l+=n,r+=n; l<r; l>>=1,r>>=1) {\n      if(l&1) res+=tree[l++];\n      if(r&1) res+=tree[--r];\n    }\n    return res;\n  }\n};\n```", icon: "🔍" },
  { label: "Predict my rating", msg: "Based on my recent performance (ranked 812, solved 3/5 in last round, expert level), what should I focus on to reach Master tier?", icon: "🎯" },
  { label: "Bit DP explained", msg: "What is bitmask DP? Give me a beginner-friendly explanation with the Traveling Salesman Problem.", icon: "⚙️" },
];

function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{
      display: "flex", flexDirection: isUser ? "row-reverse" : "row",
      gap: 12, marginBottom: 20, alignItems: "flex-start"
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
        background: isUser ? "linear-gradient(135deg, #7C6FF7, #a855f7)" : "linear-gradient(135deg, #22c87a, #0F6E56)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, fontWeight: 700, color: "#fff"
      }}>
        {isUser ? "A" : "◈"}
      </div>
      <div style={{ maxWidth: "80%", minWidth: 0 }}>
        <div style={{
          background: isUser ? "rgba(124,111,247,0.12)" : "var(--bg3)",
          border: `1px solid ${isUser ? "rgba(124,111,247,0.25)" : "var(--border)"}`,
          borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
          padding: "12px 16px",
        }}>
          {msg.loading ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="spinner" />
              <span style={{ fontSize: 13, color: "var(--text3)" }}>CP-Mentor is thinking...</span>
            </div>
          ) : (
            <div className="ai-response" dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
          )}
        </div>
        <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4, textAlign: isUser ? "right" : "left" }}>
          {isUser ? "You" : "CP-Mentor AI"} · {msg.time}
        </div>
      </div>
    </div>
  );
}

export default function AITutor() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hey! I'm CP-Mentor, your personal competitive programming coach. 🤖\n\nI've analyzed your profile: you're at **1647 rating** (Expert) with gaps in **Segment Trees (31%)**, **DP on Trees (52%)**, and **Bit Manipulation (44%)**.\n\nAsk me anything — algorithm explanations, code reviews, hints for specific problems, or contest strategy. What do you want to work on?",
      time: "now", id: 0
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topicExplanation, setTopicExplanation] = useState("");
  const [topicLoading, setTopicLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");

    const userMsg = { role: "user", content: msg, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), id: Date.now() };
    const loadingMsg = { role: "assistant", content: "", loading: true, time: "...", id: Date.now() + 1 };
    setMessages(prev => [...prev, userMsg, loadingMsg]);
    setLoading(true);

    try {
      const reply = await askAITutor(msg, { rating: 1647, weakTopics: ["Segment Trees", "DP on Trees", "Bit Manipulation"], phase: "Foundation Repair" });
      setMessages(prev => prev.map(m => m.loading ? { role: "assistant", content: reply, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), id: m.id } : m));
    } catch (e) {
      setMessages(prev => prev.map(m => m.loading ? { role: "assistant", content: "⚠ Connection error. Make sure you're running with a valid Anthropic API key.", time: "error", id: m.id } : m));
    }
    setLoading(false);
  };

  const loadTopicExplanation = async (topic) => {
    setSelectedTopic(topic);
    setTopicExplanation("");
    setTopicLoading(true);
    try {
      const text = await explainConcept(topic.name, topic.mastery);
      setTopicExplanation(text);
    } catch {
      setTopicExplanation("Failed to load explanation. Check API connection.");
    }
    setTopicLoading(false);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">🤖 AI <span>Tutor</span></div>
        <div className="page-sub">Powered by Claude — personalized to your skill profile</div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "var(--bg2)", padding: 4, borderRadius: 10, width: "fit-content", border: "1px solid var(--border)" }}>
        {[["chat", "💬 Chat"], ["concepts", "📚 Concept Explorer"], ["hints", "💡 Hint Engine"]].map(([t, l]) => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding: "6px 16px", borderRadius: 8, border: "none", cursor: "pointer",
            background: activeTab === t ? "var(--bg3)" : "transparent",
            color: activeTab === t ? "var(--text)" : "var(--text3)",
            fontSize: 13, fontWeight: 600, fontFamily: "var(--sans)",
            border: activeTab === t ? "1px solid var(--border2)" : "1px solid transparent"
          }}>{l}</button>
        ))}
      </div>

      {/* Chat Tab */}
      {activeTab === "chat" && (
        <div>
          {/* Quick prompts */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {QUICK_PROMPTS.map((qp, i) => (
              <button key={i} className="btn btn-ghost btn-sm" onClick={() => sendMessage(qp.msg)} disabled={loading}>
                {qp.icon} {qp.label}
              </button>
            ))}
          </div>

          {/* Chat window */}
          <div className="card" style={{ marginBottom: 0 }}>
            <div style={{ height: 420, overflowY: "auto", padding: "8px 0" }}>
              {messages.map(m => <Message key={m.id} msg={m} />)}
              <div ref={bottomRef} />
            </div>

            <div className="divider" />

            <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Ask about algorithms, request hints, paste code for review... (Enter to send, Shift+Enter for newline)"
                rows={3}
                style={{ resize: "none", flex: 1 }}
                disabled={loading}
              />
              <button className="btn btn-primary" onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{ flexShrink: 0, height: 44 }}>
                {loading ? <div className="spinner" /> : "Send ↑"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Concept Explorer Tab */}
      {activeTab === "concepts" && (
        <div className="grid-2">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Select a Topic</div>
              <div className="card-sub">AI will explain it for your skill level</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 500, overflowY: "auto" }}>
              {DSA_TOPICS.map(t => {
                const c = t.mastery < 40 ? "#ef5350" : t.mastery < 60 ? "#ffa726" : t.mastery < 80 ? "#42a5f5" : "#22c87a";
                return (
                  <button key={t.id} onClick={() => loadTopicExplanation(t)} style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
                    background: selectedTopic?.id === t.id ? "rgba(124,111,247,0.1)" : "var(--bg3)",
                    border: `1px solid ${selectedTopic?.id === t.id ? "rgba(124,111,247,0.3)" : "var(--border)"}`,
                    borderRadius: 8, cursor: "pointer", textAlign: "left", width: "100%",
                    fontFamily: "var(--sans)"
                  }}>
                    <span style={{ fontSize: 18 }}>{t.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text3)" }}>{t.problems} problems solved</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="progress-track" style={{ width: 60 }}>
                        <div className="progress-fill" style={{ width: `${t.mastery}%`, background: c }} />
                      </div>
                      <span style={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: c, width: 32 }}>{t.mastery}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">{selectedTopic ? selectedTopic.name : "Select a topic"}</div>
            </div>
            {!selectedTopic && (
              <div className="empty">← Pick a topic to get an AI explanation tailored to your mastery level</div>
            )}
            {topicLoading && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 20 }}>
                <div className="spinner" />
                <span style={{ color: "var(--text3)", fontSize: 14 }}>Generating personalized explanation...</span>
              </div>
            )}
            {topicExplanation && (
              <div style={{ maxHeight: 500, overflowY: "auto" }}>
                <div className="ai-response" dangerouslySetInnerHTML={{ __html: renderMarkdown(topicExplanation) }} />
                <button className="btn btn-ghost btn-sm" style={{ marginTop: 16 }} onClick={() => sendMessage(`Tell me more about ${selectedTopic.name} and give me practice problems`)}>
                  Continue in chat →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hint Engine Tab */}
      {activeTab === "hints" && (
        <HintEngine loading={loading} setLoading={setLoading} />
      )}
    </div>
  );
}

function HintEngine({ loading, setLoading }) {
  const [problemName, setProblemName] = useState("");
  const [platform, setPlatform] = useState("LeetCode");
  const [difficulty, setDifficulty] = useState("Medium");
  const [code, setCode] = useState("");
  const [hintLevel, setHintLevel] = useState(1);
  const [hint, setHint] = useState("");

  const getHint = async () => {
    setHint("");
    setLoading(true);
    try {
      const h = await generateHint({ name: problemName, platform, difficulty }, hintLevel, code);
      setHint(h);
    } catch { setHint("Failed to generate hint. Check API connection."); }
    setLoading(false);
  };

  return (
    <div className="grid-2">
      <div className="card">
        <div className="card-title" style={{ marginBottom: 16 }}>Problem Details</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: "var(--text3)", display: "block", marginBottom: 4 }}>Problem Name</label>
            <input value={problemName} onChange={e => setProblemName(e.target.value)} placeholder="e.g. Range Sum Query - Mutable" />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: "var(--text3)", display: "block", marginBottom: 4 }}>Platform</label>
              <select value={platform} onChange={e => setPlatform(e.target.value)}>
                <option>LeetCode</option><option>Codeforces</option><option>AtCoder</option><option>HackerRank</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: "var(--text3)", display: "block", marginBottom: 4 }}>Difficulty</label>
              <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                <option>Easy</option><option>Medium</option><option>Hard</option><option>1400</option><option>1600</option><option>1800</option><option>2000</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, color: "var(--text3)", display: "block", marginBottom: 4 }}>Your Code (optional)</label>
            <textarea value={code} onChange={e => setCode(e.target.value)} placeholder="Paste your current attempt here..." rows={5} style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12 }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: "var(--text3)", display: "block", marginBottom: 8 }}>Hint Level</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                [1, "💡 Conceptual nudge"],
                [2, "🔧 Algorithm direction"],
                [3, "📝 Pseudocode skeleton"]
              ].map(([lvl, label]) => (
                <button key={lvl} onClick={() => setHintLevel(lvl)} style={{
                  flex: 1, padding: "8px 6px", borderRadius: 8, cursor: "pointer",
                  background: hintLevel === lvl ? "rgba(124,111,247,0.15)" : "var(--bg3)",
                  border: `1px solid ${hintLevel === lvl ? "rgba(124,111,247,0.4)" : "var(--border)"}`,
                  color: hintLevel === lvl ? "var(--accent2)" : "var(--text3)",
                  fontSize: 12, fontFamily: "var(--sans)", fontWeight: 600
                }}>{label}</button>
              ))}
            </div>
          </div>
          <button className="btn btn-primary" onClick={getHint} disabled={loading || !problemName}>
            {loading ? <><div className="spinner" />Getting hint...</> : "Get Hint →"}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-title" style={{ marginBottom: 16 }}>
          {hint ? `Level ${hintLevel} Hint` : "Hint will appear here"}
        </div>
        {!hint && !loading && (
          <div className="empty">Fill in the problem details and click "Get Hint" for a Socratic hint tailored to your skill level</div>
        )}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="spinner" />
            <span style={{ color: "var(--text3)", fontSize: 14 }}>Generating level {hintLevel} hint...</span>
          </div>
        )}
        {hint && (
          <div className="ai-response" dangerouslySetInnerHTML={{ __html: renderMarkdown(hint) }} />
        )}
      </div>
    </div>
  );
}
