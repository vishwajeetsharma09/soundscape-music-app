import { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { Track } from '../utils/api';

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playlist: Track[];
  currentIndex: number;
  playTrack: (track: Track, playlist?: Track[]) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setTime: (time: number) => void;
  togglePlay: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setIsPlaying: (playing: boolean) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

// Declare YouTube API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

// Load YouTube IFrame API script
const loadYouTubeAPI = (): Promise<void> => {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }
    
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    
    window.onYouTubeIframeAPIReady = () => {
      resolve();
    };
  });
};

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const youtubePlayerRef = useRef<any>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeUpdateInterval = useRef<NodeJS.Timeout | null>(null);

  // Initialize YouTube API and audio element
  useEffect(() => {
    let mounted = true;

    const initializePlayer = async () => {
      try {
        await loadYouTubeAPI();
      } catch (error) {
        console.warn('Failed to load YouTube API:', error);
      }
      
      // Initialize HTML5 audio as fallback
      if (mounted) {
        audioRef.current = new Audio();
        const audio = audioRef.current;
        
        audio.addEventListener('timeupdate', () => {
          if (mounted) setCurrentTime(audio.currentTime);
        });

        audio.addEventListener('loadedmetadata', () => {
          if (mounted) setDuration(audio.duration);
        });

        audio.addEventListener('ended', () => {
          if (mounted) {
            nextTrack();
          }
        });
      }
    };

    initializePlayer();

    return () => {
      mounted = false;
      if (youtubePlayerRef.current) {
        try {
          youtubePlayerRef.current.destroy();
        } catch (e) {
          // Ignore errors during cleanup
        }
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      if (timeUpdateInterval.current) {
        clearInterval(timeUpdateInterval.current);
      }
    };
  }, []);

  // Create or update YouTube player
  const createYouTubePlayer = (videoId: string) => {
    return new Promise<void>((resolve, reject) => {
      if (!window.YT || !window.YT.Player) {
        console.log('YouTube API not loaded, loading now...');
        loadYouTubeAPI().then(() => {
          createYouTubePlayer(videoId).then(resolve).catch(reject);
        }).catch(reject);
        return;
      }

      // Destroy existing player
      if (youtubePlayerRef.current) {
        try {
          youtubePlayerRef.current.destroy();
        } catch (e) {
          console.warn('Error destroying previous player:', e);
        }
      }

      // Create container if it doesn't exist
      let container = document.getElementById('youtube-player-container') as HTMLDivElement | null;
      if (!container) {
        container = document.createElement('div');
        container.id = 'youtube-player-container';
        container.style.position = 'fixed';
        container.style.top = '-9999px';
        container.style.left = '-9999px';
        container.style.width = '1px';
        container.style.height = '1px';
        document.body.appendChild(container);
        playerContainerRef.current = container;
      }

      console.log('Creating YouTube player with videoId:', videoId);

      try {
        youtubePlayerRef.current = new window.YT.Player('youtube-player-container', {
          height: '1',
          width: '1',
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            enablejsapi: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            loop: 0,
            mute: 0,
          },
          events: {
            onReady: (event: any) => {
              console.log('YouTube player ready');
              try {
                // Get initial duration
                const dur = event.target.getDuration();
                if (dur) {
                  setDuration(dur);
                }
                // Start playing
                event.target.playVideo();
                resolve();
              } catch (error) {
                console.error('Error in onReady:', error);
                reject(error);
              }
            },
            onStateChange: (event: any) => {
              // YT.PlayerState.ENDED = 0
              // YT.PlayerState.PLAYING = 1
              // YT.PlayerState.PAUSED = 2
              // YT.PlayerState.BUFFERING = 3
              // YT.PlayerState.CUED = 5
              const state = event.data;
              console.log('YouTube player state changed:', state);
              
              if (state === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                // Start time update interval
                if (timeUpdateInterval.current) {
                  clearInterval(timeUpdateInterval.current);
                }
                timeUpdateInterval.current = setInterval(() => {
                  if (youtubePlayerRef.current) {
                    try {
                      const current = youtubePlayerRef.current.getCurrentTime();
                      const dur = youtubePlayerRef.current.getDuration();
                      if (current !== null && current !== undefined) {
                        setCurrentTime(current);
                      }
                      if (dur && dur > 0) {
                        setDuration(dur);
                      }
                    } catch (e) {
                      // Ignore errors
                    }
                  }
                }, 100);
              } else if (state === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false);
                if (timeUpdateInterval.current) {
                  clearInterval(timeUpdateInterval.current);
                }
              } else if (state === window.YT.PlayerState.ENDED) {
                setIsPlaying(false);
                if (timeUpdateInterval.current) {
                  clearInterval(timeUpdateInterval.current);
                }
                setCurrentTime(0);
                // Auto-play next track
                setTimeout(() => {
                  nextTrack();
                }, 500);
              } else if (state === window.YT.PlayerState.BUFFERING) {
                console.log('YouTube player buffering...');
              }
            },
            onError: (event: any) => {
              console.error('YouTube player error:', event.data);
              setIsPlaying(false);
              reject(new Error(`YouTube player error: ${event.data}`));
            }
          }
        });
      } catch (error) {
        console.error('Failed to create YouTube player:', error);
        reject(error);
      }
    });
  };

  const nextTrack = () => {
    if (playlist.length > 0) {
      const nextIndex = (currentIndex + 1) % playlist.length;
      setCurrentIndex(nextIndex);
      playTrack(playlist[nextIndex], playlist);
    }
  };

  const playTrack = async (track: Track, newPlaylist?: Track[]) => {
    console.log('🎵 Playing track:', track.title, 'by', track.artist);
    console.log('Track data:', {
      youtubeVideoId: track.youtubeVideoId,
      previewUrl: track.previewUrl,
      hasAudio: track.hasAudio
    });

    if (newPlaylist) {
      setPlaylist(newPlaylist);
      const index = newPlaylist.findIndex(t => t.id === track.id);
      setCurrentIndex(index >= 0 ? index : 0);
    }

    // Stop current playback
    if (youtubePlayerRef.current) {
      try {
        youtubePlayerRef.current.stopVideo();
      } catch (e) {
        // Ignore
      }
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    if (timeUpdateInterval.current) {
      clearInterval(timeUpdateInterval.current);
    }

    setCurrentTrack(track);
    setCurrentTime(0);
    setIsPlaying(false);

    // Check if we have a YouTube video ID
    if (track.youtubeVideoId) {
      console.log('🎬 Playing track with YouTube video ID:', track.youtubeVideoId);
      try {
        await createYouTubePlayer(track.youtubeVideoId);
        // Player will auto-play from onReady event
        return;
      } catch (error) {
        console.error('❌ Failed to create YouTube player:', error);
      }
    }

    // Fallback to HTML5 audio if we have a direct audio URL
    if (track.previewUrl && audioRef.current) {
      const isAudioFile = /\.(mp3|ogg|wav|m4a|aac)(\?|$)/i.test(track.previewUrl);
      if (isAudioFile) {
        console.log('🎧 Playing with HTML5 audio:', track.previewUrl);
        audioRef.current.src = track.previewUrl;
        audioRef.current.play().catch(err => {
          console.warn('Audio play failed:', err);
          setIsPlaying(false);
        });
        setIsPlaying(true);
        setDuration(track.duration || 180);
        return;
      }
    }

    // If no audio source available, show message but still set as current track
    console.warn('⚠️ No audio source available for track:', track.title);
    console.log('💡 Track will be shown as current but cannot play audio');
    setDuration(track.duration || 180);
    // Don't set isPlaying to true since we can't actually play
  };

  const pauseTrack = () => {
    if (youtubePlayerRef.current) {
      try {
        youtubePlayerRef.current.pauseVideo();
        setIsPlaying(false);
      } catch (e) {
        console.error('Error pausing YouTube player:', e);
      }
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (timeUpdateInterval.current) {
      clearInterval(timeUpdateInterval.current);
    }
    setIsPlaying(false);
  };

  const resumeTrack = () => {
    if (youtubePlayerRef.current) {
      try {
        const state = youtubePlayerRef.current.getPlayerState();
        console.log('Resuming YouTube player, current state:', state);
        youtubePlayerRef.current.playVideo();
        setIsPlaying(true);
      } catch (e) {
        console.error('Error resuming YouTube player:', e);
      }
    }
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.warn('Audio play failed:', err);
      });
      setIsPlaying(true);
    }
  };

  const previousTrack = () => {
    if (playlist.length > 0) {
      const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
      setCurrentIndex(prevIndex);
      playTrack(playlist[prevIndex], playlist);
    }
  };

  const setTime = (time: number) => {
    if (youtubePlayerRef.current) {
      try {
        youtubePlayerRef.current.seekTo(time, true);
        setCurrentTime(time);
      } catch (e) {
        // Ignore
      }
    }
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        playlist,
        currentIndex,
        playTrack,
        pauseTrack,
        resumeTrack,
        nextTrack,
        previousTrack,
        setTime,
        togglePlay,
        setCurrentTime,
        setDuration,
        setIsPlaying,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
