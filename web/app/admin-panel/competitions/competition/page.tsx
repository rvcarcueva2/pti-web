'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

type TeamPlayerCount = {
  registration_id: string;
  team_id: string;
  team: string;
  registered_players_count: number;
  kyorugi_count: number;
  poomsae_count: number;
  poomsae_team_count: number;
  status: string;
};

type Column = {
  key: keyof TeamPlayerCount;
  label: string;
  minWidth?: string;
};

const columns: Column[] = [
  { key: 'team', label: 'Team', minWidth: 'min-w-[300px]' },
  { key: 'registered_players_count', label: 'Players', minWidth: 'min-w-[100px]' },
  { key: 'kyorugi_count', label: 'Kyorugi', minWidth: 'min-w-[100px]' },
  { key: 'poomsae_count', label: 'Poomsae', minWidth: 'min-w-[100px]' },
  { key: 'poomsae_team_count', label: 'Poomsae Team', minWidth: 'min-w-[120px]' },
  { key: 'status', label: 'Status', minWidth: 'min-w-[100px]' },
];

export default function CompetitionTeamsPage() {
  const { competitionId, teamID } = useParams<{ competitionId: string; teamID: string }>();
  const [data, setData] = useState<TeamPlayerCount[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof TeamPlayerCount | null>(null);
  const [competitionName, setCompetitionName] = useState<string>('Sample Competition');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    registrationId: string;
    newStatus: string;
  } | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isOpen, setIsOpen] = useState<string>('');
  const [dropdownPosition, setDropdownPosition] = useState<{ x: number; y: number; showAbove: boolean } | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleToggle = (registrationId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Check if there's enough space below (150px for dropdown height)
    const spaceBelow = windowHeight - rect.bottom;
    const showAbove = spaceBelow < 150;
    
    setDropdownPosition({
      x: rect.left - 120, // Position to the left of the button
      y: showAbove ? rect.top - 140 : rect.bottom + 5, // Above or below based on space
      showAbove
    });
    
    setIsOpen((prev) => (prev === registrationId ? '' : registrationId));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsOpen('');
      setDropdownPosition(null);
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    // Simulate fetch delay
    setTimeout(() => {
      setData([
        {
          registration_id: 'r1',
          team_id: 't1',
          team: 'Red Dragons Taekwondo Academy',
          registered_players_count: 15,
          kyorugi_count: 8,
          poomsae_count: 5,
          poomsae_team_count: 2,
          status: 'Pending',
        },
        {
          registration_id: 'r2',
          team_id: 't2',
          team: 'Blue Phoenix Martial Arts',
          registered_players_count: 12,
          kyorugi_count: 7,
          poomsae_count: 3,
          poomsae_team_count: 2,
          status: 'Approved',
        },
        {
          registration_id: 'r3',
          team_id: 't3',
          team: 'Golden Tiger Dojang',
          registered_players_count: 20,
          kyorugi_count: 12,
          poomsae_count: 6,
          poomsae_team_count: 2,
          status: 'Approved',
        },
        {
          registration_id: 'r4',
          team_id: 't4',
          team: 'Silver Wolf Warriors',
          registered_players_count: 8,
          kyorugi_count: 5,
          poomsae_count: 2,
          poomsae_team_count: 1,
          status: 'Denied',
        },
        {
          registration_id: 'r5',
          team_id: 't5',
          team: 'Lightning Strike Academy',
          registered_players_count: 18,
          kyorugi_count: 10,
          poomsae_count: 5,
          poomsae_team_count: 3,
          status: 'Pending',
        },
        {
          registration_id: 'r6',
          team_id: 't6',
          team: 'Thunder Eagles Dojang',
          registered_players_count: 15,
          kyorugi_count: 8,
          poomsae_count: 5,
          poomsae_team_count: 2,
          status: 'Pending',
        },
        {
          registration_id: 'r7',
          team_id: 't7',
          team: 'Storm Warriors Academy',
          registered_players_count: 12,
          kyorugi_count: 7,
          poomsae_count: 3,
          poomsae_team_count: 2,
          status: 'Approved',
        },
        {
          registration_id: 'r8',
          team_id: 't8',
          team: 'Fire Dragon School',
          registered_players_count: 20,
          kyorugi_count: 12,
          poomsae_count: 6,
          poomsae_team_count: 2,
          status: 'Approved',
        },
        {
          registration_id: 'r9',
          team_id: 't9',
          team: 'Steel Panthers Club',
          registered_players_count: 8,
          kyorugi_count: 5,
          poomsae_count: 2,
          poomsae_team_count: 1,
          status: 'Denied',
        },
        {
          registration_id: 'r10',
          team_id: 't10',
          team: 'Shadow Wolf Training Center',
          registered_players_count: 18,
          kyorugi_count: 10,
          poomsae_count: 5,
          poomsae_team_count: 3,
          status: 'Pending',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleSort = (column: keyof TeamPlayerCount) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  let filteredCompetitions = data.filter((item) =>
    Object.values(item)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (sortColumn) {
    filteredCompetitions.sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];

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

  const handleStatusChange = (registrationId: string, newStatus: string) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.registration_id === registrationId
          ? { ...item, status: newStatus }
          : item
      )
    );
  };

  const clickInfo = (teamId: string) => {
    router.push(`/admin-panel/competitions/competition/team`);
  };

  const handleRowClick = (teamId: string) => {
    router.push(`/admin-panel/competitions/competition/team`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'pending':
        return 'text-yellow-700 bg-yellow-100';
        case 'approved':
        return 'text-green-700 bg-green-100';
        case 'closed':
        return 'text-red-700 bg-red-100';
        case 'denied':
        return 'text-red-700 bg-red-100';
        default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getDropdownStatusColor = (status: string, isSelected: boolean) => {
    if (!isSelected) return 'text-gray-700';
    
    switch (status.toLowerCase()) {
        case 'pending':
        return 'text-yellow-700 font-bold';
        case 'approved':
        return 'text-green-700 font-bold';
        case 'closed':
        return 'text-red-700 font-bold';
        case 'denied':
        return 'text-red-700 font-bold';
        default:
        return 'text-gray-700 font-bold';
    }
  };

  return (
    <div className="font-geist p-6 ml-64">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Link
            href="/admin-panel/competitions"
            className="font-medium group text-md text-[#EAB044] flex items-center"
          >
            <span className="font-bold mr-1 transition-transform duration-200 group-hover:-translate-x-1">
              ←
            </span>
            <span>Back</span>
          </Link>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">{competitionName}</h1>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 bg-green-100 border border-green-400 text-green-700 rounded shadow-lg text-m font-regular transition-all duration-300">
          {successMessage}
        </div>
      )}

      <div className="bg-white border border-[rgba(0,0,0,0.2)] rounded-md overflow-x-auto">
        <div className="flex justify-end p-4 border-b border-[rgba(0,0,0,0.2)]">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#EAB044]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute top-1/2 left-3 -translate-y-1/2">
              <Image src="/icons/search.svg" alt="Search Icon" width={16} height={16} />
            </div>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-orange-50 border-b border-[rgba(0,0,0,0.2)]">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`p-3 text-left text-gray-700 font-medium cursor-pointer ${column.minWidth}`}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    <Image
                      src="/icons/down-arrow.svg"
                      alt="Sort"
                      width={10}
                      height={10}
                      className={`transition-transform ${sortColumn === column.key && sortDirection === 'desc' ? 'rotate-180' : ''}`}
                    />
                  </div>
                </th>
              ))}
              <th className="p-3 w-[60px]"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="p-4 text-center text-gray-500">
                  Loading data...
                </td>
              </tr>
            ) : filteredCompetitions.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="p-4 text-center text-gray-500">
                  No registered teams.
                </td>
              </tr>
            ) : (
              filteredCompetitions.map((item, index) => (
                <tr 
                  key={index} 
                  onClick={() => handleRowClick(item.team_id)}
                  className={`border-b border-[rgba(0,0,0,0.2)] hover:bg-orange-50 cursor-pointer ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="p-3">{item.team}</td>
                  <td className="p-3">{item.registered_players_count}</td>
                  <td className="p-3">{item.kyorugi_count}</td>
                  <td className="p-3">{item.poomsae_count}</td>
                  <td className="p-3">{item.poomsae_team_count}</td>
                  <td className="p-3 relative" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(item.status)}`}>
                        {item.status}
                        </span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleToggle(item.registration_id, e);
                            }}
                            className="cursor-pointer w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200 transition -ml-1"
                            >
                            <FontAwesomeIcon icon={faChevronDown} className="text-gray-600 text-xs" />
                        </button>
                    </div>
                  </td>
                  <td className="p-3 text-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
                    <Image
                      src="/icons/information.svg"
                      alt="Info"
                      width={18}
                      height={18}
                      onClick={() => clickInfo(item.team_id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Status Dropdown */}
      {isOpen && dropdownPosition && (
        <div 
          className="fixed z-50 bg-white border border-gray-300 rounded shadow-lg w-36 overflow-hidden"
          style={{
            top: dropdownPosition.y,
            left: dropdownPosition.x,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {['Pending', 'Approved', 'Denied', 'Closed'].map((statusOption) => {
            const currentItem = data.find(item => item.registration_id === isOpen);
            const isSelected = currentItem?.status === statusOption;
            
            return (
              <div
                key={statusOption}
                onClick={() => {
                  setSelectedStatus(statusOption);
                  setPendingStatusChange({
                    registrationId: isOpen,
                    newStatus: statusOption,
                  });
                  setIsStatusModalOpen(true);
                  setIsOpen('');
                  setDropdownPosition(null);
                }}
                className={`px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${getDropdownStatusColor(statusOption, isSelected)}`}
              >
                {statusOption}
              </div>
            );
          })}
        </div>
      )}

      {isStatusModalOpen && pendingStatusChange && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg border border-gray-200 relative">
            <p className="mb-6 text-gray-800 leading-relaxed">
              Are you sure you want to change the status to
              <span className="font-bold uppercase text-black"> {pendingStatusChange.newStatus}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition cursor-pointer"
                onClick={() => {
                  setIsStatusModalOpen(false);
                  setPendingStatusChange(null);
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleStatusChange(pendingStatusChange.registrationId, pendingStatusChange.newStatus);
                  setSuccessMessage('Status updated successfully!');
                  setIsStatusModalOpen(false);
                  setPendingStatusChange(null);
                }}
                className="px-4 py-2 rounded bg-[#EAB044] text-white hover:bg-[#d49a35] transition cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}