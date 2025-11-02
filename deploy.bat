@echo off
echo 🚀 SoundScape Deployment Helper
echo ================================

REM Check if git is initialized
if not exist ".git" (
    echo 📁 Initializing Git repository...
    git init
)

REM Add all files
echo 📦 Adding files to Git...
git add .

REM Commit changes
echo 💾 Committing changes...
set /p commit_msg="Enter commit message (or press Enter for default): "
if "%commit_msg%"=="" set commit_msg=Deploy SoundScape to Vercel
git commit -m "%commit_msg%"

REM Check if remote exists
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo 🔗 Setting up GitHub remote...
    set /p github_username="Enter your GitHub username: "
    set /p repo_name="Enter repository name (default: soundscape-music-app): "
    if "%repo_name%"=="" set repo_name=soundscape-music-app
    git remote add origin "https://github.com/%github_username%/%repo_name%.git"
)

REM Push to GitHub
echo ⬆️ Pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo ✅ Code pushed to GitHub!
echo.
echo Next steps:
echo 1. Go to https://vercel.com
echo 2. Sign in with GitHub
echo 3. Import your repository
echo 4. Add environment variables (see DEPLOYMENT_GUIDE.md)
echo 5. Deploy!
echo.
echo 📖 Full guide: See DEPLOYMENT_GUIDE.md
pause