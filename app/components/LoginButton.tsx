"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Github } from "lucide-react";

export default function LoginButton() {
    const { data: session } = useSession();

    if (session && session.user) {
        return (
            <div className="flex flex-col items-center gap-2">
                <p className="text-sm text-green-400/80 font-mono">
                    Logged in as {session.user.username || session.user.name || session.user.email}
                </p>
                <button
                    onClick={() => signOut()}
                    className="text-xs text-zinc-500 hover:text-zinc-300 underline"
                >
                    Sign out
                </button>
            </div >
        );
    }

    return (
        <button
            onClick={() => signIn("github")}
            className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-black transition-all duration-300 bg-white rounded-full hover:bg-zinc-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
        >
            <Github className="w-5 h-5" />
            <span>Unlock Full Wrapped</span>
            <span className="absolute -top-2 -right-2 px-2 py-0.5 text-[10px] font-bold text-white bg-green-500 rounded-full animate-bounce">
                10x Better
            </span>
        </button>
    );
}
