# Migration

**Owner:** Send the new game’s name, domain, product/seller links, checkout link (if separate), reviews (if any), and image paths in chat. Do not edit JSON in this folder.

**Agent:** Follow [`AGENT_TASKS.md`](./AGENT_TASKS.md) and [`../MASTER_INSTRUCTIONS.md`](../MASTER_INSTRUCTIONS.md).

| File | Purpose |
|------|---------|
| `game.input.example.json` | JSON schema reference (not copied by owner) |
| `game.input.json` | Created/updated by the agent (`write-game-input.mjs`) — gitignored |
| `AGENT_TASKS.md` | Step-by-step agent workflow |

```bash
npm run template:generate
npx astro build
npm run migration:signoff   # build + verify + placeholder scan + layout (required before deploy)
```
