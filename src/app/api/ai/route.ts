import { NextResponse } from "next/server";

export const runtime = "nodejs";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Rate limiter: max 3 requests per 2 minutes per IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 2 * 60 * 1000;

const MODEL = process.env.OPENROUTER_MODEL || "openrouter/free";

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });

    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX - 1,
    };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return {
      allowed: false,
      remaining: 0,
    };
  }

  record.count += 1;

  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX - record.count,
  };
}

function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return "unknown";
}

export async function POST(request: Request) {
  try {
    const ip = getClientIP(request);
    const rateCheck = checkRateLimit(ip);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: `Maximum ${RATE_LIMIT_MAX} AI requests per 2 minutes. Please wait and try again.`,
          retryAfter: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)),
          },
        },
      );
    }

    const body = await request.json();
    const { prompt, tool } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        {
          error: "OpenRouter API key not configured",
          message:
            "This demo requires a free OpenRouter API key. Get one at openrouter.ai",
          fallback: true,
        },
        { status: 503 },
      );
    }

    const systemPrompts: Record<string, string> = {
      email:
        "You are a professional email writing assistant. Write concise, polite, and effective emails. Use a professional tone.",
      summary:
        "You are a summarization expert. Create clear, structured summaries with bullet points. Be concise but comprehensive.",
      rewrite:
        "You are a writing enhancement expert. Improve clarity, flow, and impact while preserving meaning. Output only the improved text.",
      ideas:
        "You are a creative brainstorming assistant. Generate practical, innovative ideas with brief explanations. Be inspiring but realistic.",
    };

    const systemPrompt =
      systemPrompts[tool] || "You are a helpful AI assistant.";

    let lastErrorMessage = "Unknown error";

    for (let attempt = 0; attempt < RATE_LIMIT_MAX; attempt++) {
      try {
        const res = await fetch(OPENROUTER_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": APP_URL,
            "X-Title": "AI Dashboard",
          },
          body: JSON.stringify({
            model: MODEL,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: prompt },
            ],
            max_tokens: 300,
            temperature: 0.3,
          }),
        });

        const rawText = await res.text();

        if (!res.ok) {
          let parsedError: any = null;

          try {
            parsedError = JSON.parse(rawText);
          } catch {
            parsedError = null;
          }

          lastErrorMessage =
            parsedError?.error?.message ||
            parsedError?.message ||
            rawText ||
            `HTTP ${res.status}`;

          console.error("OpenRouter model failed:", {
            model: MODEL,
            status: res.status,
            error: lastErrorMessage,
          });

          if (res.status === 429 || res.status >= 500) {
            continue;
          }

          break;
        }

        let data: any;

        try {
          data = JSON.parse(rawText);
        } catch {
          throw new Error("Invalid JSON response from OpenRouter");
        }

        const content = data.choices?.[0]?.message?.content;

        if (!content) {
          lastErrorMessage = "No content returned from AI model";
          continue;
        }

        return NextResponse.json(
          {
            content,
            model: MODEL,
          },
          {
            headers: {
              "X-RateLimit-Remaining": String(rateCheck.remaining),
            },
          },
        );
      } catch (error: unknown) {
        lastErrorMessage =
          error instanceof Error ? error.message : "Unknown model error";

        console.error("OpenRouter request failed:", {
          model: MODEL,
          error: lastErrorMessage,
        });

        continue;
      }
    }

    const isRateLimited =
      lastErrorMessage.toLowerCase().includes("429") ||
      lastErrorMessage.toLowerCase().includes("rate limit");

    const isTimeout =
      lastErrorMessage.toLowerCase().includes("timeout") ||
      lastErrorMessage.toLowerCase().includes("fetch failed");

    if (isRateLimited) {
      return NextResponse.json(
        {
          error: "All free AI models are currently busy",
          message:
            "Free models on OpenRouter are experiencing high demand. Please wait a few minutes and try again.",
          details: lastErrorMessage,
        },
        { status: 503 },
      );
    }

    if (isTimeout) {
      return NextResponse.json(
        {
          error: "AI service timeout",
          message:
            "The AI service took too long to respond. Free models can be slow. Please try again.",
          details: lastErrorMessage,
        },
        { status: 504 },
      );
    }

    return NextResponse.json(
      {
        error: "All free AI models are currently unavailable",
        message:
          "The free AI models are down, busy, or no longer available. Please try again later.",
        details: lastErrorMessage,
      },
      { status: 503 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
