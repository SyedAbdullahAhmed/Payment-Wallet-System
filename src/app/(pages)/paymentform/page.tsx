'use client';

import React, { useState } from 'react';
import Link from 'next/link'; // Optional, for navigation

export default function PaymentPage() {
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState(''); // MM/YY format
  const [cvc, setCvc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Basic client-side validation
    if (!cardholderName.trim() || !cardNumber.trim() || !expiryDate.trim() || !cvc.trim()) {
      setError('All payment fields are required.');
      setIsLoading(false);
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      setError('Expiry date must be in MM/YY format.');
      setIsLoading(false);
      return;
    }
    // Add more robust validation (Luhn check for card number, expiry date in future, CVC length)
    // In a real app, this validation would be part of the payment gateway's SDK.

    // --- SIMULATION: DO NOT DO THIS IN PRODUCTION ---
    console.log('Simulating payment submission with:', {
      cardholderName,
      cardNumber: cardNumber.replace(/\s/g, ''), // Send without spaces
      expiryDate,
      cvc,
    });
    // In a real app:
    // 1. Use payment gateway's SDK to create a token from card details.
    // 2. Send the token to your backend.
    // 3. Your backend uses the token to charge the card via the payment gateway's API.

    try {
      // Simulate API call to your backend (with a token, not raw details)
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccessMessage('Payment successful! (Simulated)');
      // Optionally reset form
      // setCardholderName('');
      // setCardNumber('');
      // setExpiryDate('');
      // setCvc('');
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
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

        <form onSubmit={handleSubmit} className="space-y-6">
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
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2">
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
            </div>
            <div className="w-1/2">
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
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}
          {successMessage && (
            <p className="text-sm text-green-600 text-center">{successMessage}</p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 1.059C5.034 1.059 1.06 5.033 1.06 10c0 4.966 3.974 8.94 8.94 8.94 4.966 0 8.94-3.974 8.94-8.94 0-4.967-3.974-8.941-8.94-8.941zM9 5a1 1 0 011-1h0a1 1 0 011 1v4a1 1 0 01-1 1h0a1 1 0 01-1-1V5zm1 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
          </svg>
          <span className="text-xs text-gray-500">
            Your payment details are processed securely.
          </span>
          {/* Add logos of accepted cards here if desired */}
        </div>

         {/* Optional link to go back or to terms */}
         <p className="mt-8 text-center text-sm text-gray-600">
          <Link href="/" legacyBehavior>
            <a className="font-medium text-indigo-600 hover:text-indigo-500">
              Cancel and return to site
            </a>
          </Link>
        </p>

      </div>
    </div>
  );
}