import React from 'react';
import { availableMoods, moodEmojis, type Mood } from '../utils/moodMap';

interface MoodSelectorProps {
  selectedMood: Mood;
  onMoodChange: (mood: Mood) => void;
}

export default function MoodSelector({ selectedMood, onMoodChange }: MoodSelectorProps) {
  return (
    <div className="mb-6">
      <label htmlFor="mood-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Select Your Mood
      </label>
      <select
        id="mood-select"
        value={selectedMood}
        onChange={(e) => onMoodChange(e.target.value as Mood)}
        className="w-full md:w-auto px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        {availableMoods.map((mood) => (
          <option key={mood} value={mood}>
            {moodEmojis[mood]} {mood}
          </option>
        ))}
      </select>
    </div>
  );
}

