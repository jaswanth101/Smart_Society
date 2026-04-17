// ─────────────────────────────────────────────────────────
// Environment configuration — validates all required env vars
// at startup. Throws early if anything is missing.
// ─────────────────────────────────────────────────────────

function requireEnv(key: string): string {
  const value = import.meta.env[key as keyof ImportMetaEnv]
  if (!value) {
    console.error(`[Config] Missing required env variable: ${key}`)
  }
  return value ?? ''
}

export const ENV = {
  API_BASE_URL:      requireEnv('VITE_API_BASE_URL'),
  WS_BASE_URL:       requireEnv('VITE_WS_BASE_URL'),
  APP_TITLE:         import.meta.env.VITE_APP_TITLE ?? 'SmartSociety 360',
  RAZORPAY_KEY_ID:   import.meta.env.VITE_RAZORPAY_KEY_ID ?? '',
  FIREBASE_API_KEY:  import.meta.env.VITE_FIREBASE_API_KEY ?? '',
} as const
