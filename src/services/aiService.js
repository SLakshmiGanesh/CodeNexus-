const CHAT_API = process.env.REACT_APP_API_URL || "/api/chat";

export async function askAITutor(userMessage, context = {}) {
  const systemPrompt = `You are CP-Mentor, an elite competitive programming AI coach. You help users master Data Structures and Algorithms for competitive programming on platforms like Codeforces, LeetCode, and AtCoder.

Your style:
- Be direct and technically precise
- Use concrete examples with code when helpful
- Give progressive hints: conceptual → algorithmic → implementation
- Reference the user's skill profile when relevant
- Always mention time/space complexity
- Be encouraging but honest about weaknesses

User context:
- Rating: ${context.rating || 1647} (Expert on Codeforces)
- Known weak topics: ${context.weakTopics?.join(", ") || "Segment Trees, DP on Trees, Bit Manipulation"}
- Current study phase: ${context.phase || "Foundation Repair (Prefix Sums, Sliding Window)"}

Keep responses concise but complete. Use markdown formatting. Include code examples in appropriate language (C++ preferred for CP).`;

  const response = await fetch(CHAT_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }]
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "API request failed");
  }

  const data = await response.json();
  return data.content?.[0]?.text || "No response returned.";
}

export async function generateHint(problem, hintLevel = 1, userCode = "") {
  const levels = {
    1: "Give only a conceptual nudge — what type of algorithm or data structure to think about. 2-3 sentences max.",
    2: "Give the algorithmic direction — the key insight or approach, but no code. 4-5 sentences.",
    3: "Give a partial pseudocode or implementation skeleton. Show the structure but leave key parts for the user to fill."
  };

  const prompt = `Problem: "${problem.name}" (${problem.difficulty} on ${problem.platform})
${userCode ? `User's current code:\n\`\`\`cpp\n${userCode}\n\`\`\`` : "User hasn't written code yet."}

Hint level ${hintLevel}: ${levels[hintLevel]}`;

  return askAITutor(prompt, {});
}

export async function explainConcept(topic, userMastery) {
  const prompt = `Explain "${topic}" for competitive programming. The user has ${userMastery}% mastery.

Cover:
1. Core intuition (what problem does it solve?)
2. Key implementation pattern in C++
3. Time/space complexity
4. 2 classic problem types it solves
5. Common mistakes to avoid

Be concise but complete.`;

  return askAITutor(prompt, {});
}

export async function reviewCode(code, problem) {
  const prompt = `Review this competitive programming solution:

Problem: ${problem}

\`\`\`cpp
${code}
\`\`\`

Provide:
1. Correctness assessment
2. Time/space complexity analysis
3. Edge cases that might fail
4. Optimization suggestions (if any)
5. Style/idiom improvements for CP

Be direct and actionable.`;

  return askAITutor(prompt, {});
}

export async function predictRating(recentContests, topics) {
  const prompt = `Based on this competitive programmer's recent performance, predict their next contest rating change.

Recent contests: ${JSON.stringify(recentContests)}
Strong topics: ${topics.filter(t => t.mastery > 70).map(t => t.name).join(", ")}
Weak topics: ${topics.filter(t => t.mastery < 60).map(t => t.name).join(", ")}

Provide:
1. Predicted rating delta for next contest (-50 to +80 range)
2. Confidence level (%)
3. Key factors driving prediction
4. What to focus on for best outcome

Format as a structured analysis.`;

  return askAITutor(prompt, {});
}
