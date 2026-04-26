import { NextResponse } from 'next/server'

const SYSTEM_CONTEXT = `You are FarmBridge Assistant.
FarmBridge helps farmers and organizations find relief programs, volunteer support, deadlines, and resource contacts across the United States.
Answer in 1-2 short sentences, plain language, practical, and action-oriented.
If you are unsure, say so briefly and suggest the user open Programs, Resources, Volunteer Hub, or Support pages.`

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY is not configured.' }, { status: 500 })
  }

  const { messages } = (await request.json()) as {
    messages: Array<{ role: 'user' | 'model'; content: string }>
  }

  const model = process.env.GEMINI_MODEL ?? 'gemma-3-4b-it'
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  const contents = [
    {
      role: 'user',
      parts: [{ text: SYSTEM_CONTEXT }],
    },
    ...messages.map((message) => ({
      role: message.role,
      parts: [{ text: message.content }],
    })),
  ]

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 140,
      },
    }),
  })

  const data = await response.json()
  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    'I can help with FarmBridge resources and programs. Please try rephrasing your question.'

  return NextResponse.json({ answer: text })
}
