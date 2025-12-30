"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic Validation
        if (!email) {
            toast.error("Please enter your email");
            return;
        }
        if (!password || password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        setIsLoading(true);

        try {
            const supabase = createClient();

            // Attempt Sign In
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error("Login attempt failed:", error.message);
                // Vague error for security
                toast.error("Wrong email or password.");
                return;
            }

            // Success
            toast.success("Welcome back!");
            router.push("/admin");

        } catch (error) {
            console.error("Unexpected login error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-4">
            <div className="w-full max-w-md">
                {/* Logo / Brand */}
                <div className="text-center mb-12">
                    <h1 className="text-2xl font-semibold tracking-tight text-[#111111]">
                        Happy Happy Feet
                    </h1>
                    <p className="text-sm text-[#666666] mt-1">Admin Login</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                className="h-11 bg-white"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                className="h-11 bg-white"
                                required
                            />
                            <p className="text-xs text-[#999999]">
                                Must be at least 8 characters
                            </p>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 bg-[#E07A8A] hover:bg-[#D66A7A] text-white font-medium rounded-full text-base transition-all duration-200"
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-[#999999] mt-8">
                    Authorized personnel only
                </p>
            </div>
        </div>
    );
}
