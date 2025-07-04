'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User } from 'lucide-react';
import Cookies from 'js-cookie'
import * as jose from 'jose'

const jwtConfig = {
  secret: new TextEncoder().encode('secret'),
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState<string | null>('');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) return;

        const decoded = await jose.jwtVerify(token, jwtConfig.secret);
        console.log('Token verified:', decoded);
        const email = typeof decoded?.payload?.email === 'string' ? decoded.payload.email : '';
        setEmail(email);
      } catch (err) {
        // console.error('Token verification failed:', err);
      }
    };

    verifyToken();
  }, []);

  return (
    <nav className="relative bg-white shadow dark:bg-gray-800">
      <div className="container px-6 py-4 mx-auto md:flex md:justify-between md:items-center">
        <div className="flex items-center justify-between">

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 8h16M4 16h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Navigation links */}
        <div
          className={`${isOpen ? 'translate-x-0 opacity-100' : 'opacity-0 -translate-x-full'
            } absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 md:mt-0 md:p-0 md:top-0 md:relative md:bg-transparent md:w-auto md:opacity-100 md:translate-x-0 md:flex md:items-center`}
        >
          <div className="flex flex-col md:flex-row md:mx-6">
            {[email].map((item, index) => (
              <React.Fragment  key={index}>
                <Link
                  key={item}
                  href="#"
                  className="my-2 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-2 md:my-0"
                >
                  {item}
                </Link>
                <div className='border-2 border-white rounded-full' >

                  <User />
                </div>
              </React.Fragment>
            ))}
          </div>


        </div>
      </div>
    </nav>
  );
}
