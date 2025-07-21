'use client';

import { useState } from 'react';

export default function MyTeamPage() {
  const [teamName, setTeamName] = useState('');
  const [fbPage, setFbPage] = useState('');
  const [masterName, setMasterName] = useState('');
  const [teamLogo, setTeamLogo] = useState<File | null>(null);
  const [masterPhoto, setMasterPhoto] = useState<File | null>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void
  ) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  return (
    <div className="ml-64 font-geist p-8 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">My Team</h1>

      <div className="bg-white p-8 rounded-lg border border-[rgba(0,0,0,0.2)]">
        <h2 className="text-lg font-semibold mb-6 border-b pb-2 border-[rgba(0,0,0,0.2)]">
          Team Information
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Team Name</label>
              <input
                type="text"
                placeholder="Team Name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full border border-[rgba(0,0,0,0.2)] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#EAB044]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Facebook Page</label>
              <input
                type="text"
                placeholder="www.facebook.com/teamname"
                value={fbPage}
                onChange={(e) => setFbPage(e.target.value)}
                className="w-full border border-[rgba(0,0,0,0.2)] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#EAB044]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Master Name</label>
              <input
                type="text"
                placeholder="Master Name"
                value={masterName}
                onChange={(e) => setMasterName(e.target.value)}
                className="w-full border border-[rgba(0,0,0,0.2)] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#EAB044]"
              />
            </div>
          </div>

          {/* Uploads + Save Button */}
          <div className="w-[304px] flex flex-col justify-between items-center">
            <div className="flex gap-4">
              {/* Team Logo */}
              <div className="flex flex-col items-center gap-2 w-36">
                <div className="w-36 h-36 bg-gray-100 border border-[rgba(0,0,0,0.2)] rounded flex items-center justify-center text-sm text-gray-600 text-center">
                  {teamLogo ? <p>File selected</p> : <p>Team Logo</p>}
                </div>
                <label className="block w-36">
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, setTeamLogo)}
                    className="hidden"
                  />
                  <div className="bg-black text-white w-full py-2 rounded text-center cursor-pointer hover:bg-gray-800 flex items-center justify-center gap-2">
                    <img src="/icons/upload-file.svg" alt="Upload" className="w-4 h-4" />
                    <span className="text-sm font-normal">Upload File</span>
                  </div>
                </label>
              </div>

              {/* Master Photo */}
              <div className="flex flex-col items-center gap-2 w-36">
                <div className="w-36 h-36 bg-gray-100 border border-[rgba(0,0,0,0.2)] rounded flex items-center justify-center text-sm text-gray-600 text-center">
                  {masterPhoto ? <p>File selected</p> : <p>Master Photo</p>}
                </div>
                <label className="block w-36">
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, setMasterPhoto)}
                    className="hidden"
                  />
                  <div className="bg-black text-white w-full py-2 rounded text-center cursor-pointer hover:bg-gray-800 flex items-center justify-center gap-2">
                    <img src="/icons/upload-file.svg" alt="Upload" className="w-4 h-4" />
                    <span className="text-sm font-normal">Upload File</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Save Changes Button */}
            <button
              className="mt-6 w-[304px] bg-[#EAB044] text-white py-2 rounded text-sm hover:bg-[#d49a35] font-medium cursor-pointer"
              onClick={() => alert('Changes saved!')}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
