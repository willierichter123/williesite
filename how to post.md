cd /Users/willie_richter/Desktop/williesite/williesite
source ~/.nvm/nvm.sh && nvm use 20
npm run build          # optional but good to verify locally
git add content/posts/my-new-post.mdx
git status             # optional, confirm staged files
git commit -m "Add my new post"
git push origin main
