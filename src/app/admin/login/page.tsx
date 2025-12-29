"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        setIsLoading(true);

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) {
                throw error;
            }

            setIsEmailSent(true);
            toast.success("Magic link sent! Check your email.");
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Failed to send magic link. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo / Brand */}
                <div className="text-center mb-12">
                    <h1 className="text-2xl font-semibold tracking-tight text-[#111111]">
                        Happy Happy Feet
                    </h1>
                    <p className="text-sm text-[#666666] mt-1">Admin Dashboard</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-8">
                    {!isEmailSent ? (
                        <>
                            <h2 className="text-xl font-medium text-[#111111] mb-2">
                                Welcome back
                            </h2>
                            <p className="text-sm text-[#666666] mb-8">
                                Enter your email to receive a magic link
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-[#111111] mb-2"
                                    >
                                        Email address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] bg-white text-[#111111] placeholder:text-[#999999] focus:outline-none focus:ring-2 focus:ring-[#E07A8A]/50 focus:border-[#E07A8A] transition-all duration-200"
                                        disabled={isLoading}
                                        autoComplete="email"
                                        autoFocus
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 px-4 bg-[#E07A8A] hover:bg-[#D66A7A] text-white font-medium rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg
                                                className="animate-spin h-4 w-4"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            Sending...
                                        </span>
                                    ) : (
                                        "Send Magic Link"
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        /* Success State */
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-[#E07A8A]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg
                                    className="w-8 h-8 text-[#E07A8A]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-xl font-medium text-[#111111] mb-2">
                                Check your email
                            </h2>
                            <p className="text-sm text-[#666666] mb-6">
                                We sent a magic link to{" "}
                                <span className="font-medium text-[#111111]">{email}</span>
                            </p>
                            <button
                                onClick={() => setIsEmailSent(false)}
                                className="text-sm text-[#E07A8A] hover:text-[#D66A7A] font-medium transition-colors"
                            >
                                Use a different email
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-[#999999] mt-8">
                    Only authorized admins can access this dashboard
                </p>
            </div>
        </div>
    );
}
