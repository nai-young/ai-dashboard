import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt, tool } = await req.json();

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-haiku-20240307",
      max_tokens: 800,
      stream: true,
      messages: [
        {
          role: "user",
          content: `Tool: ${tool}\nTask: ${prompt}`,
        },
      ],
    }),
  });

  return new Response(response.body, {
    headers: {
      "Content-Type": "text/event-stream",
    },
  });
}
