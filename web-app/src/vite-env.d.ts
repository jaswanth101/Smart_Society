/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_WS_BASE_URL: string
  readonly VITE_APP_TITLE: string
  readonly VITE_RAZORPAY_KEY_ID: string
  readonly VITE_FIREBASE_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
