import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, charLimit } = body

    if (!title || !charLimit) {
      return NextResponse.json(
        { error: 'Missing title or charLimit' },
        { status: 400 }
      )
    }

    let cleanedTitle = title
      .replace(/["""'\[\]]/g, '')
      .replace(/U\.S\./g, 'US')
      .replace(/[^ -~]+/g, '') // strip non-ASCII
      .trim()

    if (cleanedTitle.length > 90) {
      cleanedTitle = cleanedTitle.substring(0, 90) + '...'
    }

    let systemPrompt = ''
    let userPrompt = ''

    if (charLimit === '63') {
      systemPrompt = `You are an assistant that generates concise, engaging, and informative titles optimized for Google Discover. CRITICAL REQUIREMENT: Each title MUST be between 52 and 63 characters - NO EXCEPTIONS. You must aim to use between 58-63 characters for EVERY title. Shorter titles will be rejected.

For Google Discover optimization, focus on:
1. Creating curiosity gaps that make users want to click
2. Using emotional triggers (amazement, surprise, concern)
3. Including specific, concrete details rather than vague statements
4. Avoiding clickbait tactics that don't deliver on promises
5. Using numbers and specific data points when relevant`

      userPrompt = `Titles must be well-written and make sense. Provide a score out of 10 for the original title, followed by 10 optimized titles for this topic. Apply the same scoring criteria for curiosity gap, emotional appeal, and urgency for each title. Do not provide reasoning or explanations, just the titles and their scores. Format the response as:

Original Score: [Original Score]
Title 1: [Title 1]
Score 1: [Score 1]
...
Title 10: [Title 10]
Score 10: [Score 10]

Now evaluate this title and rewrite it as requested: "${cleanedTitle}"`
    } else if (charLimit === '100') {
      systemPrompt = `You are an assistant that generates engaging and informative titles optimized for Google Discover. CRITICAL REQUIREMENT: Each title MUST be between 85 and 100 characters - NO EXCEPTIONS. You must aim to use between 90-100 characters for EVERY title. Shorter titles will be rejected.

For Google Discover optimization, focus on:
1. Creating detailed, informative titles that provide clear value
2. Using emotional triggers while maintaining professionalism
3. Including specific details and context
4. Avoiding clickbait while ensuring comprehensiveness
5. Using numbers and data points when relevant`

      userPrompt = `Titles must be well-written and make sense. Provide a score out of 10 for the original title, followed by 10 optimized titles for this topic. Apply the same scoring criteria for informativeness, emotional appeal, and clarity for each title. Do not provide reasoning or explanations, just the titles and their scores. Format the response as:

Original Score: [Original Score]
Title 1: [Title 1]
Score 1: [Score 1]
...
Title 10: [Title 10]
Score 10: [Score 10]

Now evaluate this title and rewrite it as requested: "${cleanedTitle}"`
    }

    const apiKey = process.env.OPENAI_API_KEY
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        frequency_penalty: 0.3,
        max_tokens: 600,
      }),
    })

    const json = await response.json()
    const output = json.choices?.[0]?.message?.content?.trim()

    const result: {
      originalScore: string
      titles: { title: string; score: number }[]
    } = {
      originalScore: 'N/A',
      titles: [],
    }

    if (output) {
      const originalScoreMatch = output.match(/Original Score:\s*(\d+)/i)
      if (originalScoreMatch) {
        result.originalScore = originalScoreMatch[1]
      }

      // Flexible parsing to catch all spacing/format issues
      const titleRegex = /Title\s*\d+:\s*(.*?)\s*Score\s*\d+:?\s*(\d+(\.\d+)?)/gi
      let match: RegExpExecArray | null

      while ((match = titleRegex.exec(output)) !== null) {
        const rawTitle = match[1]?.trim()
        const rawScore = match[2]?.trim()

        if (rawTitle && rawScore) {
          let title = rawTitle
            .replace(/^"|"$/g, '')
            .replace(/(\w)I(\w)/g, (_, p1, p2) => `${p1}i${p2}`)
            .replace(/\b202[2-4]\b/g, new Date().getFullYear().toString())

          result.titles.push({
            title,
            score: parseFloat(rawScore),
          })
        }
      }

      result.titles.sort((a, b) => b.score - a.score)
    }

    return NextResponse.json({ titles: result.titles })
  } catch (error) {
    console.error('OpenAI API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'GET working!' })
}
