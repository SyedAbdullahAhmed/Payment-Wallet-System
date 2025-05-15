'use client'; // This component uses client-side interactivity (useState, onSubmit)

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        // Basic client-side validation
        if (!email.trim() || !password.trim()) {
            setError('Both email and password are required.');
            setIsLoading(false);
            return;
        }

        // Simulate API call
        console.log('Logging in with:', { email, password });
        try {
            // Replace with your actual API call:
            // const response = await fetch('/api/login', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ email, password }),
            // });
            // if (!response.ok) {
            //   const errorData = await response.json();
            //   throw new Error(errorData.message || 'Login failed');
            // }
            // const data = await response.json();
            // console.log('Login successful:', data);
            // Redirect user or store session/token

            // Simulate success after 1.5 seconds
            await new Promise(resolve => setTimeout(resolve, 1500));
            alert('Login successful (simulated)! Check console for data.');
            // Reset form or redirect
            // setEmail('');
            // setPassword('');

        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || 'Invalid email or password.'); // Generic error for login
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 md:p-10">
                <h1 className="text-3xl font-bold text-center text-slate-900 mb-8">
                    Log In to Your Account
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-slate-700 sr-only"
                        >
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email address"
                            className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-slate-900"
                        />
                    </div>

                    <div>
                        <div className="relative">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-slate-700 sr-only"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type={show ? "text" : "password"}
                                autoComplete="new-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="appearance-none block w-full px-4 py-3 pr-12 border border-gray-300 rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-slate-900"
                            />
                            <div
                                className="absolute inset-y-0 right-4 flex items-center cursor-pointer"
                                onClick={() => setShow(!show)}
                            >
                                {show ? <EyeOff size={18} /> : <Eye size={18} />}
                            </div>
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Logging In...' : 'Log In'}
                        </button>
                    </div>
                </form>

                <p className="mt-8 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link href="/signup" legacyBehavior>
                        <a className="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign Up
                        </a>
                    </Link>
                </p>
            </div>
        </div>
    );
}