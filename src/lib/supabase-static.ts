import { createClient as createBrowserClient } from "@supabase/supabase-js";

/**
 * Static Supabase client for use in build-time contexts
 * like generateStaticParams() where cookies() is not available.
 * 
 * This client has no auth context and only accesses public data.
 */
export function createStaticClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}
