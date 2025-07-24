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
        router.push('/not-authorized');
      }

      setChecking(false);
    };

    checkRole();
  }, [router]);

  if (checking) return <div>Loading...</div>;

  return isAllowed ? <>{children}</> : null;
}
