
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: number;
    fullName: string;
    email: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        try {
            const userJson = localStorage.getItem('user');
            if (userJson) {
                setUser(JSON.parse(userJson));
            } else {
                 // Si no hay usuario, redirigir al login
                 router.replace('/auth/sign-in');
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            localStorage.removeItem('user');
            router.replace('/auth/sign-in');
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    return { user, isLoading };
}
