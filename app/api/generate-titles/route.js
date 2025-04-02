// app/api/generate-titles/route.js

import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const body = await req.json()
    const { title, charLimit } = body

    if (!title || !charLimit) {
      return NextResponse.json(
        { error: 'Missing title or charLimit' },
        { status: 400 }
      )
    }

    // Dummy variation logic (replace with GPT later)
    const baseYear = new Date().getFullYear()
    const variations = [
      `Top ${title} Cards for ${baseYear}`,
      `Ultimate Guide to ${title} Credit Cards`,
      `${title} Credit Cards Ranked and Rated`,
      `Best ${title} Rewards for Smart Travelers`,
      `${title} Credit Cards to Consider This Year`,
      `Hot Picks: ${title} Credit Cards in ${baseYear}`,
      `${title} Options You Can’t Ignore`,
      `What to Know About ${title} Credit Cards`,
      `Expert Picks: ${title} for Rewards`,
      `Why ${title} Credit Cards Still Rule in ${baseYear}`
    ]

    const response = variations.map((t) => ({
      title: t,
      length: t.length,
      score: parseFloat((Math.random() * 4 + 6).toFixed(1)) // Score 6.0–10.0
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

export async function GET() {
  return NextResponse.json({ message: 'GET working!' })
}
