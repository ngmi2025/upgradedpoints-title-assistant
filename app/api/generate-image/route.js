import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { title } = await req.json()

    if (!title) {
      return NextResponse.json({ error: 'Missing title' }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY

const prompt = `Create a visually engaging, clickbait-style thumbnail image inspired by the following title: "${title}". 
The image should be:
- Optimized for Google Discover (landscape format, 1792x1024)
- Eye-catching and designed for mobile screens
- Use bold colors and minimal text
- Relate directly to the content of the title (e.g. travel, credit cards, finance, etc.)
- Do not include logos or watermarks.`

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
body: JSON.stringify({
  model: "dall-e-3",
  prompt,
  size: "1792x1024", // ✅ Valid landscape size for Discover
  quality: "standard",
  n: 1,
})
    })

    const json = await response.json()

    if (json.data && json.data.length > 0) {
      return NextResponse.json({ imageUrl: json.data[0].url })
    } else {
      console.error('Image generation failed:', json)
      return NextResponse.json({ error: 'Image generation failed' }, { status: 500 })
    }
  } catch (error) {
    console.error('Image generation error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
