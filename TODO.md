# TODO

## Blog analytics fix (views per account + like counts)
- [ ] Update `server/model/post.model.js` to store unique viewers (e.g. `viewedBy`)
- [ ] Update `server/controller/blog.controller.js` `getPostBySlug` to increment views only once per logged-in account
- [ ] Keep likes behavior as-is (toggle per user) and ensure likeCount is still derived from reactions
- [ ] Run server lint/tests (or start server) and manually verify

