"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// This layout will check for a session and redirect if the user is already logged in.
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const session = localStorage.getItem('session');
      if (session) {
        router.replace('/');
      }
    }
  }, [isClient, router]);

  // While checking for session, you can show a loader or nothing
  if (!isClient) {
    return null; 
  }
  
  const session = typeof window !== 'undefined' ? localStorage.getItem('session') : null;
  if(session) {
    return null; // Don't render children if we are about to redirect
  }

  return <>{children}</>;
}
