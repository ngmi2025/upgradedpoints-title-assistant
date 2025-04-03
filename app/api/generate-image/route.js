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
- Optimized for Google Discover (800x400 ratio)
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
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x512', // Closest to Google Discover 5:2 aspect
        quality: 'hd',
        response_format: 'url',
      }),
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
