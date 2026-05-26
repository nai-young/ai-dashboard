import { NextResponse } from "next/server";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

// Rate limiter: max 3 requests per 2 minutes per IP (conservative for free tier)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 2 * 60 * 1000;

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - record.count };
}

function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

// Free models available on OpenRouter
const FREE_MODELS = [
  "deepseek/deepseek-chat-v3-0324:free",
  "meta-llama/llama-3.3-8b-instruct:free",
  "google/gemma-3-4b-it:free",
];

// Sleep helper for delays between retries
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: Request) {
  try {
    // Rate limiting
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

    // If no API key configured, return informative error
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

    // System prompt based on tool
    const systemPrompts: Record<string, string> = {
      email:
        "You are a professional email writing assistant. Write concise, polite, and effective emails. Use professional tone.",
      summary:
        "You are a summarization expert. Create clear, structured summaries with bullet points. Be concise but comprehensive.",
      rewrite:
        "You are a writing enhancement expert. Improve clarity, flow, and impact while preserving meaning. Output only the improved text.",
      ideas:
        "You are a creative brainstorming assistant. Generate practical, innovative ideas with brief explanations. Be inspiring but realistic.",
    };

    const systemPrompt =
      systemPrompts[tool] || "You are a helpful AI assistant.";

    // Try each free model in order with delays between retries
    let lastError = null;
    for (let i = 0; i < FREE_MODELS.length; i++) {
      const model = FREE_MODELS[i];
      try {
        // Wait 1.5s between model attempts to avoid hammering the API
        if (i > 0) {
          await sleep(1500);
        }

        const res = await fetch(OPENROUTER_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "HTTP-Referer": "https://ai-dashboard-virid-delta.vercel.app",
            "X-Title": "AI Dashboard",
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: prompt },
            ],
            max_tokens: 800,
            temperature: 0.7,
          }),
        });

        if (!res.ok) {
          let errorData: any = {};
          try {
            errorData = await res.json();
          } catch {
            errorData = { error: { message: `HTTP ${res.status}` } };
          }

          const errorMsg = errorData.error?.message || `HTTP ${res.status}`;
          lastError = new Error(errorMsg);

          // If rate limited (429) or server error (5xx), try next model
          if (res.status === 429 || res.status >= 500) {
            continue;
          }

          // For other errors, don't retry
          break;
        }

        const data = await res.json();
        const content =
          data.choices?.[0]?.message?.content || "No response from AI.";

        return NextResponse.json(
          { content, model },
          {
            headers: {
              "X-RateLimit-Remaining": String(rateCheck.remaining),
            },
          },
        );
      } catch (err: any) {
        lastError = err;
        continue;
      }
    }

    // All models failed — give a helpful message
    const isRateLimited =
      lastError?.message?.includes("429") ||
      lastError?.message?.includes("rate limit");
    const isTimeout =
      lastError?.message?.includes("timeout") ||
      lastError?.message?.includes("fetch failed");

    if (isRateLimited) {
      return NextResponse.json(
        {
          error: "All free AI models are currently busy",
          message:
            "Free models on OpenRouter are experiencing high demand. Please wait 2-3 minutes and try again.",
          details:
            "The free model tier has rate limits shared across all users.",
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
          details: lastError?.message || "Connection timeout",
        },
        { status: 504 },
      );
    }

    return NextResponse.json(
      {
        error: "All free AI models are currently unavailable",
        message:
          "The free AI models are down or busy. Please try again in a few minutes.",
        details: lastError?.message || "Unknown error",
      },
      { status: 503 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to process request", details: error.message },
      { status: 500 },
    );
  }
}
