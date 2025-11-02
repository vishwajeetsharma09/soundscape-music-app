import apicache from 'apicache';

// Configure cache
const cache = apicache.middleware;

// Cache options
const onlyStatus200 = (req, res) => res.statusCode === 200;
const cacheSuccesses = cache('5 minutes', onlyStatus200);

// Weather cache - 10 minutes (weather doesn't change frequently)
export const weatherCache = cache('10 minutes', onlyStatus200);

// Music cache - 5 minutes (music recommendations can be cached)
export const musicCache = cache('5 minutes', onlyStatus200);

export default cache;

