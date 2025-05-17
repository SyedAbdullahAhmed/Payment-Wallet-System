'use client';

import React, { useState, useEffect } from 'react';
import Spinner from '@/app/components/Spinner';
import { z } from 'zod';
import wait from '@/app/utils/wait';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { BASE_URL } from "@/contants"
import Cookies from 'js-cookie';

export default function PaymentPage() {
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState(''); // MM/YY format
  const [cvc, setCvc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{ cardholderName?: string; cardNumber?: string; expiryDate?: string; cvc?: string; }>({});
  const router = useRouter();

  useEffect(() => {
   
    // console.log(Cookies.get());
    // console.log(Cookies.get('token'));
  }, []);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    value = value.slice(0, 16); // Max 16 digits for simplicity, some cards go up to 19
    // Add spaces for readability (optional, can be done better with a library)
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += ' ';
      }
      formattedValue += value[i];
    }
    setCardNumber(formattedValue);
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    } else if (value.length === 2 && expiryDate.length === 1 && !expiryDate.includes('/')) {
      // Add slash automatically after MM
      value += '/';
    }
    value = value.slice(0, 5); // MM/YY
    setExpiryDate(value);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4); // Max 3 or 4 digits
    setCvc(value);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);
 
    setFormErrors({}); // Reset individual field errors



    const paymentSchema = z.object({
      cardholderName: z
        .string()
        .min(1, "Cardholder name is required")
        .max(100, "Cardholder name can't exceed 100 characters")
        .regex(/^[a-zA-Z\s.'-]+$/, "Cardholder name can only contain letters, spaces, apostrophes, periods, and hyphens"),

      cardNumber: z
        .string()
        .min(19, "Card number must be 16 digits formatted as '0000 0000 0000 0000'")
        .max(19, "Card number must be 16 digits formatted as '0000 0000 0000 0000'")
        .regex(/^(\d{4} \d{4} \d{4} \d{4})$/, "Card number must be in format '0000 0000 0000 0000'"),

      expiryDate: z
        .string()
        .length(5, "Expiry date must be 5 characters in MM/YY format")
        .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry date must be in MM/YY format"),

      cvc: z
        .string()
        .min(3, "CVC must be 3 or 4 digits")
        .max(4, "CVC must be 3 or 4 digits")
        .regex(/^\d{3,4}$/, "CVC must be 3 or 4 digits"),
    });

    const result = paymentSchema.safeParse({ cardholderName, cardNumber, expiryDate, cvc });

    if (!result.success) {
      const fieldErrors: { cardholderName?: string; cardNumber?: string; expiryDate?: string; cvc?: string; } = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof typeof fieldErrors;
        fieldErrors[field] = issue.message;
      });
      setFormErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    const data = {
      cardholderName,
      cardNumber,
      expiryDate,
      cvc,
    };

    try {
      setIsLoading(true);
       const token = Cookies.get('token')

      // add new card
      const res = await axios.post(
        `${BASE_URL}/api/card/card-details`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      Cookies.remove('token')
      Cookies.set('token', res.data.data.token);
      await wait(2000);
      toast.success(res.data.message);
      setCardholderName('');
      setCardNumber('');
      setExpiryDate('');
      setCvc('');
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Payment form error:', err);
      // toast.error(err.response.data.message || err.messsage)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 md:p-10">
        <h1 className="text-3xl font-bold text-center text-slate-900 mb-2">
          Secure Payment
        </h1>
        <p className="text-center text-sm text-gray-600 mb-8">
          Enter your card details below.
        </p>

        {/* Placeholder for payment gateway element (e.g., Stripe Elements) */}
        {/* <div id="payment-element-placeholder" className="my-4 p-4 border border-dashed border-gray-300 rounded-md text-center text-gray-500">
          In a real app, the payment gateway's secure input fields (e.g., Stripe Elements) would appear here.
        </div> */}

        <div className="space-y-6">
          <div>
            <label
              htmlFor="cardholderName"
              className="block text-sm font-medium text-slate-700 sr-only"
            >
              Cardholder Name
            </label>
            <input
              id="cardholderName"
              name="cardholderName"
              type="text"
              autoComplete="cc-name"
              required
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              placeholder="Cardholder Name"
              className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-slate-900"
            />
            {formErrors.cardholderName && (
              <p className="text-sm text-red-600 mt-1 ">{formErrors.cardholderName.length > 15 ? formErrors.cardholderName.slice(0, 45) + '...' : formErrors.cardholderName}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="cardNumber"
              className="block text-sm font-medium text-slate-700 sr-only"
            >
              Card Number
            </label>
            <input
              id="cardNumber"
              name="cardNumber"
              type="text" // Use text to allow for spaces in formatting
              inputMode="numeric" // Hint for numeric keyboard on mobile
              autoComplete="cc-number"
              required
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="0000 0000 0000 0000"
              className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-slate-900"
            />
            {formErrors.cardNumber && (
              <p className="text-sm text-red-600 mt-1 ">{formErrors.cardNumber.length > 15 ? formErrors.cardNumber.slice(0, 45) + '...' : formErrors.cardNumber}</p>
            )}
          </div>

          {/* <div className="flex space-x-4"> */}
          <div >
            <label
              htmlFor="expiryDate"
              className="block text-sm font-medium text-slate-700 sr-only"
            >
              Expiry Date (MM/YY)
            </label>
            <input
              id="expiryDate"
              name="expiryDate"
              type="text" // Use text to allow for slash
              inputMode="numeric"
              autoComplete="cc-exp"
              required
              value={expiryDate}
              onChange={handleExpiryDateChange}
              placeholder="MM/YY"
              className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-slate-900"
            />
            {formErrors.expiryDate && (
              <p className="text-sm text-red-600 mt-1 ">{formErrors.expiryDate.length > 15 ? formErrors.expiryDate.slice(0, 45) + '...' : formErrors.expiryDate}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="cvc"
              className="block text-sm font-medium text-slate-700 sr-only"
            >
              CVC
            </label>
            <input
              id="cvc"
              name="cvc"
              type="text" // Use text as type="password" can sometimes be annoying for CVC
              inputMode="numeric"
              autoComplete="cc-csc"
              required
              value={cvc}
              onChange={handleCvcChange}
              placeholder="CVC"
              className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-slate-900"
            />
            {formErrors.cvc && (
              <p className="text-sm text-red-600 mt-1 ">{formErrors.cvc.length > 15 ? formErrors.cvc.slice(0, 45) + '...' : formErrors.cvc}</p>
            )}
          </div>


          <div className="pt-2">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className=" cursor-pointer w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Spinner /> : 'Submit'}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 1.059C5.034 1.059 1.06 5.033 1.06 10c0 4.966 3.974 8.94 8.94 8.94 4.966 0 8.94-3.974 8.94-8.94 0-4.967-3.974-8.941-8.94-8.941zM9 5a1 1 0 011-1h0a1 1 0 011 1v4a1 1 0 01-1 1h0a1 1 0 01-1-1V5zm1 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
          </svg>
          <span className="text-xs text-gray-500">
            Your payment details are processed securely.
          </span>
          {/* Add logos of accepted cards here if desired */}
        </div>

      </div>
    </div>
  );
}