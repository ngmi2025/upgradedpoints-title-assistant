// app/api/generate-titles/route.js

import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { title, charLimit } = await req.json()

    if (!title || !charLimit) {
      return NextResponse.json(
        { error: 'Missing title or charLimit' },
        { status: 400 }
      )
    }

    // Dummy example logic – replace with real GPT logic later
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
    ]

    const response = variations.map((t) => ({
      title: t,
      length: t.length,
      score: parseFloat((Math.random() * 4 + 6).toFixed(1)) // random score 6.0–10.0
    }))

    return NextResponse.json({ titles: response })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
