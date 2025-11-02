import axios from 'axios';

/**
 * Mood to tag mapping for Last.fm API
 */
const moodToTags = {
  'Chill': ['chill', 'ambient', 'lo-fi'],
  'Happy': ['happy', 'upbeat', 'pop'],
  'Focus': ['instrumental', 'study', 'focus', 'classical'],
  'Sad': ['sad', 'melancholic', 'indie'],
  'Energetic': ['energetic', 'rock', 'electronic'],
  'Party': ['party', 'dance', 'electronic'],
  'LoFi': ['lofi', 'chillhop', 'ambient'],
  'Calm': ['calm', 'ambient', 'meditation'],
  'Workout': ['workout', 'energetic', 'motivation']
};

/**
 * Search YouTube for a video ID using track and artist
 */
async function searchYouTubeVideo(artist, title, youtubeApiKey) {
  if (!youtubeApiKey || youtubeApiKey === 'your_youtube_api_key_here') {
    console.log('YouTube API key not configured');
    return null;
  }

  try {
    const searchQuery = `${artist} ${title} music`;
    console.log(`Searching YouTube for: "${searchQuery}"`);
    
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: searchQuery,
        type: 'video',
        maxResults: 1,
        key: youtubeApiKey,
        videoCategoryId: '10', // Music category
        safeSearch: 'none',
        order: 'relevance'
      },
      timeout: 5000 // 5 second timeout
    });

    if (response.data.items && response.data.items.length > 0) {
      const videoId = response.data.items[0].id.videoId;
      console.log(`YouTube video found: ${videoId} for "${searchQuery}"`);
      return videoId;
    }
    
    console.log(`No YouTube video found for: "${searchQuery}"`);
    return null;
  } catch (error) {
    if (error.response) {
      console.error('YouTube API Error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        query: `${artist} ${title}`
      });
      
      // Check for specific error types
      if (error.response.status === 403) {
        console.error('YouTube API quota exceeded or API key invalid');
      } else if (error.response.status === 400) {
        console.error('YouTube API bad request - check API key and parameters');
      }
    } else {
      console.error('YouTube API Network Error:', error.message);
    }
    return null;
  }
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { mood } = req.query;

    if (!mood) {
      return res.status(400).json({ 
        error: 'Missing required parameter', 
        message: 'Please provide a mood query parameter' 
      });
    }

    const lastfmApiKey = process.env.LASTFM_API_KEY;
    const youtubeApiKey = process.env.YOUTUBE_API_KEY;
    
    if (!lastfmApiKey || lastfmApiKey === 'your_lastfm_api_key_here') {
      return res.status(500).json({ 
        error: 'API configuration required', 
        message: 'LASTFM_API_KEY is required. Please configure it in your environment variables.' 
      });
    }

    // Check YouTube API key validity
    let youtubeWorking = false;
    if (youtubeApiKey && youtubeApiKey !== 'your_youtube_api_key_here') {
      try {
        // Test YouTube API with a simple request
        const testResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            part: 'snippet',
            q: 'test',
            type: 'video',
            maxResults: 1,
            key: youtubeApiKey
          },
          timeout: 3000
        });
        youtubeWorking = true;
        console.log('✅ YouTube API is working');
      } catch (error) {
        console.error('❌ YouTube API test failed:', error.response?.data?.error?.message || error.message);
        console.log('🎵 Continuing without YouTube integration...');
      }
    } else {
      console.log('⚠️ YouTube API key not configured - tracks will not have audio playback');
    }

    // Get tags for the mood
    const tags = moodToTags[mood] || [mood.toLowerCase()];
    const tag = tags[0]; // Use first tag

    // Fetch tracks by tag from Last.fm
    const response = await axios.get('http://ws.audioscrobbler.com/2.0/', {
      params: {
        method: 'tag.gettoptracks',
        tag: tag,
        api_key: lastfmApiKey,
        format: 'json',
        limit: 20
      }
    });

    if (response.data.error) {
      throw new Error(response.data.message);
    }

    const tracksData = response.data.tracks?.track || [];
    
    // Process tracks with limited YouTube searches to avoid quota issues
    const tracks = [];
    const maxYouTubeSearches = 5; // Limit YouTube searches to save quota
    let youTubeSearchCount = 0;
    
    for (let i = 0; i < Math.min(tracksData.length, 20); i++) {
      const track = tracksData[i];
      const artist = track.artist?.name || 'Unknown Artist';
      const title = track.name;
      let youtubeVideoId = null;
      
      // Only search YouTube if API is working and within quota
      if (youtubeWorking && youTubeSearchCount < maxYouTubeSearches) {
        console.log(`Searching YouTube for: ${artist} - ${title} (${youTubeSearchCount + 1}/${maxYouTubeSearches})`);
        youtubeVideoId = await searchYouTubeVideo(artist, title, youtubeApiKey);
        youTubeSearchCount++;
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      tracks.push({
        id: `${artist}-${title}-${i}`,
        title: title,
        artist: artist,
        album: track.album?.title || 'Unknown Album',
        duration: Math.floor(Math.random() * 240 + 180), // 3-7 minutes (Last.fm doesn't provide duration)
        coverArt: track.image?.find(img => img.size === 'large')?.['#text'] || 
                  track.image?.find(img => img.size === 'medium')?.['#text'] ||
                  'https://via.placeholder.com/300x300?text=No+Image',
        previewUrl: youtubeVideoId ? `https://www.youtube.com/watch?v=${youtubeVideoId}` : null,
        youtubeVideoId: youtubeVideoId,
        externalUrl: track.url || null,
        source: 'lastfm',
        hasAudio: !!youtubeVideoId
      });
    }

    res.json({
      tracks: tracks,
      mood,
      source: 'lastfm',
      youtubeEnabled: youtubeWorking,
      tracksWithAudio: tracks.filter(t => t.youtubeVideoId).length,
      totalTracks: tracks.length
    });
  } catch (error) {
    console.error('Music API Error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch music', 
      message: error.response?.data?.message || error.message 
    });
  }
}