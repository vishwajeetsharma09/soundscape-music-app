# 🚀 SoundScape Deployment Guide - GitHub + Vercel

## Prerequisites
- GitHub account
- Vercel account (free)
- Valid API keys (Last.fm, YouTube, OpenWeatherMap)

## Step 1: Prepare Your Repository

### 1.1 Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit - SoundScape Music App"
```

### 1.2 Create GitHub Repository
1. Go to https://github.com
2. Click "New repository" (green button)
3. Repository name: `soundscape-music-app`
4. Description: `Weather-based music mood explorer built with React & Node.js`
5. Set to **Public** (required for free Vercel deployment)
6. **Don't** initialize with README (we already have files)
7. Click "Create repository"

### 1.3 Connect Local Repository to GitHub
```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/soundscape-music-app.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### 2.1 Sign Up/Login to Vercel
1. Go to https://vercel.com
2. Click "Sign up" or "Login"
3. **Choose "Continue with GitHub"** (recommended)
4. Authorize Vercel to access your GitHub account

### 2.2 Import Your Project
1. On Vercel dashboard, click "New Project"
2. Find your `soundscape-music-app` repository
3. Click "Import"

### 2.3 Configure Project Settings
**Framework Preset:** Other
**Root Directory:** `./` (leave as default)
**Build Command:** Leave empty (will use vercel.json configuration)
**Output Directory:** Leave empty (will use vercel.json configuration)
**Install Command:** Leave empty (will use vercel.json configuration)

### 2.4 Add Environment Variables
In the "Environment Variables" section, add these:

```
LASTFM_API_KEY=your_lastfm_api_key_here
LASTFM_API_SECRET=your_lastfm_secret_here
YOUTUBE_API_KEY=your_youtube_api_key_here
WEATHER_API_KEY=your_openweather_api_key_here
NODE_ENV=production
```

**⚠️ Important:** Use your actual API keys, not the placeholder text!

### 2.5 Deploy
1. Click "Deploy"
2. Wait for deployment to complete (2-3 minutes)
3. You'll get a URL like: `https://soundscape-music-app.vercel.app`

## Step 3: Test Your Deployment

### 3.1 Test the Application
1. Visit your Vercel URL
2. Allow location access
3. Check if weather detection works
4. Try selecting different moods
5. Click on music tracks to test player

### 3.2 Test API Endpoints
```bash
# Replace YOUR_VERCEL_URL with your actual URL
curl "https://your-app.vercel.app/api/health"
curl "https://your-app.vercel.app/api/weather?lat=40.7128&lon=-74.0060"
curl "https://your-app.vercel.app/api/music?mood=Chill"
```

## Step 4: Configure Custom Domain (Optional)

### 4.1 Add Custom Domain
1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Step 5: Set Up Automatic Deployments

### 5.1 Enable Auto-Deploy
- Vercel automatically deploys when you push to `main` branch
- Every commit triggers a new deployment
- Preview deployments for pull requests

### 5.2 Future Updates
```bash
# Make changes to your code
git add .
git commit -m "Update: description of changes"
git push origin main
# Vercel will automatically deploy the changes
```

## Troubleshooting

### Common Issues:

#### 1. Build Fails
**Error:** `Command "npm run build" exited with 1`
**Solution:** 
- Check if all dependencies are in `package.json`
- Ensure TypeScript compiles without errors
- Check build logs in Vercel dashboard

#### 2. API Routes Not Working
**Error:** `404 on /api/...` endpoints
**Solution:**
- Verify `vercel.json` is in root directory
- Check that backend files are in `backend/` folder
- Ensure environment variables are set

#### 3. CORS Errors
**Error:** `Access to fetch blocked by CORS policy`
**Solution:**
- Verify CORS configuration in `backend/server.js`
- Check that frontend is making requests to correct API URL

#### 4. Environment Variables Not Working
**Error:** API keys undefined in production
**Solution:**
- Double-check environment variables in Vercel dashboard
- Ensure variable names match exactly
- Redeploy after adding variables

#### 5. YouTube API Still Not Working
**Error:** Still getting 400 errors
**Solution:**
- Test API key locally first: `node backend/test-youtube-api.js`
- Ensure YouTube Data API v3 is enabled
- Check API key restrictions in Google Cloud Console

## Performance Tips

### 1. Optimize Images
- Use WebP format for better compression
- Implement lazy loading for album covers

### 2. Cache API Responses
- Already implemented with 5-10 minute caching
- Consider Redis for production scaling

### 3. Monitor Usage
- Check Vercel analytics
- Monitor API quotas (YouTube: 10,000 units/day)
- Set up error tracking (Sentry)

## Security Best Practices

### 1. API Keys
- Never commit API keys to Git
- Use Vercel environment variables
- Rotate keys periodically

### 2. Rate Limiting
- Already implemented (60 requests/15 minutes)
- Monitor for abuse in Vercel logs

### 3. CORS
- Configured for Vercel domains
- Restrict to specific origins in production

## Monitoring & Maintenance

### 1. Check Vercel Dashboard
- Monitor deployment status
- Check function logs
- Review performance metrics

### 2. API Quotas
- YouTube: 10,000 units/day (free)
- Last.fm: Usually unlimited for personal use
- OpenWeatherMap: 1,000 calls/day (free)

### 3. Updates
- Keep dependencies updated
- Monitor for security vulnerabilities
- Test new features in preview deployments

## Success! 🎉

Your SoundScape app should now be live at your Vercel URL. Users can:
- Get weather-based music recommendations
- Browse tracks by mood
- Play music (if YouTube API is configured)
- Save favorites
- Switch between light/dark themes

Share your app with friends and enjoy your deployed music mood explorer!