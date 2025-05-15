'use client'; // This component uses client-side interactivity (useState, onSubmit)

import React, { useState } from 'react';
import Link from 'next/link'; // For the "Log In" link
import { Eye, EyeOff } from "lucide-react";

export default function SignUpPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        // Basic client-side validation
        if (!name.trim() || !email.trim() || !password.trim()) {
            setError('All fields are required.');
            setIsLoading(false);
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            setIsLoading(false);
            return;
        }

        // Simulate API call
        console.log('Submitting:', { name, email, password });
        try {
            // Replace with your actual API call
            // await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
            alert('Signup successful (simulated)! Check console for data.');
            // Reset form or redirect
        } catch (err: any) {
            console.error('Signup error:', err);
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 md:p-10">
                <h1 className="text-3xl font-bold text-center text-slate-900 mb-8">
                    Create Account
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-slate-700 sr-only"
                        >
                            Full Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Full Name"
                            className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-full  shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-slate-900"
                        />
                    </div>

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
                            className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-full  shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-slate-900"
                        />
                    </div>

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

                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="rounded-full w-full flex justify-center py-3 px-4 border border-transparent  shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </div>
                </form>

                <p className="mt-8 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" legacyBehavior>
                        <a className="font-medium text-indigo-600 hover:text-indigo-500">
                            Log In
                        </a>
                    </Link>
                </p>
            </div>
        </div>
    );
}