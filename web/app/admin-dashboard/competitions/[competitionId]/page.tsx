'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
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
    { key: 'status', label: 'Status', minWidth: 'min-w-[100px]' },

];

export default function CompetitionTeamsPage() {
    const { competitionId, teamID } = useParams<{ competitionId: string, teamID: string }>();
    const [data, setData] = useState<TeamPlayerCount[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState<keyof TeamPlayerCount | null>(null);
    const [competitionName, setCompetitionName] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [loading, setLoading] = useState(true);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [pendingStatusChange, setPendingStatusChange] = useState<{
        registrationId: string;
        newStatus: string;
    } | null>(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };
    const router = useRouter();



    const fetchData = async () => {
        if (!competitionId) return;

        setLoading(true); // Make sure to indicate loading before fetching

        try {
            // Call the RPC
            const { data: teamData, error: teamError } = await supabase.rpc(
                'get_team_data_by_competition',
                { comp_uuid: competitionId }
            );

            if (teamError) {
                console.error('Error fetching team data:', teamError);
            } else {
                setData(teamData);
            }

            // Fetch the competition name
            const { data: compData, error: compError } = await supabase
                .from('competitions')
                .select('title')
                .eq('uuid', competitionId)
                .single();

            if (compError) {
                console.error('Error fetching competition title:', compError);
            } else {
                setCompetitionName(compData.title);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [competitionId]);




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

    const handleStatusChange = async (registrationId: string, newStatus: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        console.log("Authenticated user:", user);
        console.log('Attempting update', registrationId, newStatus);

        const { data, error } = await supabase
            .from('registrations')
            .update({ status: newStatus })
            .eq('id', registrationId)
            .select(); // ⬅ returns the updated row

        if (error) {
            console.error('❌ Update failed:', error.message);
        } else if (!data || data.length === 0) {
            console.warn('⚠️ No rows updated. Check ID and RLS.');
        } else {
            console.log('✅ Update success:', data);

            setData((prevData) =>
                prevData.map((item) =>
                    item.registration_id === registrationId
                        ? { ...item, status: newStatus }
                        : item
                )
            );
        }
    };
    const clickInfo = (teamId: string) => {
        router.push(`/admin-dashboard/competitions/${competitionId}/${teamId}`);
    };


    const getStatusColor = (status: string) => {
        if (status.toLowerCase() === 'pending') return 'text-yellow-600 font-medium';
        if (status.toLowerCase() === 'approved') return 'text-green-600 font-medium';
        if (status.toLowerCase() === 'closed') return 'text-red-600 font-medium';
        if (status.toLowerCase() === 'denied') return 'text-red-600 font-medium';

        return 'text-gray-700';
    };

    return (
        <div className="font-geist p-6 ml-64">
            {/* Heading */}
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <Link
                        href="/admin-dashboard/competitions"
                        className="font-medium group text-md text-[#EAB044] flex items-center"
                    >
                        <span className="font-bold mr-1 transition-transform duration-200 group-hover:-translate-x-1">
                            ←
                        </span>
                        <span>Back</span>
                    </Link>

                </div>
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        {competitionName}
                    </h1>
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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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
                                    onClick={() => handleSort(column.key)}
                                >
                                    <div className="flex items-center gap-1">
                                        {column.label}
                                        <Image
                                            src="/icons/down-arrow.svg"
                                            alt="Sort"
                                            width={10}
                                            height={10}
                                            className={`transition-transform ${sortColumn === column.key && sortDirection === 'desc'
                                                ? 'rotate-180'
                                                : ''
                                                }`}
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
                                    className="border-b border-[rgba(0,0,0,0.2)] hover:bg-gray-50 "


                                >
                                    <td className="p-3">{item.team}</td>
                                    <td className="p-3">{item.registered_players_count}</td>
                                    <td className="p-3">{item.kyorugi_count}</td>
                                    <td className="p-3">{item.poomsae_count}</td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-1">
                                            {/* Status Text */}
                                            <span className={`font-medium ${getStatusColor(item.status)}`}>
                                                {item.status}
                                            </span>

                                            {/* Icon-only Dropdown */}
                                            <div className="relative inline-block w-8 h-8 hover:bg-gray-200 rounded cursor-pointer">
                                                {/* Invisible select element */}
                                                <select
                                                    value={item.status || "Pending"}
                                                    onChange={(e) => {
                                                        setSelectedStatus(e.target.value);
                                                        setPendingStatusChange({
                                                            registrationId: item.registration_id,
                                                            newStatus: e.target.value,
                                                        });
                                                        setIsStatusModalOpen(true);
                                                        setIsOpen(false); // close dropdown after selection
                                                    }}
                                                    onClick={handleToggle}
                                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Approved">Approved</option>
                                                    <option value="Denied">Denied</option>
                                                    <option value="Closed">Closed</option>
                                                </select>

                                                {/* Visible icon container */}
                                                <div
                                                    onClick={handleToggle}
                                                    className="w-full h-full flex items-center justify-center rounded hover:bg-gray-200 transition cursor-pointer z-0"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faChevronDown}
                                                        className={`text-gray-700 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="p-3 text-center cursor-pointer">
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

            {/* Status Change Confirmation Modal */}
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

            {/* Pagination UI */}
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


