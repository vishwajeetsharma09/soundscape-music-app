import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchWeather, fetchMusic, type Track, type WeatherData } from '../utils/api';
import { getMoodFromWeather, type Mood, moodEmojis } from '../utils/moodMap';
import MusicCard from '../components/MusicCard';
import MoodSelector from '../components/MoodSelector';
import { usePlayer } from '../context/PlayerContext';

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedMood, setSelectedMood] = useState<Mood>('Chill');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { playTrack } = usePlayer();

  // Fetch weather and set initial mood
  useEffect(() => {
    const getLocationAndWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        setLocationError(null);

        // Get user's location
        if (!navigator.geolocation) {
          throw new Error('Geolocation is not supported by your browser');
        }

        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: false,
          });
        });

        const { latitude, longitude } = position.coords;

        // Fetch weather
        const weatherData = await fetchWeather(latitude, longitude);
        setWeather(weatherData);

        // Set mood based on weather
        const detectedMood = getMoodFromWeather(weatherData.condition);
        setSelectedMood(detectedMood);

        // Fetch music for detected mood
        const musicData = await fetchMusic(detectedMood);
        console.log('Track data:', musicData.tracks.map(t => ({
          title: t.title,
          hasPreview: !!t.previewUrl,
          previewUrl: t.previewUrl
        })));
        setTracks(musicData.tracks);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to get location';

        if (errorMessage.includes('timeout') || errorMessage.includes('denied')) {
          setLocationError('Location access denied or timed out. Using default mood.');
          // Use default mood
          const defaultMood: Mood = 'Chill';
          setSelectedMood(defaultMood);
          const musicData = await fetchMusic(defaultMood);
          setTracks(musicData.tracks);
        } else {
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    getLocationAndWeather();
  }, []);

  // Fetch music when mood changes
  useEffect(() => {
    const loadMusic = async () => {
      try {
        setLoading(true);
        setError(null);
        const musicData = await fetchMusic(selectedMood);
        console.log('Track data:', musicData.tracks.map(t => ({
          title: t.title,
          hasPreview: !!t.previewUrl,
          previewUrl: t.previewUrl
        })));
        setTracks(musicData.tracks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load music');
      } finally {
        setLoading(false);
      }
    };

    loadMusic();
  }, [selectedMood]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Weather & Mood Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
          Welcome to SoundScape
        </h1>

        {weather && (
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-lg p-6 text-white mb-6 shadow-lg">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Current Weather</h2>
                <p className="text-lg">
                  {weather.city && `${weather.city} • `}
                  {weather.condition} • {Math.round(weather.temperature)}°C
                </p>
                {weather.description && (
                  <p className="text-sm opacity-90 mt-1">{weather.description}</p>
                )}
              </div>
              <div className="text-6xl">
                {weather.condition === 'Clear' && '☀️'}
                {weather.condition === 'Clouds' && '☁️'}
                {weather.condition === 'Rain' && '🌧️'}
                {weather.condition === 'Snow' && '❄️'}
                {weather.condition === 'Thunderstorm' && '⛈️'}
                {!['Clear', 'Clouds', 'Rain', 'Snow', 'Thunderstorm'].includes(weather.condition) && '🌤️'}
              </div>
            </div>
          </div>
        )}

        {locationError && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">{locationError}</p>
          </div>
        )}

        <div className="flex items-center gap-4 mb-6">
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Detected Mood:</span>
            <span className="ml-2 text-2xl font-semibold text-primary-600 dark:text-primary-400">
              {moodEmojis[selectedMood]} {selectedMood}
            </span>
          </div>
        </div>

        <MoodSelector selectedMood={selectedMood} onMoodChange={setSelectedMood} />
      </motion.div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Finding playable tracks...</p>
        </div>
      )}

      {/* Music Grid */}
      {!loading && tracks.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Playable Tracks ({tracks.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <MusicCard track={track} playlist={tracks} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && tracks.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No tracks with previews found for this mood.</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Try selecting a different mood or check back later.</p>
        </div>
      )}
    </div>
  );
}

