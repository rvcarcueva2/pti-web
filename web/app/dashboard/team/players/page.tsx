'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function PlayersPage() {
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const players = [
    {
      lastName: 'Mones',
      firstName: 'Hazel Ann',
      gender: 'Female',
      belt: '8th Geup Yellow',
      age: 21,
      weight: 42,
    },
    {
      lastName: 'Carcueva',
      firstName: 'Reycel',
      gender: 'Male',
      belt: '8th Geup Yellow',
      age: 21,
      weight: 55,
    },
  ];

  // Filter first
  let filteredPlayers = players.filter((player) =>
    `${player.firstName} ${player.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  // Sort after filtering
  if (sortColumn) {
    filteredPlayers = [...filteredPlayers].sort((a, b) => {
      const valueA = a[sortColumn as keyof typeof a];
      const valueB = b[sortColumn as keyof typeof b];

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      } else {
        return sortDirection === 'asc'
          ? String(valueA).localeCompare(String(valueB))
          : String(valueB).localeCompare(String(valueA));
      }
    });
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const columns = [
    { label: 'Last Name', key: 'lastName', width: 'w-[120px]' },
    { label: 'First Name', key: 'firstName', width: 'w-[140px]' },
    { label: 'Gender', key: 'gender', width: 'w-[100px]' },
    { label: 'Belt Level', key: 'belt', width: 'w-[150px]' },
    { label: 'Age', key: 'age', width: 'w-[60px]' },
    { label: 'Weight (kg)', key: 'weight', width: 'w-[90px]' },
  ];

  return (
    <div className="font-geist p-6">
      {/* Breadcrumb and Title */}
      <div className="mb-4">
        <p className="text-sm text-gray-500">Team / Players</p>
        <h1 className="text-2xl font-semibold text-gray-800">Players</h1>
      </div>

      {/* Top bar: Search + Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="relative w-full sm:max-w-sm">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Image src="/icons/search.svg" alt="Search Icon" width={16} height={16} />
          </div>
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#EAB044]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 self-end sm:self-auto">
          <button className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 flex items-center gap-2">
            <Image src="/icons/excel.svg" alt="Excel Icon" width={16} height={16} />
            <span>Export Excel</span>
          </button>
          <button className="bg-[#EAB044] text-white px-4 py-2 rounded-md text-sm hover:bg-[#d49a35]">
            Add Player
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-[rgba(0,0,0,0.2)] rounded-md">
        <table className="w-full table-fixed text-sm">
          <thead className="bg-gray-50 border-b border-[rgba(0,0,0,0.2)]">
            <tr>
              <th className="p-3 w-[40px] text-left">
                <input type="checkbox" />
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`p-3 ${col.width} text-left text-gray-700 font-medium cursor-pointer`}
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <Image
                      src="/icons/down-arrow.svg"
                      alt="Sort"
                      width={12}
                      height={12}
                      className={`transition-transform ${
                        sortColumn === col.key && sortDirection === 'desc' ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </th>
              ))}
              <th className="p-3 w-[80px] text-right text-gray-700 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.map((player, index) => (
              <tr key={index} className="border-b border-[rgba(0,0,0,0.2)] hover:bg-gray-50">
                <td className="p-3">
                  <input type="checkbox" />
                </td>
                <td className="p-3">{player.lastName}</td>
                <td className="p-3">{player.firstName}</td>
                <td className="p-3">{player.gender}</td>
                <td className="p-3">{player.belt}</td>
                <td className="p-3">{player.age}</td>
                <td className="p-3">{player.weight}</td>
                <td className="p-3 w-[80px] text-right text-[#EAB044]">
                  <button className="flex items-center justify-end gap-1 hover:underline text-sm">
                    <Image src="/icons/edit.svg" alt="Edit" width={14} height={14} />
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer: Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <p>
          Showing 1 to {filteredPlayers.length} of {filteredPlayers.length} results
        </p>
        <div className="flex items-center gap-2">
          <select className="border border-gray-300 rounded-md px-2 py-1">
            <option value="10">10</option>
          </select>
          <span>per page</span>
          <button className="border rounded px-2 py-1">&lt;</button>
          <button className="border rounded px-2 py-1 bg-[#EAB044] text-white">1</button>
          <button className="border rounded px-2 py-1">&gt;</button>
        </div>
      </div>
    </div>
  );
}