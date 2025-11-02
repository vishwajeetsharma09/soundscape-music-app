import axios from 'axios';

// Use relative URLs in production, localhost in development
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 
  (import.meta.env.PROD ? '' : 'http://localhost:3001');

export interface WeatherData {
  condition: string;
  temperature: number;
  description?: string;
  city?: string;
  location: {
    lat: number;
    lon: number;
  };
  source: string;
}
  
export interface Track {
  [x: string]: any;
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  coverArt: string;
  previewUrl: string | null;
  youtubeVideoId?: string | null;
  externalUrl: string | null;
  source: string;
}

export interface MusicResponse {
  tracks: Track[];
  mood: string;
  source: string;
}

/**
 * Fetch weather data from backend
 */
export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  try {
    const response = await axios.get<WeatherData>(`${API_BASE_URL}/api/weather`, {
      params: { lat, lon },
    });
    return response.data;
  } catch (error) {
    console.error('Weather fetch error:', error);
    throw error;
  }
}

/**
 * Fetch music recommendations from backend
 * Added cache-busting timestamp to ensure fresh results when mood changes
 */
export async function fetchMusic(mood: string): Promise<MusicResponse> {
  try {
    const response = await axios.get<MusicResponse>(`${API_BASE_URL}/api/music`, {
      params: { 
        mood,
        _t: Date.now() // Cache-busting parameter
      },
    });
    return response.data;
  } catch (error) {
    console.error('Music fetch error:', error);
    throw error;
  }
}

/**
 * Format duration in seconds to MM:SS
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

