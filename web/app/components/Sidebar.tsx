'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const Sidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

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

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  return (
    <aside
      className={`font-geist relative flex flex-col h-screen justify-between border-r bg-white transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      } [border-color:rgba(0,0,0,0.2)]`}
    >
      {/* Logo */}
      {!collapsed && (
        <div className="p-6 border-b flex justify-center [border-color:rgba(0,0,0,0.2)]">
          <Image
            src="/PTI-Logo.png"
            alt="Pilipinas Taekwondo"
            width={100}
            height={100}
            className="transition-all duration-300"
          />
        </div>
      )}

      {/* Toggle Button (middle right) */}
      <button
        onClick={toggleSidebar}
        className="absolute right-[-14px] top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow hover:bg-gray-100 transition"
      >
        <Image
          src={collapsed ? '/icons/menu.svg' : '/icons/back.svg'}
          alt="Toggle Sidebar"
          width={10}
          height={10}
        />
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-2 mt-4 space-y-1">
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
                {!collapsed && <span>{item.label}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t px-4 py-4 flex items-center gap-3 [border-color:rgba(0,0,0,0.2)]">
        <div className="bg-black text-white w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium">
          HM
        </div>
        {!collapsed && (
          <div className="text-sm">
            <p className="font-medium">Hazel Mones</p>
            <button className="text-gray-500 text-xs hover:underline cursor-pointer">
              Sign out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
