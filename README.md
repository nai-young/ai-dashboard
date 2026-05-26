# AI Dashboard

A modern AI-powered dashboard inspired by ChatGPT, Notion, and Linear. Features **real AI integration** using free models via OpenRouter

Built as a frontend portfolio project showcasing production-level UI/UX and scalable architecture.

---

## 🚀 Features

- **Real AI responses** powered by free LLM models (Mistral, Zephyr, OpenChat via OpenRouter)
- **Rate-limited protection** (5 requests/minute per user, no cost to owner)
- **ChatGPT-like** conversation history system with session memory
- **Modular AI tools** system (email, rewrite, ideas, summary)
- **Session-based memory** (Zustand state management)
- **Clean sidebar** navigation (collapsible UI)
- **Settings panel** with theme control
- **Download & reset** conversation history
- **Modern responsive UI** (Next.js + Tailwind)
- **Markdown rendering** for AI responses

---

## 🧠 Tech Stack

| Layer     | Technology                   |
| --------- | ---------------------------- |
| Framework | Next.js 16 (App Router)      |
| Language  | TypeScript                   |
| State     | Zustand                      |
| Styling   | Tailwind CSS v4              |
| UI Kit    | shadcn/ui                    |
| Icons     | Lucide React                 |
| Themes    | next-themes                  |
| AI Engine | OpenRouter API (free models) |
| Markdown  | react-markdown + remark-gfm  |

---

## 🤖 How the AI Works

This dashboard uses **OpenRouter** to access free AI models:

1. User writes a prompt and clicks **Generate**
2. Request goes to `/api/ai` with **rate limiting** (5 req/min per IP)
3. Backend calls OpenRouter with a **free model** (Mistral 7B, Zephyr, or OpenChat)
4. AI response is rendered as markdown in the conversation panel

Uses OpenRouter's free model tier. No OpenAI API key needed.

### Free Models Used

| Model                                | Size | Use Case            |
| ------------------------------------ | ---- | ------------------- |
| `mistralai/mistral-7b-instruct:free` | 7B   | General purpose     |
| `huggingfaceh4/zephyr-7b-beta:free`  | 7B   | Chat & instructions |
| `openchat/openchat-7b:free`          | 7B   | Conversational      |

If one model is unavailable, the system automatically tries the next.

---

## 📸 UI Inspiration

Inspired by:

- ChatGPT by OpenAI
- Notion
- Linear

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Add your free OpenRouter API key from openrouter.ai

# Run dev server
npm run dev

# Open http://localhost:3000/dashboard
```

### Getting a Free OpenRouter API Key

1. Go to [openrouter.ai](https://openrouter.ai)
2. Sign up (free, no credit card required)
3. Go to **Keys** → **Create Key**
4. Copy the key to your `.env.local`:
   ```
   OPENROUTER_API_KEY=sk-or-v1-your-key-here
   ```

---

## 🛡️ Rate Limiting

To protect the free API tier and prevent abuse, the backend enforces:

- **5 requests per minute** per IP address
- Automatic fallback between 3 free models if one is busy
- Returns HTTP 429 with retry-after header when exceeded

---

## 📦 Roadmap

✅ AI integration (OpenRouter free models)  
✅ Markdown rendering for responses  
✅ Rate limiting for public access  
🚧 Streaming responses (planned)  
🚧 Supabase persistence (planned)

---

## 🌐 Live Demo

https://ai-dashboard-virid-delta.vercel.app/dashboard
