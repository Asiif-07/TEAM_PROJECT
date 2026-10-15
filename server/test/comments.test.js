import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import Comment from "../model/comment.model.js";
import Post from "../model/post.model.js";
import Notification from "../model/notification.model.js";
import { addComment, getComments, deleteComment, MAX_COMMENT_LENGTH } from "../controller/blog.controller.js";

// The controllers only touch Mongoose model statics, so they are stubbed here (no database needed).
const oid = () => new mongoose.Types.ObjectId().toString();

const mockRes = () => {
  const res = { statusCode: 200, body: undefined };
  res.status = (c) => { res.statusCode = c; return res; };
  res.json = (b) => { res.body = b; return res; };
  return res;
};

const originals = {};
beforeEach(() => {
  for (const [k, m, name] of [
    ["create", Comment, "create"], ["cFindById", Comment, "findById"],
    ["cUpdate", Comment, "findByIdAndUpdate"], ["pFindById", Post, "findById"],
  ]) {
    originals[k] ??= m[name];
    m[name] = originals[k];
  }
  // Notifications are a side effect; keep them off the database.
  Notification.create = async (doc) => ({ ...doc, _id: oid(), populate: async () => {} });
});

const user = { _id: oid() };
const postId = oid();
const postDoc = { _id: postId, author: oid() };

test("rejects empty / whitespace-only comment (400)", async () => {
  const res = mockRes();
  await addComment({ params: { postId }, body: { content: "   " }, user }, res);
  assert.equal(res.statusCode, 400);
  assert.match(res.body.message, /empty/i);
});

test("rejects comment longer than the limit (400)", async () => {
  const res = mockRes();
  await addComment({ params: { postId }, body: { content: "a".repeat(MAX_COMMENT_LENGTH + 1) }, user }, res);
  assert.equal(res.statusCode, 400);
});

test("rejects an invalid post id (400) instead of a CastError 500", async () => {
  const res = mockRes();
  await addComment({ params: { postId: "not-an-id" }, body: { content: "hi" }, user }, res);
  assert.equal(res.statusCode, 400);
  const res2 = mockRes();
  await getComments({ params: { postId: "not-an-id" } }, res2);
  assert.equal(res2.statusCode, 400);
});

test("404 when the post does not exist", async () => {
  Post.findById = async () => null;
  const res = mockRes();
  await addComment({ params: { postId }, body: { content: "hi" }, user }, res);
  assert.equal(res.statusCode, 404);
});

test("creates a top-level comment (201) with trimmed content", async () => {
  let created;
  Post.findById = async () => postDoc;
  Comment.create = async (doc) => { created = doc; return { _id: oid(), ...doc }; };
  Comment.findById = () => ({ populate: async () => ({ ...created, author: { name: "Sara" } }) });
  const res = mockRes();
  await addComment({ params: { postId }, body: { content: "  Great read!  " }, user }, res);
  assert.equal(res.statusCode, 201);
  assert.equal(created.content, "Great read!");
  assert.equal(created.parentComment, null);
});

test("a reply to a reply is attached to the thread root", async () => {
  const rootId = oid();
  const replyId = oid();
  let created; let pushed;
  Post.findById = async () => postDoc;
  Comment.create = async (doc) => { created = doc; return { _id: oid(), ...doc }; };
  Comment.findByIdAndUpdate = async (id, upd) => { pushed = { id, upd }; };
  Comment.findById = (id) => {
    if (String(id) === replyId) return Promise.resolve({ _id: replyId, post: postId, parentComment: rootId, author: oid() });
    return { populate: async () => ({ ...created }) };
  };
  const res = mockRes();
  await addComment({ params: { postId }, body: { content: "re", parentCommentId: replyId }, user }, res);
  assert.equal(res.statusCode, 201);
  assert.equal(String(created.parentComment), rootId);
  assert.equal(String(pushed.id), rootId);
});

test("reply to a comment from another post is rejected (404)", async () => {
  Post.findById = async () => postDoc;
  Comment.findById = async () => ({ _id: oid(), post: oid(), parentComment: null, author: oid() });
  const res = mockRes();
  await addComment({ params: { postId }, body: { content: "x", parentCommentId: oid() }, user }, res);
  assert.equal(res.statusCode, 404);
});

test("only the author can delete (403) and ids are validated (400)", async () => {
  const commentId = oid();
  Comment.findById = async () => ({ _id: commentId, post: postId, author: oid(), parentComment: null, replies: [] });
  const res = mockRes();
  await deleteComment({ params: { postId, commentId }, user }, res);
  assert.equal(res.statusCode, 403);
  const res2 = mockRes();
  await deleteComment({ params: { postId: "bad", commentId }, user }, res2);
  assert.equal(res2.statusCode, 400);
});
