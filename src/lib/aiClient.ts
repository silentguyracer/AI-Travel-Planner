import OpenAI from 'openai';

export interface AIClientConfig {
  client: OpenAI;
  model: string;
  isGroq: boolean;
  provider: 'groq' | 'openai';
}

/**
 * Resolves the AI client configuration.
 * Supports Groq keys (gsk_...) and OpenAI keys (sk-...).
 */
export function getAIConfig(customApiKey?: string): AIClientConfig | null {
  const apiKey =
    customApiKey?.trim() ||
    process.env.GROQ_API_KEY?.trim() ||
    process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) return null;

  const isGroq = apiKey.startsWith('gsk_');

  const client = new OpenAI({
    apiKey: apiKey,
    baseURL: isGroq ? 'https://api.groq.com/openai/v1' : undefined,
  });

  // For Groq: 'openai/gpt-oss-120b' (120B parameter flagship)
  // For OpenAI: 'gpt-4o-mini'
  const model = isGroq ? 'openai/gpt-oss-120b' : 'gpt-4o-mini';

  return {
    client,
    model,
    isGroq,
    provider: isGroq ? 'groq' : 'openai',
  };
}

/**
 * Creates chat completions with automatic multi-model failover.
 */
export async function createChatCompletionWithFallback(
  aiConfig: AIClientConfig,
  params: {
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
    responseFormatJson?: boolean;
    temperature?: number;
    maxTokens?: number;
  }
): Promise<{ content: string; modelUsed: string }> {
  const modelsToTry = aiConfig.isGroq
    ? [aiConfig.model, 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b']
    : [aiConfig.model, 'gpt-4o', 'gpt-4-turbo'];

  let lastError: unknown;
  for (const model of modelsToTry) {
    try {
      const response = await aiConfig.client.chat.completions.create({
        model,
        messages: params.messages,
        response_format: params.responseFormatJson ? { type: 'json_object' } : undefined,
        temperature: params.temperature ?? 0.7,
        max_tokens: params.maxTokens,
      });

      const content = response.choices[0]?.message?.content;
      if (content && content.trim().length > 0) {
        return { content: content.trim(), modelUsed: model };
      }
    } catch (err) {
      console.warn(`[AIClient] Model ${model} failed, attempting next model:`, err);
      lastError = err;
    }
  }

  throw lastError || new Error('All AI models failed to return a response.');
}

/**
 * Robust JSON extractor that handles markdown wrappers or extraneous tokens.
 */
export function extractJsonFromResponse<T = any>(raw: string): T {
  let clean = raw.trim();

  // Strip Markdown code fences if present
  if (clean.startsWith('```json')) {
    clean = clean.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  } else if (clean.startsWith('```')) {
    clean = clean.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  try {
    return JSON.parse(clean) as T;
  } catch {
    const firstBrace = clean.indexOf('{');
    const lastBrace = clean.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const substring = clean.slice(firstBrace, lastBrace + 1);
      return JSON.parse(substring) as T;
    }
    throw new Error(`Failed to parse AI response into JSON. Raw output: ${raw.slice(0, 200)}...`);
  }
}
