/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_DEMO_OFFICER_USERNAME?: string;
  readonly VITE_DEMO_OFFICER_PASSWORD?: string;
  readonly VITE_OPERATING_MODE?: "LIVE" | "MOCK" | "DEMO_FIXTURE";
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
