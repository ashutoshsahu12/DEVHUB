// GitHub API Utility with Caching and Rate Limit Detection

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes cache TTL

export async function fetchWithCache(url) {
  const cacheKey = `devhub_cache_${url}`;
  const cachedData = localStorage.getItem(cacheKey);
  const cachedTime = localStorage.getItem(`${cacheKey}_time`);

  // Return cached data if valid
  if (cachedData && cachedTime && (Date.now() - parseInt(cachedTime) < CACHE_DURATION)) {
    return {
      data: JSON.parse(cachedData),
      fromCache: true,
      rateLimitRemaining: localStorage.getItem('devhub_ratelimit_remaining') || '60',
      rateLimitReset: localStorage.getItem('devhub_ratelimit_reset') || null
    };
  }

  try {
    const response = await fetch(url);

    // Extract rate limit headers
    const remaining = response.headers.get('X-RateLimit-Remaining');
    const reset = response.headers.get('X-RateLimit-Reset');

    if (remaining !== null) {
      localStorage.setItem('devhub_ratelimit_remaining', remaining);
    }
    if (reset !== null) {
      localStorage.setItem('devhub_ratelimit_reset', reset);
    }

    if (!response.ok) {
      if (response.status === 403 && remaining === '0') {
        throw new Error('GitHub API rate limit exceeded. Please wait a few minutes before searching again.');
      }
      if (response.status === 404) {
        throw new Error('Resource not found on GitHub.');
      }
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Store in cache
    localStorage.setItem(cacheKey, JSON.stringify(data));
    localStorage.setItem(`${cacheKey}_time`, Date.now().toString());

    return {
      data,
      fromCache: false,
      rateLimitRemaining: remaining,
      rateLimitReset: reset
    };
  } catch (err) {
    throw err;
  }
}

export function getRateLimitStatus() {
  return {
    remaining: localStorage.getItem('devhub_ratelimit_remaining') || '60',
    reset: localStorage.getItem('devhub_ratelimit_reset')
  };
}