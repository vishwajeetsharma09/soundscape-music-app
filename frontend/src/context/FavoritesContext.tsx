import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Track } from '../utils/api';

interface FavoritesContextType {
  favorites: Track[];
  addFavorite: (track: Track) => void;
  removeFavorite: (trackId: string) => void;
  isFavorite: (trackId: string) => boolean;
  toggleFavorite: (track: Track) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const STORAGE_KEY = 'soundscape-favorites';

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Track[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (track: Track) => {
    setFavorites(prev => {
      if (prev.find(t => t.id === track.id)) {
        return prev; // Already favorite
      }
      return [...prev, track];
    });
  };

  const removeFavorite = (trackId: string) => {
    setFavorites(prev => prev.filter(t => t.id !== trackId));
  };

  const isFavorite = (trackId: string) => {
    return favorites.some(t => t.id === trackId);
  };

  const toggleFavorite = (track: Track) => {
    if (isFavorite(track.id)) {
      removeFavorite(track.id);
    } else {
      addFavorite(track);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}

