'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const [isAllowed, setIsAllowed] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkRole = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        router.push('/not-authorized');
        return;
      }

      const role = session.user?.user_metadata?.role || session.user?.app_metadata?.role;

      console.log('DEBUG — role from session:', role);

      if (role === 'Admin') {
        setIsAllowed(true);
      } else {
        router.push('/');
      }

      setChecking(false);
    };

    checkRole();
  }, [router]);

  if (checking) {
    return (
      <div className="font-geist min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-2xl mx-auto px-4 flex flex-col items-center justify-center" style={{ minHeight: '70vh' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#EAB044] mx-auto"></div>
            <p className="mt-4 text-gray-600">Verifying access...</p>
          </div>
        </div>
      </div>
    );
  }

  return isAllowed ? <>{children}</> : null;
}
