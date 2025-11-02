/**
 * Maps weather conditions to mood keywords
 */
export const weatherToMood: Record<string, string> = {
  'Clear': 'Happy',
  'Clouds': 'LoFi',
  'Rain': 'Chill',
  'Drizzle': 'Chill',
  'Thunderstorm': 'Energetic',
  'Snow': 'Calm',
  'Mist': 'Focus',
  'Fog': 'Focus',
  'Haze': 'Focus',
};

/**
 * Available moods for user selection
 */
export const availableMoods = [
  'Chill',
  'Happy',
  'Focus',
  'Sad',
  'Energetic',
  'Party',
  'LoFi',
  'Calm',
  'Workout',
] as const;

export type Mood = typeof availableMoods[number];

/**
 * Get mood from weather condition
 */
export function getMoodFromWeather(condition: string): Mood {
  return (weatherToMood[condition] || 'Chill') as Mood;
}

/**
 * Mood emoji mapping
 */
export const moodEmojis: Record<Mood, string> = {
  'Chill': '😌',
  'Happy': '😊',
  'Focus': '🎯',
  'Sad': '😢',
  'Energetic': '⚡',
  'Party': '🎉',
  'LoFi': '🎧',
  'Calm': '🧘',
  'Workout': '💪',
};

