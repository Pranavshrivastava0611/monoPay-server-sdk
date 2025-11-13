const cache = new Map();
const TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get cached service configuration (INTERNAL USE ONLY)
 * @private
 * @param {string} apiKey
 * @returns {Object|null}
 */
export function getCachedService(apiKey) {
  const item = cache.get(apiKey);
  if (!item) return null;

  if (Date.now() - item.time > TTL) {
    cache.delete(apiKey);
    return null;
  }

  return item.data;
}

/**
 * Set service configuration in cache (INTERNAL USE ONLY)
 * @private
 * @param {string} apiKey
 * @param {Object} data
 */
export function setCachedService(apiKey, data) {
  cache.set(apiKey, { data, time: Date.now() });
}

