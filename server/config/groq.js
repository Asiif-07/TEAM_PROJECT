import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

export const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});
// Models are tried in priority order; comma-separated GROQ_MODELS overrides the default.
// GROQ_MODEL (single value) is still honoured as the first choice.
const DEFAULT_MODELS = ["openai/gpt-oss-120b", "qwen/qwen3.8-27b", "openai/gpt-oss-20b"];

export const GROQ_MODELS = [
    ...new Set(
        [process.env.GROQ_MODEL, ...(process.env.GROQ_MODELS?.split(",") ?? DEFAULT_MODELS)]
            .map((m) => m?.trim())
            .filter(Boolean)
    ),
];

export const GROQ_TIMEOUT_MS = Number(process.env.GROQ_TIMEOUT_MS) || 20000;
