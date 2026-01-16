import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

// Safe for Server/Edge. On client, this may return empty/false depending on env availability used.
export function isAuthorizedAdmin(email: string | undefined): boolean {
    if (!email) return false;

    const adminEmails = process.env.ADMIN_EMAILS
        ? process.env.ADMIN_EMAILS.split(",").map(e => e.trim().toLowerCase())
        : [];

    // Fallback for dev if env not set (optional, but safer to be strict)
    return adminEmails.includes(email.toLowerCase());
}
