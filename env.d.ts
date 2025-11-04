/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_IFLY_APP_ID?: string
  readonly VITE_IFLY_ACCESS_KEY_ID?: string
  readonly VITE_IFLY_ACCESS_KEY_SECRET?: string
  readonly VITE_IFLY_ASR_WS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
