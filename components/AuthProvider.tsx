"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

export const queryClient = new QueryClient()
export default function AuthProvider({ children }: { children: React.ReactNode }) {

    return <SessionProvider>
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>

    </SessionProvider>;
}
