'use client';

import React, { useState, useEffect } from 'react';
import wait from '@/app/utils/wait';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { BASE_URL } from "@/contants";
import checkUserVerified from "../utils/verifyToken"
import { useRouter } from 'next/navigation';

// Sample hardcoded card details (DISPLAY ONLY)
const HARDCODED_CARD_DETAILS = {
  cardNumber: '•••• •••• •••• 1234', // Masked card number
  expiryDate: '12/25',
  cvc: '•••', // Masked CVC
};

export default function SendPaymentForm() {
  const [receiverKey, setReceiverKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [amount, setAmount] = useState('');
  const [confirmAmount, setConfirmAmount] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const verify = async () => {
      // debugger;
      const token = Cookies.get('token')
      if (!token) router.push("/signin")
      const isVerified = await checkUserVerified(token)
      if (!isVerified) router.push("/signin")
      console.log('User verified:', isVerified)
    }

    verify()
  }, [])

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Basic Validation
    if (!receiverKey.trim()) {
      setError('Receiver Public Key is required.');
      setIsLoading(false);
      return;
    }
    // if (!privateKey.trim()) {
    //   setError('Receiver Public Key is required.');
    //   setIsLoading(false);
    //   return;
    // }
    if (!amount || !confirmAmount) {
      setError('Amount and Confirm Amount are required.');
      setIsLoading(false);
      return;
    }
    const numAmount = parseFloat(amount);
    const numConfirmAmount = parseFloat(confirmAmount);

    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount.');
      setIsLoading(false);
      return;
    }
    if (numAmount !== numConfirmAmount) {
      setError('Amounts do not match.');
      setIsLoading(false);
      return;
    }

    // Simulate API Call
    console.log('Attempting to send payment:', {
      receiverKey,
      amount: numAmount,
      // In a real app, you'd send a token representing the card, not the details
      paymentMethodIdentifier: 'pre_selected_card_token_xyz',
    });

    try {
      setIsLoading(true);
      const data = {
        receiverPublicKey: receiverKey,
        amount: numAmount,
        // senderPrivateKey: privateKey
      }
      const res = await axios.post(`${BASE_URL}/api/payment/send-payment`, data,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`
          }
        }
      );

      toast.success(res.data.message);

      // const res2 = await axios.post(`${BASE_URL}/api/payment/send-mails`,
      //   { receiverId: res.data.data.transaction.referenceId },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${Cookies.get('token')}`
      //     }
      //   }
      // );
      console.log(res.data.message)
      await wait(2000);
      // toast.success(res2.data.message);
      setAmount('')
      setConfirmAmount('')
      setReceiverKey('')
      // setPrivateKey('')

      router.push('/dashboard')
    } catch (err: any) {
      // console.error('Payment sending error:', err.response);
      toast.error(err?.response?.data?.message || err.messsage)
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white shadow-xl rounded-lg p-6 sm:p-8 my-4">
      <h2 className="text-2xl font-semibold text-slate-900 mb-6 text-center">
        Send Payment
      </h2>

      <div className="space-y-2">
        {/* Receiver Public Key */}
        <div>
          <label
            htmlFor="receiverKey"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Receiver Public Key
          </label>
          <input
            id="receiverKey"
            name="receiverKey"
            type="text"
            autoComplete="off"
            required
            value={receiverKey}
            onChange={(e) => setReceiverKey(e.target.value)}
            placeholder="Enter receiver's public key (e.g., 0xAbC...)"
            className="appearance-none block w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-slate-900"
          />
        </div>

        {/* <div>
          <label
            htmlFor="privateKey"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Sender(Your) Private Key
          </label>
          <input
            id="privateKey"
            name="privateKey"
            type="text"
            autoComplete="off"
            required
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            placeholder="Enter your's private key (e.g., 0xAbC...)"
            className="appearance-none block w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-slate-900"
          />
        </div> */}

        {/* Amount */}
        <div className="relative">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Amount (USD)
          </label>
          <div className="absolute inset-y-0 left-0 top-7 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            id="amount"
            name="amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0.01"
            autoComplete="off"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="appearance-none block w-full pl-7 pr-4 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-slate-900"
          />
        </div>

        {/* Confirm Amount */}
        <div className="relative">
          <label
            htmlFor="confirmAmount"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Confirm Amount (USD)
          </label>
          <div className="absolute inset-y-0 left-0 top-7 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            id="confirmAmount"
            name="confirmAmount"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0.01"
            autoComplete="off"
            required
            value={confirmAmount}
            onChange={(e) => setConfirmAmount(e.target.value)}
            placeholder="0.00"
            className="appearance-none block w-full pl-7 pr-4 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-slate-900"
          />
        </div>

        {/* Hardcoded Card Details Section */}
        <div className="pt-2">
          <p className="text-sm font-medium text-slate-600 mb-2">
            Payment Method (Pre-selected):
          </p>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500">
                Card Number
              </label>
              <div className="mt-1 p-2.5 block w-full border border-gray-200 rounded-md bg-gray-50 text-gray-600 sm:text-sm cursor-not-allowed">
                {HARDCODED_CARD_DETAILS.cardNumber}
              </div>
            </div>
            <div className="flex space-x-3">
              <div className="w-1/2">
                <label className="block text-xs font-medium text-gray-500">
                  Expiry Date
                </label>
                <div className="mt-1 p-2.5 block w-full border border-gray-200 rounded-md bg-gray-50 text-gray-600 sm:text-sm cursor-not-allowed">
                  {HARDCODED_CARD_DETAILS.expiryDate}
                </div>
              </div>
              <div className="w-1/2">
                <label className="block text-xs font-medium text-gray-500">
                  CVC
                </label>
                <div className="mt-1 p-2.5 block w-full border border-gray-200 rounded-md bg-gray-50 text-gray-600 sm:text-sm cursor-not-allowed">
                  {HARDCODED_CARD_DETAILS.cvc}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <p className="text-sm text-red-600 text-center">{error}</p>
        )}
        {successMessage && (
          <p className="text-sm text-green-600 text-center">{successMessage}</p>
        )}

        {/* Submit Button */}
        <div className="pt-3 flex gap-2">
          <button
            type="submit"
            onClick={() => router.push('/dashboard')}
            disabled={isLoading}
            className="cursor-pointer w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Cancelling Payment...' : 'Cancel Payment'}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="cursor-pointer w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing Payment...' : 'Send Payment'}
          </button>
        </div>
      </div>
    </div>
  );
}