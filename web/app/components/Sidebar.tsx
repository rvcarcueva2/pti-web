'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: '/icons/dashboard.svg',
      activeIcon: '/icons/dashboard2.svg',
    },
    {
      label: 'Team',
      href: '/dashboard/team',
      icon: '/icons/team.svg',
      activeIcon: '/icons/team2.svg',
    },
    {
      label: 'Registration',
      href: '/dashboard/registration',
      icon: '/icons/registration.svg',
      activeIcon: '/icons/registration2.svg',
    },
  ];

  return (
    <aside className="font-geist flex flex-col h-screen justify-between border-r w-64 bg-white [border-color:rgba(0,0,0,0.2)]">
      {/* Logo */}
      <div className="p-6 border-b flex justify-center [border-color:rgba(0,0,0,0.2)]">
        <Image
          src="/PTI-Logo.png"
          alt="Pilipinas Taekwondo"
          width={100}
          height={100}
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => {
          const isDashboard = item.href === '/dashboard';
          const isActive = isDashboard
            ? pathname === '/dashboard'
            : pathname === item.href || pathname.startsWith(item.href);

          return (
            <Link href={item.href} key={item.label}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#EAB044] text-white font-medium'
                    : 'text-black hover:bg-gray-100'
                }`}
              >
                <Image
                  src={isActive ? item.activeIcon : item.icon}
                  alt={`${item.label} icon`}
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t px-4 py-4 flex items-center gap-3 [border-color:rgba(0,0,0,0.2)]">
        <div className="bg-foreground text-white w-10 h-10 flex items-center justify-center rounded-full">
          HM
        </div>
        <div className="text-sm">
          <p className="font-medium">Hazel Mones</p>
          <button className="text-gray-500 text-xs hover:underline cursor-pointer">
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;