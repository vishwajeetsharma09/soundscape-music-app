# 🎵 SoundScape – Music Mood Explorer

A modern, full-stack web application that recommends music based on your mood and current weather conditions. Built with React, TypeScript, Node.js, and Express.

## ✨ Features

- **🌦️ Weather-Based Mood Detection**: Automatically detects your location and maps weather conditions to musical moods
- **🎶 Smart Music Recommendations**: Fetches personalized track recommendations based on your selected mood
- **🎧 Custom Audio Player**: Full-featured player with play/pause, next/previous, and progress controls
- **❤️ Favorites System**: Save your favorite tracks with persistent localStorage storage
- **🌓 Dark/Light Mode**: Toggle between themes with preference persistence
- **📱 Responsive Design**: Mobile-first layout with adaptive navigation (bottom tabs on mobile, top nav on desktop)
- **✨ Smooth Animations**: Beautiful page transitions powered by Framer Motion

## 🛠️ Tech Stack

### Frontend
- **React 18+** with **TypeScript** (strict mode)
- **Vite** for fast development and builds
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **React Context API** for state management
- **React Router** for navigation

### Backend
- **Node.js** with **Express**
- **CORS** middleware for cross-origin requests
- **Rate Limiting** to prevent API abuse
- **Caching** for optimized API responses

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- **Required API Keys:**
  - [Last.fm API Key](https://www.last.fm/api) (free, no credit card required) - **REQUIRED**
  - [YouTube Data API v3 Key](https://console.cloud.google.com/) (free tier available) - **REQUIRED for audio playback**
  - [OpenWeatherMap API Key](https://openweathermap.org/api) (optional - falls back to free Open-Meteo if not provided)

### 🌐 Live Demo
**Deployed Version:** [Coming Soon - Deploy with Vercel!]

### 📦 Quick Deploy to Vercel
1. **Fork this repository** on GitHub
2. **Sign up at [Vercel](https://vercel.com)** with GitHub
3. **Import your forked repository**
4. **Add environment variables** (see DEPLOYMENT_GUIDE.md)
5. **Deploy!** 🚀

**Detailed deployment guide:** See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd "New folder"
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables** (REQUIRED)

   Create a `.env` file in the `backend` directory:
   ```env
   # Required for music recommendations
   LASTFM_API_KEY=your_lastfm_api_key_here
   LASTFM_API_SECRET=your_lastfm_api_secret_here
   
   # Required for audio playback
   YOUTUBE_API_KEY=your_youtube_api_key_here
   
   # Optional - falls back to free Open-Meteo if not provided
   WEATHER_API_KEY=your_openweathermap_api_key_here
   
   PORT=3001
   ```

   **How to get API keys:**
   - **Last.fm**: Go to https://www.last.fm/api and create a free account. Register an application to get your API key and secret.
   - **YouTube Data API v3**: 
     1. Go to https://console.cloud.google.com/
     2. Create a new project (or select existing)
     3. Enable "YouTube Data API v3"
     4. Create credentials (API Key)
     5. Copy your API key to `.env`
   - **OpenWeatherMap** (optional): https://openweathermap.org/api - free tier available

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   # or for development with auto-reload:
   npm run dev
   ```
   The backend will run on `http://localhost:3001`

2. **Start the frontend development server** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

3. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
soundscape/
├── backend/
│   ├── routes/
│   │   ├── weatherRoutes.js    # Weather API endpoint
│   │   └── musicRoutes.js      # Music recommendations endpoint
│   ├── middleware/
│   │   ├── rateLimiter.js      # Rate limiting middleware
│   │   └── cache.js            # API response caching
│   ├── server.js                # Express server setup
│   ├── package.json
│   └── .env                     # Environment variables (create this)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MusicCard.tsx   # Individual track card component
│   │   │   ├── Player.tsx      # Audio player component
│   │   │   ├── MoodSelector.tsx # Mood dropdown selector
│   │   │   ├── Header.tsx      # Navigation header
│   │   │   └── Layout.tsx      # Main layout wrapper
│   │   ├── context/
│   │   │   ├── PlayerContext.tsx    # Global audio player state
│   │   │   ├── ThemeContext.tsx     # Dark/light theme state
│   │   │   └── FavoritesContext.tsx # Favorites management
│   │   ├── pages/
│   │   │   ├── Home.tsx        # Main page with weather & recommendations
│   │   │   ├── Favorites.tsx   # Favorites collection page
│   │   │   └── NotFound.tsx    # 404 page
│   │   ├── utils/
│   │   │   ├── api.ts          # API utility functions
│   │   │   └── moodMap.ts      # Weather-to-mood mapping
│   │   ├── App.tsx             # Root component with routing
│   │   └── main.tsx            # Application entry point
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

## 🔌 API Endpoints

### Backend Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/weather?lat={latitude}&lon={longitude}` - Fetch weather data
- `GET /api/music?mood={mood}` - Get music recommendations by mood

### Example Requests

```bash
# Get weather for coordinates
curl "http://localhost:3001/api/weather?lat=40.7128&lon=-74.0060"

# Get music for a mood
curl "http://localhost:3001/api/music?mood=Chill"
```

## 🌦️ Weather to Mood Mapping

| Weather Condition | Suggested Mood |
|-------------------|----------------|
| Clear            | Happy          |
| Clouds           | LoFi           |
| Rain             | Chill          |
| Thunderstorm     | Energetic      |
| Snow             | Calm           |
| Mist/Fog         | Focus          |

## 🎨 Available Moods

- 😌 Chill
- 😊 Happy
- 🎯 Focus
- 😢 Sad
- ⚡ Energetic
- 🎉 Party
- 🎧 LoFi
- 🧘 Calm
- 💪 Workout

## 🎯 Key Features Explained

### Weather Detection
- Uses browser Geolocation API to detect user location
- Falls back gracefully if location access is denied
- Maps weather conditions to musical moods automatically

### Music Recommendations
- Integrates with Last.fm API (with fallback to mock data)
- Fetches 15-20 tracks per mood
- Displays track info with cover art, artist, and duration

### Audio Player
- Persistent playback state across page navigation
- Progress bar with seek functionality
- Playlist support with next/previous controls
- Note: Actual audio playback requires preview URLs from music APIs

### Favorites
- Save tracks to favorites with one click
- Persisted in browser localStorage
- Accessible from dedicated Favorites page

### Responsive Design
- Mobile-first approach
- Bottom tab navigation on mobile (≤480px)
- Top navigation bar on desktop (≥1024px)
- Adaptive grid layouts for music cards

## 🐛 Troubleshooting

### API Configuration Errors
- **"LASTFM_API_KEY is required"**: Make sure you've created a `.env` file in the `backend` directory with your Last.fm API key
- **"Failed to fetch music"**: Verify your Last.fm API key is correct and the backend server is running
- **No audio playback**: Ensure `YOUTUBE_API_KEY` is set in `.env` and YouTube Data API v3 is enabled in Google Cloud Console

### Location Access Denied
- The app will automatically use a default mood ("Chill") if location access is denied
- You can manually select a different mood using the dropdown

### API Rate Limits
- Backend includes rate limiting (60 requests per 15 minutes for music/weather endpoints)
- YouTube API has a quota limit (10,000 units per day on free tier)
- If you hit limits, wait a few minutes before trying again

### No Audio Playing
- Check that `YOUTUBE_API_KEY` is properly configured
- Verify YouTube Data API v3 is enabled in Google Cloud Console
- Check browser console for YouTube API errors
- Some videos may have playback restrictions (region, age restrictions)

## 📝 Development Notes

- **TypeScript**: Strict mode enabled for type safety
- **State Management**: React Context API (no Redux needed)
- **Styling**: TailwindCSS with custom color scheme
- **Animations**: Framer Motion for smooth transitions
- **Audio Playback**: Uses YouTube IFrame Player API for actual audio streaming
- **API Integration**: Requires Last.fm API for music data and YouTube Data API v3 for audio playback

## 🔮 Future Enhancements

- [ ] Spotify/Deezer integration as alternative audio source
- [ ] User authentication and cloud favorites sync
- [ ] Playlist creation and sharing
- [ ] Music history tracking
- [ ] Advanced filtering and search
- [ ] Social features (share playlists)
- [ ] Offline mode with cached tracks

## 📄 License

This project is open source and available for educational purposes.

## 🚀 Deployment

### Deploy to Vercel (Recommended)
This app is optimized for Vercel deployment with automatic GitHub integration.

**Quick Deploy:**
```bash
# Windows users
deploy.bat

# Mac/Linux users  
chmod +x deploy.sh
./deploy.sh
```

**Manual Deploy:**
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy!

**Full Guide:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### Other Platforms
- **Netlify**: Requires serverless function configuration
- **Railway**: Good alternative for full-stack apps
- **Heroku**: Requires Procfile and build configuration

## 🙏 Acknowledgments

- Weather data: OpenWeatherMap & Open-Meteo
- Music data: Last.fm API
- Icons: Heroicons
- Design inspiration: Modern music streaming apps

---

**Built with ❤️ using React, TypeScript, and Node.js**

