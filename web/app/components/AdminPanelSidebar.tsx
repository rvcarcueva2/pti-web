'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartSimple, faTrophy, faUser } from '@fortawesome/free-solid-svg-icons';

const AdminPanelSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userInitials, setUserInitials] = useState<string>('U');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');

  useEffect(() => {
    let mounted = true;

    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted && session?.user) {
        setUser(session.user);

        const first = session.user.user_metadata?.first_name || '';
        const last = session.user.user_metadata?.last_name || '';

        setFirstName(first);
        setLastName(last);

        // Set initials
        if (first && last) {
          setUserInitials(`${first[0]}${last[0]}`.toUpperCase());
        } else if (session.user.email) {
          setUserInitials(session.user.email.substring(0, 2).toUpperCase());
        } else {
          setUserInitials('U');
        }
      } else if (mounted) {
        setUser(null);
        setUserInitials('U');
        setFirstName('');
        setLastName('');
      }
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (mounted) {
          if (session?.user) {
            setUser(session.user);

            const first = session.user.user_metadata?.first_name || '';
            const last = session.user.user_metadata?.last_name || '';

            setFirstName(first);
            setLastName(last);

            // Set initials
            if (first && last) {
              setUserInitials(`${first[0]}${last[0]}`.toUpperCase());
            } else if (session.user.email) {
              setUserInitials(session.user.email.substring(0, 2).toUpperCase());
            } else {
              setUserInitials('U');
            }
          } else {
            setUser(null);
            setUserInitials('U');
            setFirstName('');
            setLastName('');
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };


  const navItems = [
    {
      label: 'Dashboard',
      href: '/admin-panel/dashboard',
      icon: faChartSimple,
    },
    {
      label: 'Competitions',
      href: '/admin-panel/competitions',
      icon: faTrophy,
    },
    {
    label: 'Users',
    href: '/admin-panel/users',
    icon: faUser,
    },
  ];

  return (
    <aside className="fixed top-0 left-0 z-50 h-screen w-64 font-geist flex flex-col justify-between border-r bg-white border-gray-300">
      {/* Logo */}
      <div className="p-6 border-b flex justify-center border-gray-300">
        <Image
          src="/PTI-Logo.png"
          alt="Pilipinas Taekwondo"
          width={100}
          height={100}
          className="transition-all duration-300"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href);

          return (
            <Link href={item.href} key={item.label}>
              <div
                className={`flex items-center gap-3 py-3 px-4 pl-8 transition-all cursor-pointer ${isActive
                  ? 'bg-[#EAB044] text-white font-medium'
                  : 'text-black hover:bg-gray-100'
                  }`}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className="w-4 h-4"
                />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
        <div className="border-t px-4 py-4 flex items-center gap-3 border-gray-300 flex-shrink-0 h-24">
          <div className="bg-black text-white w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium">
            {userInitials}
          </div>
        <div className="text-sm flex-1 min-w-0">
          <p className="font-medium min-h-[16px]">
            {firstName && lastName ? `${firstName} ${lastName}` : firstName || ''}
          </p>
          <button
            onClick={handleSignOut}
            className="text-gray-500 text-xs hover:underline cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminPanelSidebar;