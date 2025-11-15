const PLACEHOLDER = 'PASTE_YOUR_GEMINI_API_KEY_HERE';

// Allow overriding the key at runtime by setting window.GEMINI_API_KEY before the app loads.
const runtimeKey =
  typeof window !== 'undefined' && window.GEMINI_API_KEY ? window.GEMINI_API_KEY : null;

export const GEMINI_API_KEY = runtimeKey || PLACEHOLDER;
export const GEMINI_API_KEY_PLACEHOLDER = PLACEHOLDER;
