## Manual publishing checklist

```
cd /Users/willie_richter/Desktop/williesite/williesite
source ~/.nvm/nvm.sh && nvm use 20
npm run build          # optional but good to verify locally
git add content/posts/my-new-post.mdx
git status             # optional, confirm staged files
git commit -m "Add new post"
git push origin main
```

## Automated Payments Briefing

- Daily briefing generation is handled by the `Payments Briefing` GitHub Actions workflow (`.github/workflows/payments-briefing.yml`).
- The workflow runs at 11:30 AM Eastern (16:30 UTC) and can also be triggered manually from the Actions tab.
- Set the `OPENAI_API_KEY` secret in the repository settings so the workflow can enhance summaries.
- The workflow installs dependencies, runs `python3 scripts/payments_briefing.py --use-openai`, builds the site, and pushes any new MDX files back to `main`.
