// Runs a JSON-mode chat completion against an ordered list of models, moving to the next
// model when one fails for a reason that another model may not share.

// Failures worth retrying on another model: model missing/disabled (400/404), rate limit or
// quota (429), provider errors (5xx), timeouts/network errors, and unparsable JSON output.
// Auth failures (401/403) are identical for every model, so they fail fast.
export function isFallbackEligible(error) {
    const status = error?.status;
    if (status === 401 || status === 403) return false;
    if (status === undefined) return true; // timeout, network error, malformed JSON
    return status === 400 || status === 404 || status === 408 || status === 429 || status >= 500;
}

export async function completeJsonWithFallback({ client, models, timeoutMs, params, logger = console }) {
    if (!models?.length) throw new Error("No AI models configured");

    const attempts = [];
    let lastError;

    for (const model of models) {
        const startedAt = Date.now();
        try {
            const response = await client.chat.completions.create(
                { ...params, model },
                { timeout: timeoutMs, maxRetries: 0 }
            );
            const content = response?.choices?.[0]?.message?.content;
            const data = JSON.parse(content); // SyntaxError => falls through to next model
            if (attempts.length) {
                logger.warn(`[AI] Succeeded with fallback model ${model} after: ${attempts.map((a) => a.model).join(", ")}`);
            }
            return { data, model, attempts };
        } catch (error) {
            lastError = error;
            attempts.push({
                model,
                status: error?.status,
                reason: error?.name === "SyntaxError" ? "malformed JSON" : String(error?.message || error).slice(0, 160),
                ms: Date.now() - startedAt,
            });
            logger.warn(`[AI] Model ${model} failed (${error?.status ?? error?.name}); ${isFallbackEligible(error) ? "trying next" : "aborting"}`);
            if (!isFallbackEligible(error)) break;
        }
    }

    lastError.attempts = attempts;
    throw lastError;
}
