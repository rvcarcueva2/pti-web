'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Competition = {
  teams: string;
  players: number;
  kyorugi: number;
  poomsae: number;
  competition: string; // Still used internally for linking
};

export default function CompetitionPage() {
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const columns = [
    { label: 'Team', key: 'team', minWidth: 'min-w-[100px]' },
    { label: 'Players', key: 'players', minWidth: 'min-w-[100px]' },
    { label: 'Kyorugi', key: 'kyorugi', minWidth: 'min-w-[100px]' },
    { label: 'Poomsae', key: 'poomsae', minWidth: 'min-w-[100px]' },
  ];

  const competitions: Competition[] = [
    {
      competition: 'National Championship',
      teams: "Team 1",
      players: 120,
      kyorugi: 75,
      poomsae: 45,
    },
    {
      competition: 'Regional Open',
      teams: "Team 2",
      players: 85,
      kyorugi: 50,
      poomsae: 35,
    },
    {
      competition: 'Summer Invitational',
      teams: "Team 3",
      players: 60,
      kyorugi: 40,
      poomsae: 20,
    },
  ];

  const handleSort = (column: keyof Competition) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  let filteredCompetitions = competitions.filter((comp) =>
    Object.values(comp)
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (sortColumn) {
    filteredCompetitions.sort((a, b) => {
      const valueA = a[sortColumn as keyof Competition];
      const valueB = b[sortColumn as keyof Competition];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return sortDirection === 'asc'
        ? Number(valueA) - Number(valueB)
        : Number(valueB) - Number(valueA);
    });
  }

  return (
    <div className="font-geist p-6 ml-64">
      {/* Heading */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/admin-dashboard/competitions" className="font-medium group text-md text-[#EAB044] flex items-center">
            <span className="mr-1 transition-transform duration-200 group-hover:-translate-x-1">←</span>
            <span>Back</span>
          </Link>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Competition Name</h1>
          <div className="flex gap-2">
            <button className="cursor-pointer bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 flex items-center gap-2">
              <Image src="/icons/excel.svg" alt="Excel Icon" width={16} height={16} />
              <span>Export Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Table */}
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
                  onClick={() => handleSort(column.key as keyof Competition)}
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
            {filteredCompetitions.map((comp, index) => (
              <Link
                key={index}
                href="/admin-dashboard/competitions/competition/team"
                className="contents"
              >
                <tr className="border-b border-[rgba(0,0,0,0.2)] hover:bg-gray-50 cursor-pointer">
                  <td className="p-3 min-w-[100px]">{comp.teams}</td>
                  <td className="p-3 min-w-[100px]">{comp.players}</td>
                  <td className="p-3 min-w-[100px]">{comp.kyorugi}</td>
                  <td className="p-3 min-w-[100px]">{comp.poomsae}</td>
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
              </Link>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="grid grid-cols-3 items-center mt-4 text-sm text-gray-600">
        <p className="justify-self-start">
          Showing 1 to {filteredCompetitions.length} of {filteredCompetitions.length} results
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