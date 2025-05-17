'use client'; // This component uses client-side interactivity (useState, navigator.clipboard)

import React, { useEffect, useState } from 'react';
import Navbar from '@/app/components/Navbar';
import { addToast } from "@heroui/react";
import wait from '@/app/utils/wait';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { BASE_URL } from "@/contants"
import Cookies from 'js-cookie';

// A simple copy icon (Heroicons - ClipboardIcon)
const ClipboardIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className || "w-5 h-5"}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
    />
  </svg>
);

// Checkmark icon (Heroicons - CheckIcon)
const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className || "w-5 h-5"}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);


interface KeyData {
  id: string;
  name: string;
  publicKey: string;
}

// 10 Custom Data Entries
const publicKeyData: KeyData[] = [
  { id: '1', name: 'Alice Wonderland', publicKey: '0x1A2b3C4d5E6f7A8B9c0D1e2F3a4B5c6D7e8F9a0B' },
  { id: '2', name: 'Bob The Builder', publicKey: '0x9F8e7D6c5B4a3F2e1D0c9B8a7F6e5D4c3B2a1F0E' },
  { id: '3', name: 'Charlie Chaplin', publicKey: '0x5E6f7A8b9C0d1E2f3A4b5C6d7E8f9A0b1C2d3E4F' },
  { id: '4', name: 'Diana Prince', publicKey: '0xD1e2F3a4B5c6D7e8F9a0B1c2D3e4F5a6B7c8D9e0' },
  { id: '5', name: 'Edward Scissorhands', publicKey: '0x7A8b9C0d1E2f3A4b5C6d7E8f9A0b1C2d3E4f5G6h' },
  { id: '6', name: 'Fiona Apple', publicKey: '0xB5c6D7e8F9a0B1c2D3e4F5a6B7c8D9e0F1a2B3c4' },
  { id: '7', name: 'George Orwell', publicKey: '0x3A4b5C6d7E8f9A0b1C2d3E4f5G6h7I8j9K0l1M2n' },
  { id: '8', name: 'Hermione Granger', publicKey: '0x8F9a0B1c2D3e4F5a6B7c8D9e0F1a2B3c4D5e6F7g' },
  { id: '9', name: 'Indiana Jones', publicKey: '0x6d7E8f9A0b1C2d3E4f5G6h7I8j9K0l1M2n3O4p5Q' },
  { id: '10', name: 'Jackie Chan', publicKey: '0x2D3e4F5a6B7c8D9e0F1a2B3c4D5e6F7g8H9i0J1k' },
];

export default function PublicKeysList({ sideBarOpen }: any) {

  const [publicKeyData, setPublicKeyData] = useState([]);
  const [keys, setKeys] = useState<KeyData[]>([]);

  useEffect(() => {
   const fetchKeys = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/keys/get-public-keys`
      );
      console.log(res.data.data);
      setPublicKeyData(res.data.data);
    } catch (error) {
      console.error('Error fetching keys:', error);
    }
   }

   fetchKeys();
  }, []);

  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Modal states

  const handleCopy = async (textToCopy: string, id: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedKeyId(id);
      addToast({
        title: "Data Copied",
        description: "Successfully copied the data",
        color: "success",
      });
      setTimeout(() => {
        setCopiedKeyId(null);
      }, 2000); // Reset icon after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Optionally show an error message to the user
    }
  };

  return (
    <div className="flex flex-col" >
      <Navbar />
      <div className={`bg-white shadow-md rounded-lg p-4 sm:p-6 ${sideBarOpen ? "w-[80vw]" : "w-[95vw]"}  mt-2 `}>
        <h2 className="text-4xl font-semibold text-slate-800 mb-8">
          User Public Keys
        </h2>
        <div className="overflow-x-auto">
          {/* Header */}
          <div className="hidden sm:flex items-center py-2 px-3 bg-gray-50 rounded-t-md border-b border-gray-200">
            <div className="w-2/5 font-medium text-lg text-slate-600">Name</div>
            <div className="w-3/5 font-medium text-lg text-slate-600">Public Key</div>
            <div className="w-10 flex-shrink-0"></div> {/* Spacer for copy icon column */}
          </div>

          {/* Data Rows */}
          {publicKeyData.map((item: any) => (
            <div
              key={item?._id}
              className="flex flex-col sm:flex-row items-start sm:items-center py-3 px-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="w-full sm:w-2/5 mb-1 sm:mb-0">
                <span className="sm:hidden font-semibold text-xs text-slate-500 mr-2">Name:</span>
                <span className="text-slate-800 text-md font-medium">{item.name}</span>
              </div>
              <div className="w-full sm:w-3/5 mb-2 sm:mb-0 sm:pr-2">
                <span className="sm:hidden font-semibold text-xs text-slate-500 mr-2">Key:</span>
                <span className="font-mono text-md text-gray-600 break-all">
                  {item.publicKey}
                </span>
              </div>
              <div className="w-full sm:w-10 flex-shrink-0 flex sm:justify-end">
                <button
                  onClick={() => handleCopy(item.publicKey, item._id)}
                  title="Copy public key"
                  className="p-1.5 rounded-md text-gray-500 hover:text-green-600 hover:bg-indigo-100 focus:outline-none  transition-colors duration-150"
                >
                  {copiedKeyId === item._id ? (
                    <CheckIcon className=" cursor-pointer w-5 h-5 text-green-500" />
                  ) : (
                    <ClipboardIcon className=" cursor-pointer w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
        {publicKeyData.length === 0 && (
          <p className="text-center text-gray-500 py-4">No public keys found.</p>
        )}
      </div>
    </div>
  );
}