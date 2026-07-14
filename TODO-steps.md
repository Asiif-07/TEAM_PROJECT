## Steps
1. [x] Update Post schema to include `viewedBy`.
2. [x] Update `getPostBySlug` so views increment only if `req.user` exists and userId not in `viewedBy`.
3. Deploy/run to verify:
   - opening same slug multiple times doesn’t increase views
   - likes remain toggle-based per user


