/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  // 百炼 Paraformer
  readonly VITE_PF_API_KEY?: string
  readonly VITE_PF_ASR_WS?: string
  readonly VITE_PF_MODEL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
