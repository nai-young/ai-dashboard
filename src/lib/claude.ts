export async function askClaudeStream(
  prompt: string,
  tool: string,
  onChunk: (text: string) => void,
) {
  const res = await fetch("/api/claude", {
    method: "POST",
    body: JSON.stringify({ prompt, tool }),
  });

  const reader = res.body?.getReader();
  const decoder = new TextDecoder();

  let fullText = "";

  while (true) {
    const { value, done } = await reader!.read();
    if (done) break;

    const chunk = decoder.decode(value);
    fullText += chunk;

    onChunk(fullText);
  }

  return fullText;
}
