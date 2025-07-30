'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';


type RegisteredPlayer = {
  player_id: string;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  sex: string | null;
  age: number | null;
  height: number | null;
  belt: string | null;
  category: string | null;
  group_name: string | null;
};

export default function CompetitionPage() {
  const { competitionId, teamId } = useParams<{ competitionId: string, teamId: string }>();
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [players, setPlayers] = useState<RegisteredPlayer[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const columns = [
    { label: 'Last Name', key: 'last_name', width: 'w-[130px]' },
    { label: 'First Name', key: 'first_name', width: 'w-[130px]' },
    { label: 'Middle Name', key: 'middle_name', width: 'w-[130px]' },
    { label: 'Sex', key: 'sex', width: 'w-[70px]' },
    { label: 'Age', key: 'age', width: 'w-[60px]' },
    { label: 'Height (cm)', key: 'height', width: 'w-[120px]' },
    { label: 'Belt', key: 'belt', width: 'w-[130px]' },
    { label: 'Category', key: 'category', width: 'w-[100px]' },
    { label: 'Group', key: 'group_name', width: 'w-[100px]' },
  ];

  useEffect(() => {
    if (!teamId) return;

    const fetchPlayers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .rpc('get_registered_players_by_team', { team_uuid: teamId });

      if (error) {
        console.error('Error fetching players:', error);
      } else {
        setPlayers(data || []);
      }

      setLoading(false);
    };

    fetchPlayers();
  }, [teamId]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };




  return (
    <div className="font-geist p-6 ml-64">
      {/* Heading */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Link href={`/admin-dashboard/competitions/${competitionId}`}
            className="font-medium group text-md text-[#EAB044] flex items-center">
            <span className="font-bold mr-1 transition-transform duration-200 group-hover:-translate-x-1">
              ←
            </span>
            <span>Back</span>
          </Link>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Team Name</h1>
          <div className="flex gap-2">
            <button className="cursor-pointer bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 flex items-center gap-2">
              <Image src="/icons/excel.svg" alt="Excel Icon" width={16} height={16} />
              <span>Export Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search + Table */}
      <div className="bg-white border border-[rgba(0,0,0,0.2)] rounded-md overflow-x-auto">
        <div className="flex justify-between items-center p-4 border-b border-[rgba(0,0,0,0.2)]">
          <h3 className="text-lg text-gray-800">Players</h3>
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
                      className={`transition-transform ${sortColumn === col.key && sortDirection === 'desc' ? 'rotate-180' : ''
                        }`}
                    />
                  </div>
                </th>
              ))}
              <th className="p-3 w-[120px] text-left text-gray-700 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : players.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="p-4 text-center">
                  No players found for this team.
                </td>
              </tr>
            ) : (
              players.map((player, index) => (
                <tr key={index} className="border-b border-[rgba(0,0,0,0.2)] hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key} className="p-3">
                      {player[col.key as keyof typeof player]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="grid grid-cols-3 items-center mt-4 text-sm text-gray-600">
        <p className="justify-self-start">
          Showing 1 to {players.length} of {players.length} results
        </p>
        <div className="flex items-center justify-center gap-1 relative">
          <div className="relative">
            <select className="appearance-none border border-[rgba(0,0,0,0.2)] rounded-md px-3 py-1 text-sm text-center pr-6 cursor-pointer">
              <option value="10">10</option>
            </select>
            <Image
              src="/icons/down-arrow.svg"
              alt="Dropdown"
              width={12}
              height={12}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none cursor-pointer"
            />
          </div>
          <span className="text-sm">per page</span>
        </div>
        <div className="flex justify-end items-center gap-3">
          <div className="flex items-center border border-[rgba(0,0,0,0.2)] rounded overflow-hidden h-[36px]">
            <button className="px-3 h-full border-r border-[rgba(0,0,0,0.2)] cursor-pointer flex items-center justify-center">
              <Image src="/icons/previous.svg" alt="Previous" width={20} height={20} />
            </button>
            <div className="px-4 bg-[#00000010] text-[#EAB044] font-semibold text-sm h-full flex items-center">1</div>
            <button className="px-3 h-full border-l border-[rgba(0,0,0,0.2)] cursor-pointer flex items-center justify-center">
              <Image src="/icons/next.svg" alt="Next" width={20} height={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

