// app/api/generate-titles/route.js
export async function POST(req) {
  const body = await req.json();
  const { inputTitle, characterLimit } = body;

  // Dummy logic (replace with real GPT later)
  const results = [
    {
      title: `${inputTitle} - Best Options for 2025`,
      length: `${inputTitle.length + 23}`,
      score: 9.5,
    },
    {
      title: `Ultimate Guide: ${inputTitle}`,
      length: `${inputTitle.length + 16}`,
      score: 8.2,
    },
    {
      title: `Why ${inputTitle} Matters in 2025`,
      length: `${inputTitle.length + 14}`,
      score: 7.4,
    },
    {
      title: `Top Picks: ${inputTitle}`,
      length: `${inputTitle.length + 11}`,
      score: 6.8,
    },
  ];

  return Response.json({ results });
}
