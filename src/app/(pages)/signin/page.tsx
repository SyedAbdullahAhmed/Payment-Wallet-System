'use client'; // This component uses client-side interactivity (useState, onSubmit)

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import Spinner from '@/app/components/Spinner';
import wait from '@/app/utils/wait';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { BASE_URL } from "@/contants";
import Cookies from 'js-cookie';


const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .max(20, "Password cannot exceed 20 characters")
        .regex(/[a-z]/, "Password must include at least one lowercase letter")
        .regex(/[A-Z]/, "Password must include at least one uppercase letter")
        .regex(/\d/, "Password must include at least one number")
        .regex(/[@$!%*?&#]/, "Password must include at least one special character"),
});


export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

    const router = useRouter();

    useEffect(() => {
        const verify = async () => {
            const token = Cookies.get('token')
            if (token) router.push("/dashboard")
        }
        verify()
    }, [])


    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        setFieldErrors({}); // clear previous errors

        const result = loginSchema.safeParse({ email, password });

        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;
            setFieldErrors({
                email: errors.email?.[0],
                password: errors.password?.[0],
            });
            setIsLoading(false);
            return;
        }

        // Simulate API call
        try {
            setIsLoading(true);
            const data = {
                email,
                password
            }
            setIsLoading(true);
            const res = await axios.post(`${BASE_URL}/api/user/signin`, data, {
                withCredentials: true
            });
            console.log(res.data.message)
            await wait(2000);
            toast.success(res.data.message);
            // debugger;
            Cookies.set('token', res.data.data.token, { expires: new Date(Date.now() + 24 * 60 * 60 * 1000) })
            setEmail('');
            setPassword('');

            router.push('/dashboard')
        } catch (err: any) {
            console.error('Verification error:', err?.response?.data?.message);
            toast.error(err?.response.data?.message || err?.messsage)
            setError(err?.message || 'An unexpected error occurred.');
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

                <div className="space-y-6">
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
                        {fieldErrors.email && (
                            <p className="text-sm text-red-600 mt-1">{fieldErrors.email}</p>
                        )}
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
                                {show ? <EyeOff size={18} color='black' /> : <Eye size={18} color='black' />}
                            </div>
                        </div>
                        {fieldErrors.password && (
                            <p className="text-sm text-red-600 ">{fieldErrors.password.length > 15 ? fieldErrors.password.slice(0, 45) + '...' : fieldErrors.password}</p>
                        )}

                    </div>


                    <div>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className=" cursor-pointer w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Spinner /> : 'Sign In'}
                        </button>
                    </div>
                </div>

                <p className="mt-8 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link href="/signup" className="hover:underline font-medium text-indigo-600 hover:text-indigo-500" >
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}