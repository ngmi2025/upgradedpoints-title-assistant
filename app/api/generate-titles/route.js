// app/api/generate-titles/route.js

export async function POST(req) {
  try {
    const { title, charLimit } = await req.json();

    if (!title || !charLimit) {
      return new Response(JSON.stringify({
        error: 'Missing title or charLimit',
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate dummy title variations (replace with real GPT logic later)
    const variations = [
      `Top ${title} Cards for ${new Date().getFullYear()}`,
      `Ultimate Guide to ${title} Credit Cards`,
      `${title} Credit Cards Ranked and Rated`,
      `Best ${title} Rewards for Smart Travelers`,
      `${title} Credit Cards to Consider This Year`,
      `Hot Picks: ${title} Credit Cards in 2025`,
      `${title} Options You Can’t Ignore`,
      `What to Know About ${title} Credit Cards`,
      `Expert Picks: ${title} for Rewards`,
      `Why ${title} Credit Cards Still Rule in 2025`
    ];

    // Format each with score + length
    const response = variations.map(t => ({
      title: t,
      length: t.length,
      score: parseFloat((Math.random() * 4 + 6).toFixed(1)) // Random score 6.0–10.0
    }));

    // Sort by score (highest first)
    response.sort((a, b) => b.score - a.score);

    return new Response(JSON.stringify({ titles: response }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Optional GET handler for testing
export async function GET() {
  return new Response(JSON.stringify({ message: 'GET working!' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
