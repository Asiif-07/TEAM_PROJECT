import { test } from "node:test";
import assert from "node:assert/strict";
import { completeJsonWithFallback, isFallbackEligible } from "../utils/aiFallback.js";

const silent = { warn() {}, log() {} };
const ok = (obj) => ({ choices: [{ message: { content: JSON.stringify(obj) } }] });
const httpError = (status) => Object.assign(new Error(`HTTP ${status}`), { status });

// Fake client: behaviours is a map model -> function(options) returning a response or throwing.
const fakeClient = (behaviours, calls = []) => ({
  chat: {
    completions: {
      create: async (params, opts) => {
        calls.push({ model: params.model, opts });
        return behaviours[params.model](params, opts);
      },
    },
  },
});
const run = (behaviours, models, calls) =>
  completeJsonWithFallback({ client: fakeClient(behaviours, calls), models, timeoutMs: 50, params: {}, logger: silent });

test("uses the primary model when it succeeds", async () => {
  const calls = [];
  const r = await run({ a: async () => ok({ x: 1 }), b: async () => ok({ x: 2 }) }, ["a", "b"], calls);
  assert.equal(r.model, "a");
  assert.deepEqual(r.data, { x: 1 });
  assert.deepEqual(calls.map((c) => c.model), ["a"]);
  assert.equal(calls[0].opts.maxRetries, 0);
});

test("falls back on 404 model_not_found", async () => {
  const r = await run({ a: async () => { throw httpError(404); }, b: async () => ok({ x: 2 }) }, ["a", "b"]);
  assert.equal(r.model, "b");
  assert.equal(r.attempts.length, 1);
});

test("walks the whole chain: 429 -> 500 -> success", async () => {
  const calls = [];
  const r = await run({
    a: async () => { throw httpError(429); },
    b: async () => { throw httpError(500); },
    c: async () => ok({ ok: true }),
  }, ["a", "b", "c"], calls);
  assert.equal(r.model, "c");
  assert.deepEqual(calls.map((c) => c.model), ["a", "b", "c"]);
});

test("falls back on timeout (no status)", async () => {
  const slow = Object.assign(new Error("Request timed out."), { name: "APIConnectionTimeoutError" });
  const r = await run({ a: async () => { throw slow; }, b: async () => ok({ x: 1 }) }, ["a", "b"]);
  assert.equal(r.model, "b");
});

test("falls back on malformed JSON output", async () => {
  const bad = async () => ({ choices: [{ message: { content: "not json" } }] });
  const r = await run({ a: bad, b: async () => ok({ x: 1 }) }, ["a", "b"]);
  assert.equal(r.model, "b");
  assert.equal(r.attempts[0].reason, "malformed JSON");
});

test("does not fall back on 401/403 (fails fast)", async () => {
  const calls = [];
  await assert.rejects(
    run({ a: async () => { throw httpError(401); }, b: async () => ok({}) }, ["a", "b"], calls),
    (e) => e.status === 401 && e.attempts.length === 1
  );
  assert.deepEqual(calls.map((c) => c.model), ["a"]);
});

test("throws the last error with all attempts when every model fails", async () => {
  await assert.rejects(
    run({ a: async () => { throw httpError(404); }, b: async () => { throw httpError(503); } }, ["a", "b"]),
    (e) => e.status === 503 && e.attempts.map((a) => a.model).join() === "a,b"
  );
});

test("isFallbackEligible", () => {
  assert.equal(isFallbackEligible(httpError(400)), true);
  assert.equal(isFallbackEligible(httpError(403)), false);
  assert.equal(isFallbackEligible(new Error("network")), true);
});
