'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type Player = {
  lastName: string;
  firstName: string;
  middleName: string;
  sex: string;
  age: string;
  height: string;
  belt: string;
  category: string;
  group: string;
};

export default function PlayersPage() {
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [players, setPlayers] = useState([
    {
      lastName: 'Mones',
      firstName: 'Hazel Ann',
      middleName: 'Reyes',
      sex: 'Female',
      age: 21,
      height: 160,
      belt: '8th Geup Yellow',
      category: 'Kyorugi',
      group: 'Senior',
    },
  ]);

  const [newPlayer, setNewPlayer] = useState<Player>({
    lastName: '',
    firstName: '',
    middleName: '',
    sex: '',
    age: '',
    height: '',
    belt: '',
    category: '',
    group: '',
  });

  const columns = [
    { label: 'Last Name', key: 'lastName', width: 'w-[120px]' },
    { label: 'First Name', key: 'firstName', width: 'w-[140px]' },
    { label: 'Middle Name', key: 'middleName', width: 'w-[140px]' },
    { label: 'Sex', key: 'sex', width: 'w-[80px]' },
    { label: 'Age', key: 'age', width: 'w-[60px]' },
    { label: 'Height (cm)', key: 'height', width: 'w-[100px]' },
    { label: 'Belt', key: 'belt', width: 'w-[150px]' },
    { label: 'Category', key: 'category', width: 'w-[100px]' },
    { label: 'Group', key: 'group', width: 'w-[160px]' },
  ];

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleAddPlayer = () => {
    setPlayers([...players, { ...newPlayer, age: +newPlayer.age, height: +newPlayer.height }]);
    setNewPlayer({
      lastName: '',
      firstName: '',
      middleName: '',
      sex: '',
      age: '',
      height: '',
      belt: '',
      category: '',
      group: '',
    });
    setIsModalOpen(false);
  };

  const getGroup = (age: number, category: string): string => {
    if (category === 'Kyorugi') {
      if (age <= 11) return 'Grade School';
      if (age <= 14) return 'Cadet';
      if (age <= 17) return 'Junior';
      return 'Senior';
    } else if (category === 'Poomsae') {
      if (age <= 6) return 'Toddlers';
      if (age <= 9) return 'Group 1';
      if (age <= 13) return 'Group 2';
      if (age <= 17) return 'Group 3';
      return 'Group 4';
    }
    return '';
  };

  useEffect(() => {
    const ageNum = parseInt(newPlayer.age);
    if (!isNaN(ageNum) && newPlayer.category) {
      const group = getGroup(ageNum, newPlayer.category);
      setNewPlayer((prev) => ({ ...prev, group }));
    }
  }, [newPlayer.age, newPlayer.category]);

  let filteredPlayers = players.filter((player) =>
    `${player.firstName} ${player.lastName} ${player.middleName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

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

  return (
    <div className="font-geist p-6 ml-64">
      {/* Heading */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Players</h1>
        <div className="flex gap-2">
          <button className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 flex items-center gap-2">
            <Image src="/icons/excel.svg" alt="Excel Icon" width={16} height={16} />
            <span>Export Excel</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#EAB044] text-white px-4 py-2 rounded-md text-sm hover:bg-[#d49a35]"
          >
            Add Player
          </button>
        </div>
      </div>

      {/* Main Container */}
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

        {/* Table */}
        <table className="w-full table-fixed text-sm">
          <thead className="bg-gray-50 border-b border-[rgba(0,0,0,0.2)]">
            <tr>
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
                {columns.map((col) => (
                  <td key={col.key} className="p-3">
                    {player[col.key as keyof typeof player]}
                  </td>
                ))}
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

      {/* Pagination */}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-4xl border border-[rgba(0,0,0,0.2)] shadow-lg relative">
            <button
              className="absolute top-2 right-3 text-xl font-bold text-gray-600"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddPlayer();
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {inputField({ label: 'Last Name', value: newPlayer.lastName, onChange: (v: string) => setNewPlayer({ ...newPlayer, lastName: v }), required: true, placeholder: 'Enter last name' })}
                {inputField({ label: 'First Name', value: newPlayer.firstName, onChange: (v: string) => setNewPlayer({ ...newPlayer, firstName: v }), required: true, placeholder: 'Enter first name' })}
                {inputField({ label: 'Middle Name', value: newPlayer.middleName, onChange: (v: string) => setNewPlayer({ ...newPlayer, middleName: v }), placeholder: 'Enter middle name' })}
                {selectField({ label: 'Sex', value: newPlayer.sex, onChange: (v: string) => setNewPlayer({ ...newPlayer, sex: v }), required: true, options: ['Male', 'Female'] })}
                {inputField({ label: 'Age', value: newPlayer.age, onChange: (v: string) => setNewPlayer({ ...newPlayer, age: v }), required: true, type: 'number', placeholder: 'Enter age' })}
                {inputField({ label: 'Height (cm)', value: newPlayer.height, onChange: (v: string) => setNewPlayer({ ...newPlayer, height: v }), required: true, type: 'number', placeholder: 'Enter height' })}
                {selectField({ label: 'Belt', value: newPlayer.belt, onChange: (v: string) => setNewPlayer({ ...newPlayer, belt: v }), required: true, options: ['9th Geup White', '8th Geup Yellow', '7th Geup Yellow-Stripe'] })}
                {selectField({ label: 'Category', value: newPlayer.category, onChange: (v: string) => setNewPlayer({ ...newPlayer, category: v }), required: true, options: ['Kyorugi', 'Poomsae'] })}
                {inputField({ label: 'Group', value: newPlayer.group, onChange: () => {}, disabled: true, placeholder: 'Auto-generated' })}
              </div>
              <div className="mt-4 flex justify-end">
                <button type="submit" className="bg-[#EAB044] text-white px-6 py-2 rounded-md text-sm hover:bg-[#d49a35]">
                  + Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  type InputFieldProps = {
    label: string;
    value: string | number;
    onChange: (v: string) => void;
    required?: boolean;
    type?: string;
    placeholder?: string;
    disabled?: boolean;
  };

  function inputField({
    label,
    value,
    onChange,
    required = false,
    type = 'text',
    placeholder = '',
    disabled = false,
  }: InputFieldProps) {
    return (
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full border border-[rgba(0,0,0,0.2)] rounded p-2 ${disabled ? 'bg-gray-100' : ''}`}
          disabled={disabled}
        />
      </div>
    );
  }

  function selectField({
    label,
    value,
    onChange,
    required = false,
    options = [],
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    required?: boolean;
    options?: string[];
  }) {
    return (
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-[rgba(0,0,0,0.2)] rounded p-2"
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  }
}