# ✅ Deployment Checklist

## Before You Start
- [ ] Have valid API keys ready:
  - [ ] Last.fm API Key & Secret
  - [ ] YouTube Data API v3 Key (follow YOUTUBE_API_SETUP.md)
  - [ ] OpenWeatherMap API Key (optional)
- [ ] GitHub account created
- [ ] Vercel account created (free)

## Step 1: GitHub Setup
- [ ] Create new repository on GitHub
  - Name: `soundscape-music-app` (or your choice)
  - Set to **Public** (required for free Vercel)
  - Don't initialize with README
- [ ] Copy the repository URL

## Step 2: Push Code to GitHub
Choose one method:

### Option A: Use Helper Script (Recommended)
- [ ] **Windows:** Double-click `deploy.bat`
- [ ] **Mac/Linux:** Run `chmod +x deploy.sh && ./deploy.sh`
- [ ] Enter your GitHub username when prompted
- [ ] Enter repository name (or press Enter for default)

### Option B: Manual Git Commands
```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - SoundScape Music App"

# Add remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel
- [ ] Go to https://vercel.com
- [ ] Click "Sign up" → "Continue with GitHub"
- [ ] Authorize Vercel to access your repositories
- [ ] Click "New Project"
- [ ] Find your `soundscape-music-app` repository
- [ ] Click "Import"

## Step 4: Configure Vercel Project
- [ ] **Framework Preset:** Other
- [ ] **Root Directory:** `./` (default)
- [ ] **Build Command:** Leave empty (uses vercel.json)
- [ ] **Output Directory:** Leave empty (uses vercel.json)
- [ ] **Install Command:** Leave empty (uses vercel.json)

## Step 5: Add Environment Variables
In Vercel's Environment Variables section, add:

- [ ] `LASTFM_API_KEY` = your_actual_lastfm_key
- [ ] `LASTFM_API_SECRET` = your_actual_lastfm_secret  
- [ ] `YOUTUBE_API_KEY` = your_actual_youtube_key
- [ ] `WEATHER_API_KEY` = your_actual_weather_key (optional)
- [ ] `NODE_ENV` = production

**⚠️ Use your real API keys, not placeholder text!**

## Step 6: Deploy & Test
- [ ] Click "Deploy" button
- [ ] Wait for deployment (2-3 minutes)
- [ ] Get your Vercel URL (like: `https://soundscape-music-app.vercel.app`)
- [ ] Test the live app:
  - [ ] Weather detection works
  - [ ] Music recommendations load
  - [ ] Player appears when clicking tracks
  - [ ] Audio playback works (if YouTube API is valid)

## Step 7: Verify API Endpoints
Test these URLs (replace with your Vercel URL):
- [ ] `https://your-app.vercel.app/api/health`
- [ ] `https://your-app.vercel.app/api/weather?lat=40.7128&lon=-74.0060`
- [ ] `https://your-app.vercel.app/api/music?mood=Chill`

## Troubleshooting
If something doesn't work:

### Build Fails
- [ ] Check Vercel build logs
- [ ] Ensure all dependencies are in package.json
- [ ] Verify TypeScript compiles locally

### API Not Working
- [ ] Verify environment variables are set correctly
- [ ] Check API keys are valid
- [ ] Test YouTube API: run `node backend/test-youtube-api.js` locally

### CORS Errors
- [ ] Check browser console for errors
- [ ] Verify CORS configuration in backend/server.js

## Success! 🎉
- [ ] App is live and working
- [ ] Share your Vercel URL with friends
- [ ] Update README.md with your live demo link

## Future Updates
To update your deployed app:
```bash
# Make changes to code
git add .
git commit -m "Update: description of changes"
git push origin main
# Vercel automatically redeploys!
```

---

**Need help?** Check the full [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.