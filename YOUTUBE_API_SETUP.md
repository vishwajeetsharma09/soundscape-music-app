# YouTube API Setup Guide

## Current Issue
The YouTube API key in your `.env` file is invalid, which is why you're getting 400 errors and no audio playback.

## How to Get a Valid YouTube API Key

### Step 1: Go to Google Cloud Console
1. Visit https://console.cloud.google.com/
2. Sign in with your Google account

### Step 2: Create or Select a Project
1. Click on the project dropdown at the top
2. Either select an existing project or click "New Project"
3. If creating new: Give it a name like "SoundScape Music App"

### Step 3: Enable YouTube Data API v3
1. Go to "APIs & Services" > "Library"
2. Search for "YouTube Data API v3"
3. Click on it and press "Enable"

### Step 4: Create API Key
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key

### Step 5: (Optional) Restrict the API Key
1. Click on your API key to edit it
2. Under "API restrictions", select "Restrict key"
3. Choose "YouTube Data API v3"
4. Save

### Step 6: Update Your .env File
Replace the current `YOUTUBE_API_KEY` in `backend/.env` with your new key:

```env
YOUTUBE_API_KEY=your_new_api_key_here
```

### Step 7: Test the API
Run this command from the backend directory:
```bash
node test-youtube-api.js
```

You should see "✅ YouTube API is working!" if everything is set up correctly.

## Important Notes

- **Free Quota**: YouTube Data API v3 has a free quota of 10,000 units per day
- **Each search costs ~100 units**, so you can do about 100 searches per day
- The app is configured to only search YouTube for the first 5 tracks to conserve quota
- If you exceed the quota, you'll need to wait until the next day or set up billing

## Alternative: Use Without YouTube
The app will work without YouTube API - tracks just won't have audio playback. Users can still:
- Browse music recommendations
- See track information
- Click on external links to listen elsewhere
- Add tracks to favorites

## Troubleshooting

### "API key not valid" Error
- Make sure you copied the entire API key
- Ensure YouTube Data API v3 is enabled
- Check if there are any IP restrictions on the key

### "Quota exceeded" Error
- You've used up your daily quota
- Wait until tomorrow or enable billing for higher limits

### Still having issues?
- Double-check the API key in your `.env` file
- Restart the backend server after updating the `.env` file
- Make sure there are no extra spaces in the API key