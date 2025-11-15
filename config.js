const PLACEHOLDER = 'AIzaSyBATF2JFP94iLQB60zOrBHnrou8eT0zOH4';

// Allow overriding the key at runtime by setting window.GEMINI_API_KEY before the app loads.
const runtimeKey =
  typeof window !== 'undefined' && window.GEMINI_API_KEY ? window.GEMINI_API_KEY : null;

export const GEMINI_API_KEY = runtimeKey || PLACEHOLDER;
export const GEMINI_API_KEY_PLACEHOLDER = PLACEHOLDER;
