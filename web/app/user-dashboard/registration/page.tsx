'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type Registration = {
  competition: string;
  dateRegistered: string;
  status: string;
};

export default function RegistrationPage() {
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const router = useRouter();

  const columns = [
    { label: 'Competition', key: 'competition', minWidth: 'min-w-[340px]' },
    { label: 'Date Registered', key: 'dateRegistered', minWidth: 'min-w-[120px]' },
    { label: 'Status', key: 'status', minWidth: 'min-w-[100px]' },
  ];

  const registrations: Registration[] = [
    {
      competition: 'National Championship',
      dateRegistered: '2025-07-20',
      status: 'Approved',
    },
    {
      competition: 'Regional Open',
      dateRegistered: '2025-07-15',
      status: 'Closed',
    },
    {
      competition: 'Summer Invitational',
      dateRegistered: '2025-07-10',
      status: 'Closed',
    },
  ];

  const handleSort = (column: keyof Registration) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleRowClick = () => {
    router.push('/user-dashboard/registration/players');
  };

  let filteredRegistrations = registrations.filter((reg) =>
    Object.values(reg).join(' ').toLowerCase().includes(search.toLowerCase())
  );

  if (sortColumn) {
    filteredRegistrations = [...filteredRegistrations].sort((a, b) => {
      const valueA = a[sortColumn as keyof Registration];
      const valueB = b[sortColumn as keyof Registration];
      return sortDirection === 'asc'
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });
  }

  const getStatusColor = (status: string) => {
    if (status.toLowerCase() === 'approved') return 'text-green-600 font-medium';
    if (status.toLowerCase() === 'closed') return 'text-red-600 font-medium';
    return 'text-gray-700';
  };

  return (
    <div className="font-geist p-6 ml-64">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Registration</h1>
      </div>

      <div className="bg-white border border-[rgba(0,0,0,0.2)] rounded-md overflow-x-auto">
        <div className="flex justify-end p-4 border-b border-[rgba(0,0,0,0.2)]">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#EAB044]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="absolute top-1/2 left-3 -translate-y-1/2">
              <Image src="/icons/search.svg" alt="Search Icon" width={16} height={16} />
            </div>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-[rgba(0,0,0,0.2)]">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`p-3 text-left text-gray-700 font-medium cursor-pointer ${column.minWidth}`}
                  onClick={() => handleSort(column.key as keyof Registration)}
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    <Image
                      src="/icons/down-arrow.svg"
                      alt="Sort"
                      width={10}
                      height={10}
                      className={`transition-transform ${
                        sortColumn === column.key && sortDirection === 'desc' ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </th>
              ))}
              <th className="p-3 w-[60px]"></th>
            </tr>
          </thead>
          <tbody>
            {filteredRegistrations.map((reg, index) => (
              <tr
                key={index}
                onClick={handleRowClick}
                className="border-b border-[rgba(0,0,0,0.2)] hover:bg-gray-50 cursor-pointer"
              >
                <td className="p-3 min-w-[340px]">{reg.competition}</td>
                <td className="p-3 min-w-[120px]">{reg.dateRegistered}</td>
                <td className={`p-3 min-w-[100px] ${getStatusColor(reg.status)}`}>
                  {reg.status}
                </td>
                <td className="p-3 text-center w-[60px]">
                  <Image
                    src="/icons/information.svg"
                    alt="Info"
                    width={18}
                    height={18}
                    className="mx-auto"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="grid grid-cols-3 items-center mt-4 text-sm text-gray-600">
        <p className="justify-self-start">
          Showing 1 to {filteredRegistrations.length} of {filteredRegistrations.length} results
        </p>
        <div className="flex items-center justify-center gap-2 relative">
          <div className="relative">
            <select className="appearance-none border border-[rgba(0,0,0,0.2)] rounded-md px-3 py-1 text-sm text-center pr-6 cursor-pointer">
              <option value="10">10</option>
            </select>
            <Image
              src="/icons/down-arrow.svg"
              alt="Dropdown"
              width={12}
              height={12}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none"
            />
          </div>
          <span>per page</span>
        </div>
        <div className="flex justify-end items-center gap-3">
          <div className="flex items-center border border-[rgba(0,0,0,0.2)] rounded overflow-hidden h-[36px]">
            <button className="px-3 h-full border-r border-[rgba(0,0,0,0.2)] cursor-pointer flex items-center justify-center">
              <Image src="/icons/previous.svg" alt="Previous" width={20} height={20} />
            </button>
            <div className="px-4 bg-[#00000010] text-[#EAB044] font-semibold text-sm h-full flex items-center">
              1
            </div>
            <button className="px-3 h-full border-l border-[rgba(0,0,0,0.2)] cursor-pointer flex items-center justify-center">
              <Image src="/icons/next.svg" alt="Next" width={20} height={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
