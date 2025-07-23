'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const AdminDashboardSidebar = () => {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/admin-dashboard/dashboard',
      icon: '/icons/dashboard.svg',
      activeIcon: '/icons/dashboard2.svg',
    },
    {
      label: 'Competitions',
      href: '/admin-dashboard/competitions',
      icon: '/icons/competitions.svg',
      activeIcon: '/icons/competitions2.svg',
    },
    {
      label: 'Results',
      href: '/admin-dashboard/results',
      icon: '/icons/results.svg',
      activeIcon: '/icons/results2.svg',
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
          const isDashboard = item.href === '/dashboard';
          const isActive = isDashboard
            ? pathname === '/dashboard'
            : pathname === item.href || pathname.startsWith(item.href);

          return (
            <Link href={item.href} key={item.label}>
              <div
                className={`flex items-center gap-3 py-3 px-4 pl-8 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#EAB044] text-white font-medium'
                    : 'text-black hover:bg-gray-100'
                }`}
              >
                <Image
                    src={isActive ? item.activeIcon : item.icon}
                    alt={`${item.label} icon`}
                    width={['Dashboard', 'Competitions', 'Results'].includes(item.label) ? 16 : 20}
                    height={['Dashboard', 'Competitions', 'Results'].includes(item.label) ? 16 : 20}
                    className={`${
                        ['Dashboard', 'Competitions', 'Results'].includes(item.label)
                        ? 'w-4 h-4'
                        : 'w-5 h-5'
                    }`}
                />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t px-4 py-4 flex items-center gap-3 border-gray-300">
        <div className="bg-black text-white w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium">
          A
        </div>
        <div className="text-sm">
          <p className="font-medium">Admin</p>
          <button className="text-gray-500 text-xs hover:underline cursor-pointer">
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminDashboardSidebar;