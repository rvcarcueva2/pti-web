'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type UserData = {
  user_id: string;
  name: string;
  email: string;
  contact_number: string;
  team_name: string;
};

type Column = {
  key: keyof UserData;
  label: string;
  minWidth?: string;
};

const columns: Column[] = [
  { key: 'name', label: 'Name', minWidth: 'min-w-[250px]' },
  { key: 'team_name', label: 'Team', minWidth: 'min-w-[200px]' },
  { key: 'email', label: 'Email Address', minWidth: 'min-w-[250px]' },
  { key: 'contact_number', label: 'Contact Number', minWidth: 'min-w-[150px]' },
];

// Sample static data
const sampleUsers: UserData[] = [
  {
    user_id: '1',
    name: 'John Doe',
    email: 'john.doe@email.com',
    contact_number: '09123456789',
    team_name: 'Dragon Warriors',
  },
  {
    user_id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    contact_number: '09234567890',
    team_name: 'Thunder Eagles',
  },
  {
    user_id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@email.com',
    contact_number: '09345678901',
    team_name: 'Fire Phoenix',
  },
];

export default function UsersPage() {
  const [data, setData] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof UserData | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setData(sampleUsers);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleSort = (column: keyof UserData) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  let filteredUsers = data.filter((item) =>
    Object.values(item)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (sortColumn) {
    filteredUsers.sort((a, b) => {
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

  return (
    <div className="font-geist p-6 ml-64">
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Users</h1>
        </div>
      </div>

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
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="p-4 text-center text-gray-500">
                  Loading users...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b border-[rgba(0,0,0,0.2)] hover:bg-orange-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                >
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.team_name}</td>
                  <td className="p-3">{item.email}</td>
                  <td className="p-3">{item.contact_number}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
