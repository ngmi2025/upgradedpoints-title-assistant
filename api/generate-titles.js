// /api/generate-titles.js
import fetch from "node-fetch"; // If you're not in a native fetch environment

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { title, limit } = req.body;

  if (!title || !limit) return res.status(400).json({ error: 'Missing input' });

  const cleanedTitle = title.trim().replace(/[\[\]]/g, '').replace(/U\.S\./g, 'US');

  const systemPrompt = `
You are an assistant that generates concise, engaging, and informative titles optimized for Google Discover.
CRITICAL REQUIREMENT: Each title MUST be between ${limit === 63 ? '52 and 63' : '85 and 100'} characters - NO EXCEPTIONS.

For Google Discover optimization, focus on:
1. Creating curiosity gaps that make users want to click
2. Using emotional triggers (amazement, surprise, concern)
3. Including specific, concrete details
4. Avoiding clickbait that doesn’t deliver
5. Using numbers or specifics where possible

Output should follow this format:
Original Score: [Score]
Title 1: [title]
Score 1: [score]
...
Title 10: [title]
Score 10: [score]
  `.trim();

  const userPrompt = `
Evaluate the title "${cleanedTitle}" and generate 10 optimized titles for Google Discover.
Each must be between ${limit === 63 ? '52 and 63' : '85 and 100'} characters. Score each one.
  `.trim();

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 600,
        temperature: 0.7,
        frequency_penalty: 0.3
      })
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    const titles = [];
    const titleScores = [];

    const originalScoreMatch = content.match(/Original Score:\s*(\d+)/);
    const matches = [...content.matchAll(/Title \d+:\s*(.*?)\nScore \d+:\s*(\d+)/g)];

    matches.forEach(match => {
      const [, title, score] = match;
      titles.push(title.trim());
      titleScores.push(score.trim());
    });

    // Fill up to 10 results
    while (titles.length < 10) {
      titles.push("—");
      titleScores.push("—");
    }

    return res.status(200).json({
      originalScore: originalScoreMatch?.[1] || "—",
      titles,
      titleScores
    });

  } catch (err) {
    console.error("GPT Error:", err);
    return res.status(500).json({ error: "OpenAI API failed" });
  }
}
