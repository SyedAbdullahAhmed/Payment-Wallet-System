'use client'; // This component uses client-side interactivity (useState, onSubmit)

import React, { useState } from 'react';
import Link from 'next/link'; // For the "Log In" link
import { Eye, EyeOff } from "lucide-react";
import Spinner from '@/app/components/Spinner';
import { z } from 'zod';
import wait from '@/app/utils/wait';



export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formErrors, setFormErrors] = useState<{ name?: string; email?: string; password?: string }>({});


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);
    setFormErrors({}); // Reset individual field errors



    const schema = z.object({
      name: z
        .string()
        .min(1, "Full name is required")
        .max(50, "Name must be under 50 characters")
        .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),

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

    const result = schema.safeParse({ name, email, password });

    if (!result.success) {
      const fieldErrors: { name?: string; email?: string; password?: string } = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof typeof fieldErrors;
        fieldErrors[field] = issue.message;
      });
      setFormErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      await wait(3000);
      console.log('Submitting:', { name, email, password });
      alert('Signup successful (simulated)! Check console for data.');
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
            {formErrors.name && (
              <p className="text-sm text-red-600 ">{formErrors.name}</p>
            )}
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
            {formErrors.email && (
              <p className="text-sm text-red-600">{formErrors.email}</p>
            )}
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
              {show ? <EyeOff size={18} color='black' /> : <Eye size={18} color='black' />}
            </div>
            {formErrors.password && (
              <p className="text-sm text-red-600 ">{formErrors.password.length > 15 ? formErrors.password.slice(0, 45) + '...' : formErrors.password}</p>
            )}
          </div>


          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer rounded-full w-full flex justify-center py-3 px-4 border border-transparent  shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Spinner /> : 'Sign Up'}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/signin" className="hover:underline font-medium text-indigo-600 hover:text-indigo-500" >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}