import { OpenAI } from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req) {
  try {
    const { title, style = "illustration", tone = "curiosity" } = await req.json()

    const prompt = `Create a visually engaging, clickbait-style thumbnail image inspired by the following title: "${title}".
The image should be:
- Optimized for Google Discover (landscape format, 1792x1024)
- Eye-catching and designed for mobile screens
- Use bold colors and minimal text
- Match this *tone*: ${tone}
- Use this *visual style*: ${style}
- Relate directly to the topic of the title (e.g. travel, credit cards, finance, etc.)
- Do not include logos or watermarks.`

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      size: "1792x1024", // best for Google Discover
      quality: "standard",
      style: style === "photorealistic" ? "vivid" : "natural", // map selection
      response_format: "url",
    })

    return Response.json({ imageUrl: response.data[0].url })
  } catch (err) {
    console.error("Image generation failed:", err)
    return Response.json(
      { error: err?.message || "Image generation failed" },
      { status: 500 }
    )
  }
}
