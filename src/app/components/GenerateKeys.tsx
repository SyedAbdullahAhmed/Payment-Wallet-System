'use client'; // For Next.js App Router

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { BASE_URL } from "@/contants"; // Make sure this path is correct
import Cookies from 'js-cookie';
import Spinner from './Spinner';    // Make sure this path is correct
import wait from '../utils/wait'; // Make sure this path is correct

// --- Icons ---
const ClipboardIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);
// --- End Icons ---

export default function KeyGenerator({ sideBarOpen }: any) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [showPrivateKey, setShowPrivateKey] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingLoading, setIsGeneratingLoading] = useState<boolean>(false);
  const [initialFetchInProgress, setInitialFetchInProgress] = useState<boolean>(true);
  const [copiedField, setCopiedField] = useState<'public' | 'private' | null>(null);

  const shouldHaveCompactLayout = !!publicKey;


  const sidebarWidth = sideBarOpen ? "w-[60vw]" : "w-[60vw]";
  const layoutClasses = shouldHaveCompactLayout
    ? "mt-2 h-auto px-4"
    : "mt-16 h-auto min-h-[calc(100vh-4rem-env(safe-area-inset-bottom))]";


  useEffect(() => {
    const fetchCurrentUserKeys = async () => {
      setInitialFetchInProgress(true);
      setError(null);
      try {
        const token = Cookies.get('token');
        if (!token) {
          setInitialFetchInProgress(false);
          return;
        }

        const res = await axios.get(`${BASE_URL}/api/keys/get-keys`, { // Changed from /current-user-keys as per your code
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.data && res.data.data && res.data.data.publicKey) {
          setPublicKey(res.data.data.publicKey);
          setPrivateKey(res.data.data.privateKey);
          toast.success("Existing keys loaded.");
        }
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          // No keys found, this is not an error in this context
        } else {
          // console.error('Failed to fetch user keys:', err);
          // toast.error("Could not fetch your keys. Please try again later.");
        }
        setPublicKey(null);
        setPrivateKey(null);
      } finally {
        setInitialFetchInProgress(false);
      }
    };

    fetchCurrentUserKeys();
  }, []);

  const generateKeys = async () => {
    setIsGeneratingLoading(true);
    setError(null);
    setShowPrivateKey(false);
    setCopiedField(null);

    try {
      const token = Cookies.get('token');
      // When this function is called, `password` state will likely be empty
      // as the button to call this is only enabled if no keys exist (and thus password field for reveal isn't actively used).
      // Your backend /api/keys/generate-keys must handle this.
      const res = await axios.post(`${BASE_URL}/api/keys/generate-keys`,
        { password }, // `password` here is from the component's state
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      await wait(1000);
      const { publicKey: newPublicKey, privateKey: newPrivateKey } = res.data.data;
      toast.success(res.data.message || "New keys generated successfully!");

      setPublicKey(newPublicKey);
      setPrivateKey(newPrivateKey);
      setPassword(''); // Clear password field for reveal section

    } catch (err: any) {
      console.error('Key generation error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred during key generation.';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsGeneratingLoading(false);
    }
  };

  const handleRevealPrivateKey = async () => {
    setError(null);
    if (!password) {
      toast.warn("Please enter your account password.");
      setError("Password is required to reveal the private key.");
      return;
    }

    try {
      const token = Cookies.get('token');
      const res = await axios.post(`${BASE_URL}/api/user/check-password`,
        { password },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data && res.data.data && res.data.data.isPasswordCorrect) {
        setShowPrivateKey(true);
        toast.success("Password verified. Private key revealed.");
      } else {
        toast.error("Incorrect password.");
        setError("Incorrect password. Private key remains hidden.");
      }
    } catch (err: any) {
      // console.error('Password check error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred while verifying password.';
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  const handleHidePrivateKey = () => {
    setShowPrivateKey(false);
    setPassword('');
    setCopiedField(null);
    setError(null);
  };

  const handleCopy = async (textToCopy: string, field: 'public' | 'private') => {
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedField(field);
      toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} key copied to clipboard.`);
      setTimeout(() => {
        setCopiedField(null);
      }, 2000);
    } catch (err) {
      toast.error('Failed to copy key.');
      console.error('Failed to copy text: ', err);
      setError("Failed to copy key to clipboard.");
    }
  };

  if (initialFetchInProgress) {
    return (
      <div className={`flex flex-col justify-center items-center ${sideBarOpen ? "w-[60vw]" : "w-[60vw]"} h-screen mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg`}>
        <Spinner />
        <p className="mt-4 text-lg text-slate-600">Loading your key information...</p>
      </div>
    );
  }

  return (
    <div className={`
    ${sidebarWidth} 
    ${layoutClasses} 
    mx-auto p-4 sm:p-6 bg-white shadow-lg 
    rounded-lg space-y-6 flex flex-col
  `}>
      <h2 className="text-3xl font-semibold text-slate-800 text-center mb-6">
        Cryptographic Key Management {/* Changed title slightly */}
      </h2>

      <button
        onClick={generateKeys}
        disabled={isGeneratingLoading || !!publicKey} // MODIFIED: Disabled if loading OR if publicKey exists
        className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:bg-blue-400 disabled:cursor-not-allowed"
      >
        {isGeneratingLoading ? <Spinner /> : 'Generate Keys'} {/* MODIFIED: Simplified text */}
      </button>
      {!!publicKey && (
        <p className="text-center text-sm text-gray-500 -mt-4">
          You already have keys. To generate new ones, existing keys must be removed first (feature not available here).
        </p>
      )}


      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {(publicKey || !initialFetchInProgress) && (
        <div className="space-y-2 p-4 border border-gray-200 rounded-md bg-gray-50">
          <label htmlFor="publicKey" className="block text-lg font-medium text-slate-700">
            Public Key
          </label>
          <div className="flex items-start space-x-2">
            <textarea
              id="publicKey"
              readOnly
              value={publicKey || "No public key found. Click 'Generate Keys' to create one."}
              className={`w-full flex-grow h-16 p-2.5 border ${publicKey ? 'border-gray-300 text-gray-900' : 'border-gray-200 text-gray-500'} rounded-md font-mono text-sm bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
              aria-label="Public Key"
              placeholder="Public key will appear here..."
            />
            {publicKey && (
              <button
                onClick={() => handleCopy(publicKey, 'public')}
                title="Copy public key"
                className="p-2 rounded-md text-gray-500 hover:text-green-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-150 flex-shrink-0"
              >
                {copiedField === 'public' ? <CheckIcon className="cursor-pointer w-5 h-5 text-green-500" /> : <ClipboardIcon className="cursor-pointer w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      )}


      {privateKey && (
        <div className="space-y-3 p-4 border border-gray-200 rounded-md bg-gray-50">
          <h3 className="text-lg font-medium text-slate-700">Private Key</h3>
          {!showPrivateKey ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Enter your account password to view and copy the private key.
              </p>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                placeholder="Account Password"
                className="text-black placeholder:text-gray-400 w-full p-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                onKeyDown={(e) => e.key === 'Enter' && handleRevealPrivateKey()}
              />
              <button
                onClick={handleRevealPrivateKey}
                className="cursor-pointer w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-150"
              >
                Reveal Private Key
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-start space-x-2">
                <textarea
                  readOnly
                  value={privateKey}
                  className="w-full flex-grow h-16 p-2.5 border border-gray-300 text-gray-900 rounded-md font-mono text-sm bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Private Key"
                />
                <button
                  onClick={() => handleCopy(privateKey, 'private')}
                  title="Copy private key"
                  className="p-2 rounded-md text-gray-500 hover:text-green-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-150 flex-shrink-0"
                >
                  {copiedField === 'private' ? <CheckIcon className="cursor-pointer w-5 h-5 text-green-500" /> : <ClipboardIcon className="cursor-pointer w-5 h-5" />}
                </button>
              </div>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={handleHidePrivateKey}
                  className="cursor-pointer flex-grow bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 transition duration-150"
                >
                  Hide Private Key
                </button>
              </div>
              <p className="text-center mt-3 text-xs text-red-700 bg-red-100 p-3 rounded-md border border-red-200">
                <strong>Security Warning:</strong> Keep your private key extremely secure. Do not share it.
              </p>
            </>
          )}
        </div>
      )}

      {!publicKey && !initialFetchInProgress && (
        <div className="text-center text-gray-500 py-4 flex-grow flex flex-col justify-center items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16 text-gray-400 mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
          </svg>
          <p className="text-lg">No cryptographic keys found for your account.</p>
          <p className="text-sm">Click the "Generate Keys" button above to create a new pair.</p>
        </div>
      )}
    </div>
  );
}