#!/bin/bash

echo "🚀 SoundScape Deployment Helper"
echo "================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
fi

# Add all files
echo "📦 Adding files to Git..."
git add .

# Commit changes
echo "💾 Committing changes..."
read -p "Enter commit message (or press Enter for default): " commit_msg
if [ -z "$commit_msg" ]; then
    commit_msg="Deploy SoundScape to Vercel"
fi
git commit -m "$commit_msg"

# Check if remote exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 Setting up GitHub remote..."
    read -p "Enter your GitHub username: " github_username
    read -p "Enter repository name (default: soundscape-music-app): " repo_name
    if [ -z "$repo_name" ]; then
        repo_name="soundscape-music-app"
    fi
    git remote add origin "https://github.com/$github_username/$repo_name.git"
fi

# Push to GitHub
echo "⬆️ Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ Code pushed to GitHub!"
echo ""
echo "Next steps:"
echo "1. Go to https://vercel.com"
echo "2. Sign in with GitHub"
echo "3. Import your repository: $repo_name"
echo "4. Add environment variables (see DEPLOYMENT_GUIDE.md)"
echo "5. Deploy!"
echo ""
echo "📖 Full guide: See DEPLOYMENT_GUIDE.md"