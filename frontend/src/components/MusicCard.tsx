import React from 'react';
import { motion } from 'framer-motion';
import { Track, formatDuration } from '../utils/api';
import { usePlayer } from '../context/PlayerContext';
import { useFavorites } from '../context/FavoritesContext';

interface MusicCardProps {
  track: Track;
  playlist?: Track[];
}

export default function MusicCard({ track, playlist }: MusicCardProps) {
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const { isFavorite, toggleFavorite } = useFavorites();

  const isCurrentTrack = currentTrack?.id === track.id;

  const handlePlay = () => {
    if (playlist) {
      playTrack(track, playlist);
    } else {
      playTrack(track, [track]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer group"
    >
      <div className="relative">
        <img
          src={track.coverArt}
          alt={`${track.title} cover`}
          className="w-full h-48 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=No+Image';
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
          <button
            onClick={handlePlay}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white dark:bg-gray-900 rounded-full p-3 shadow-lg"
            aria-label={`Play ${track.title}`}
            title={track.youtubeVideoId ? 'Play track' : 'Audio not available - click to select track'}
          >
            {isCurrentTrack && isPlaying ? (
              <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Audio availability indicator */}
        {!track.youtubeVideoId && (
          <div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            No Audio
          </div>
        )}
        {isCurrentTrack && (
          <div className="absolute top-2 right-2 bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            Now Playing
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate dark:text-white">
              {track.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm truncate mt-1">
              {track.artist}
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
              {formatDuration(track.duration)}
              {!track.youtubeVideoId && (
                <span className="ml-2 text-amber-600 dark:text-amber-400">• No audio</span>
              )}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(track);
            }}
            className="ml-2 p-2 text-gray-400 hover:text-red-500 transition-colors"
            aria-label={isFavorite(track.id) ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg
              className={`w-5 h-5 ${isFavorite(track.id) ? 'fill-red-500 text-red-500' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

