// ============================================================================
// 🎯 src/lib/supabase.ts — klient Supabase dla panelu MBS
// ----------------------------------------------------------------------------
// supabase      — client-safe (anon, RLS), używany w kodzie przeglądarki (rzadko)
// supabaseAdmin — server-only (service_role, omija RLS). TYLKO w API routes.
// Moduł NIE rzuca wyjątku przy braku env, żeby statyczny build strony zawsze
// przechodził — API routes same sprawdzają, czy `supabaseAdmin` istnieje.
// ============================================================================

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const URL = import.meta.env.PUBLIC_SUPABASE_URL;
const ANON = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = import.meta.env.SUPABASE_SERVICE_ROLE; // server-only, NIE PUBLIC_

export const supabase: SupabaseClient | null =
  URL && ANON
    ? createClient(URL, ANON, { auth: { persistSession: false, autoRefreshToken: false } })
    : null;

export const supabaseAdmin: SupabaseClient | null =
  URL && SERVICE
    ? createClient(URL, SERVICE, { auth: { persistSession: false, autoRefreshToken: false } })
    : null;

// ============================================================================
// TYPES
// ============================================================================
export interface Zadanie {
  id: number;
  tresc: string;
  owner: 'mike' | 'marcin' | 'klaudiusz' | 'team';
  status: 'todo' | 'inprogress' | 'done';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Publikacja {
  id: number;
  tytul: string;
  platforma: 'yt' | 'tt' | 'ig' | 'fb' | 'newsletter' | 'blog';
  status: 'pomysl' | 'wprodukcji' | 'zaplanowane' | 'opublikowane';
  data_pub: string | null;
  link: string | null;
  notatka: string | null;
  created_at: string;
  updated_at: string;
}

export interface Rozdzial {
  id: number;
  nr: number;
  tytul: string;
  status: 'szkic' | 'wpisaniu' | 'gotowy';
  slowa: number;
  notatka: string | null;
  updated_at: string;
}

export interface LejekWpis {
  id: number;
  data: string;
  subskrybenci: number;
  nowi: number;
  notatka: string | null;
  created_at: string;
}
