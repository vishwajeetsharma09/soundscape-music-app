import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../context/PlayerContext';
import { formatDuration } from '../utils/api';

export default function Player() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    nextTrack,
    previousTrack,
    setTime,
    togglePlay,
    playlist,
    currentIndex,
  } = usePlayer();

  const [isMobile, setIsMobile] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Note: Audio handling is now managed by PlayerContext
  // This component just displays the UI and controls

  // Handle seek
  const handleSeek = (value: number) => {
    setTime(value);
  };

  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const hasPreview = currentTrack.previewUrl;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50"
        style={{ bottom: isMobile ? '56px' : '0' }}
      >
        {/* Hidden audio element */}
        <audio ref={audioRef} preload="auto" />

        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Album Art & Track Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <img
                src={currentTrack.coverArt}
                alt={`${currentTrack.title} cover`}
                className="w-16 h-16 rounded-lg object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x64?text=No+Image';
                }}
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold truncate dark:text-white">
                  {currentTrack.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {currentTrack.artist}
                </p>
                {!hasPreview && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                    Preview not available
                  </p>
                )}
                {currentTrack.spotifyUrl && (
                  <a
                    href={currentTrack.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary-600 dark:text-primary-400 hover:underline mt-0.5 inline-block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Listen on Spotify ↗
                  </a>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={previousTrack}
                disabled={playlist.length <= 1}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous track"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                </svg>
              </button>

              <button
                onClick={togglePlay}
                disabled={!hasPreview}
                className="p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={isPlaying ? 'Pause' : 'Play'}
                title={!hasPreview ? 'Preview not available for this track' : ''}
              >
                {isPlaying ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              <button
                onClick={nextTrack}
                disabled={playlist.length <= 1}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next track"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832l10-5a1 1 0 000-1.664l-10-5zM14 6L4 11v2l10 5V6z" />
                </svg>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="hidden md:flex items-center gap-2 flex-1 min-w-0 max-w-xs">
              <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums">
                {formatDuration(Math.floor(currentTime))}
              </span>
              <div className="flex-1 relative h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="absolute h-full bg-primary-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => handleSeek(Number(e.target.value))}
                  disabled={!hasPreview}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  aria-label="Seek"
                />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums">
                {formatDuration(Math.floor(duration))}
              </span>
            </div>
          </div>

          {/* Mobile Progress Bar */}
          <div className="md:hidden mt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums">
                {formatDuration(Math.floor(currentTime))}
              </span>
              <div className="flex-1 relative h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="absolute h-full bg-primary-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => handleSeek(Number(e.target.value))}
                  disabled={!hasPreview}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  aria-label="Seek"
                />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums">
                {formatDuration(Math.floor(duration))}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}