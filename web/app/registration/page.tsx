'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';

type Registration = {
  id: string;
  competitionTitle: string;
  dateRegistered: string;
  status: string;
};

export default function RegistrationPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof Registration | ''>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const columns = [
    { label: 'Competition', key: 'competitionTitle', minWidth: 'min-w-[700px]' },
    { label: 'Date Registered', key: 'dateRegistered', minWidth: 'min-w-[80px]' },
    { label: 'Status', key: 'status', minWidth: 'min-w-[100px]' },
  ];

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get current user session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session?.user) {
          setError('Please sign in to view your registrations');
          router.push('/auth/sign-in?redirectTo=/registration');
          return;
        }

        // Get access token for API call
        const accessToken = session.access_token;

        // Fetch registrations from API
        const response = await fetch('/api/registrations', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch registrations');
        }

        const data = await response.json();
        setRegistrations(data);
      } catch (err) {
        console.error('Error fetching registrations:', err);
        setError(err instanceof Error ? err.message : 'Failed to load registrations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegistrations();
  }, [router]);

  const handleSort = (column: keyof Registration) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleRowClick = () => {
    router.push('/registration/registered-players');
  };

  let filteredRegistrations = registrations.filter((reg) =>
    Object.values(reg).join(' ').toLowerCase().includes(search.toLowerCase())
  );

  if (sortColumn) {
    filteredRegistrations = [...filteredRegistrations].sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];
      return sortDirection === 'asc'
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });
  }

  const getStatusColor = (status: string) => {
    if (status.toLowerCase() === 'approved') return 'text-green-600 font-medium';
    if (status.toLowerCase() === 'closed') return 'text-red-600 font-medium';
    if (status.toLowerCase() === 'pending') return 'text-yellow-600 font-medium';
    return 'text-gray-700';
  };

  return (
    <div className="font-geist p-6 ml-10 mr-10 mt-30">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Registration</h1>
      </div>

      <div className="mb-2">
        <p className="text-gray-400">
          Note: Be advised that your registration is still pending, please contact{' '}
          <span className="text-gray-500">(+63) 905 815 5032</span> or send us an email at{' '}
          <a href="mailto:pilipinastaekwondo@gmail.com" className="text-gray-500 underline">
            pilipinastaekwondo@gmail.com
          </a>{' '}
          for approval.
        </p>
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
              disabled={isLoading}
            />
            <div className="absolute top-1/2 left-3 -translate-y-1/2">
              <Image src="/icons/search.svg" alt="Search Icon" width={16} height={16} />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="p-6 text-center text-gray-500">Loading registrations...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">Error: {error}</div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="p-6 text-gray-500">
            {search.trim() ? 'No registrations found matching your search.' : 'You have no registrations yet.'}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-orange-50 border-b border-[rgba(0,0,0,0.2)]">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`p-3 text-left text-gray-700 font-medium cursor-pointer ${column.minWidth}`}
                    onClick={() => handleSort(column.key as keyof Registration)}
                  >
                    <div className="flex items-center gap-1">
                      {column.label}
                      <Image
                        src="/icons/down-arrow.svg"
                        alt="Sort"
                        width={12}
                        height={12}
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
                  key={reg.id || `registration-${index}`}
                  onClick={handleRowClick}
                  className={`border-b border-[rgba(0,0,0,0.2)] hover:bg-orange-50 cursor-pointer ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="p-3 min-w-[340px]">{reg.competitionTitle}</td>
                  <td className="p-3 min-w-[120px]">
                    {new Date(reg.dateRegistered).toLocaleDateString()}
                  </td>
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
        )}
      </div>
    </div>
  );
}