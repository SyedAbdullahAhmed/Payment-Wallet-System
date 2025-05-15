'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { formatCurrency, formatDate } from '@/app/utils/currencyFormatter'; // Adjust path

// Import Chart.js components and registration
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler, // For area fill in line charts
  TimeScale, // For time-based x-axis
  TimeSeriesScale, // Alternative for time series
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns'; // Adapter for date/time scales

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
  TimeSeriesScale
);

interface Transaction {
  id: string;
  type: 'sent' | 'received';
  description: string;
  amount: number;
  date: string; // ISO date string
  runningBalance: number;
}

const initialTransactionsData: Omit<Transaction, 'runningBalance'>[] = [
  { id: 't0', type: 'received', description: 'Initial Balance Deposit', amount: 500, date: new Date(2023, 9, 25, 9, 0).toISOString() }, // Month is 0-indexed
  { id: 't1', type: 'received', description: 'From Acme Corp Payroll', amount: 2500, date: new Date(2023, 10, 1, 9, 0).toISOString() },
  { id: 't2', type: 'sent', description: 'Rent Payment', amount: 1200, date: new Date(2023, 10, 1, 14, 30).toISOString() },
  { id: 't3', type: 'received', description: 'Freelance Project A', amount: 550, date: new Date(2023, 10, 5, 11, 15).toISOString() },
  { id: 't4', type: 'sent', description: 'Groceries', amount: 150.75, date: new Date(2023, 10, 6, 17, 0).toISOString() },
  { id: 't5', type: 'sent', description: 'To Charlie Brown', amount: 75, date: new Date(2023, 10, 10, 10, 0).toISOString() },
  { id: 't6', type: 'received', description: 'Refund from Online Store', amount: 49.99, date: new Date(2023, 10, 12, 15, 45).toISOString() },
  { id: 't7', type: 'received', description: 'Stock Dividend', amount: 120, date: new Date(2023, 11, 3, 10, 0).toISOString() },
  { id: 't8', type: 'sent', description: 'Utilities Bill', amount: 85.50, date: new Date(2023, 11, 5, 12, 0).toISOString() },
  { id: 't9', type: 'received', description: 'Project B Payment', amount: 750, date: new Date(2023, 11, 15, 16, 0).toISOString() },
];
// Note: Initial Balance is now the first transaction for charting simplicity.

export default function Dashboard({sideBarOpen}: any) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalBalance, setTotalBalance] = useState<number>(0);

  // --- Chart Data States ---
  const [balanceTrendData, setBalanceTrendData] = useState<any>(null);
  const [monthlySentData, setMonthlySentData] = useState<any>(null);
  const [monthlyReceivedData, setMonthlyReceivedData] = useState<any>(null);

  useEffect(() => {
    let currentBalance = 0; // Start from zero if first transaction is initial balance
    const processedTransactions = initialTransactionsData
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(tx => {
        if (tx.type === 'received') {
          currentBalance += tx.amount;
        } else {
          currentBalance -= tx.amount;
        }
        return { ...tx, runningBalance: currentBalance };
      });
    setTransactions(processedTransactions);
    setTotalBalance(currentBalance);

    // --- Prepare data for charts ---
    // Balance Trend Chart Data
    setBalanceTrendData({
      labels: processedTransactions.map(tx => new Date(tx.date)),
      datasets: [
        {
          label: 'Balance',
          data: processedTransactions.map(tx => tx.runningBalance),
          borderColor: 'rgb(79, 70, 229)', // indigo-600
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          tension: 0.1,
          fill: true,
          pointRadius: 2,
          pointHoverRadius: 5,
        },
      ],
    });

    // Monthly Sent/Received Aggregation
    const aggregateMonthly = (type: 'sent' | 'received') => {
      const monthlyAgg: { [monthYear: string]: number } = {};
      processedTransactions
        .filter(tx => tx.type === type)
        .forEach(tx => {
          const date = new Date(tx.date);
          // Using YYYY-MM for proper sorting, then formatting for display
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          monthlyAgg[monthKey] = (monthlyAgg[monthKey] || 0) + tx.amount;
        });

      const sortedMonthKeys = Object.keys(monthlyAgg).sort();
      return {
        labels: sortedMonthKeys.map(key => {
          const [year, month] = key.split('-');
          return new Date(parseInt(year), parseInt(month) -1 ).toLocaleString('default', { month: 'short', year: '2-digit' });
        }),
        data: sortedMonthKeys.map(key => monthlyAgg[key]),
      };
    };

    const sentAgg = aggregateMonthly('sent');
    setMonthlySentData({
      labels: sentAgg.labels,
      datasets: [{
        label: 'Sent',
        data: sentAgg.data,
        backgroundColor: 'rgba(220, 38, 38, 0.6)', // red-600
        borderColor: 'rgb(220, 38, 38)',
        borderWidth: 1,
      }],
    });

    const receivedAgg = aggregateMonthly('received');
    setMonthlyReceivedData({
      labels: receivedAgg.labels,
      datasets: [{
        label: 'Received',
        data: receivedAgg.data,
        backgroundColor: 'rgba(22, 163, 74, 0.6)', // green-600
        borderColor: 'rgb(22, 163, 74)',
        borderWidth: 1,
      }],
    });

  }, []);

  // --- Chart Options ---
  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Minimalist, legend can be off
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
              let label = context.dataset.label || '';
              if (label) {
                  label += ': ';
              }
              if (context.parsed.y !== null) {
                  label += formatCurrency(context.parsed.y);
              }
              return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false, // For balance, don't always start at zero
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value, 'USD').replace('.00', ''); // Shorter ticks
          }
        }
      },
    }
  };

  const timeChartOptions = {
     ...commonChartOptions,
     scales: {
         x: {
             type: 'time' as const, // Crucial for date-fns adapter
             time: {
                 unit: 'month' as const,
                 tooltipFormat: 'MMM dd, yyyy', // e.g., Aug 20, 2023
                 displayFormats: {
                     month: 'MMM yy' // e.g., Aug 23
                 }
             },
             ticks: {
                 maxRotation: 0,
                 autoSkipPadding: 20,
             }
         },
         y: {
             ...commonChartOptions.scales.y,
             beginAtZero: false, // Balance can go below 0
         },
     }
  };

 const barChartOptions = (axisLabel?: string) => ({
     ...commonChartOptions,
     plugins: {
         ...commonChartOptions.plugins,
         title: { display: false }, // Title can be in HTML
     },
     scales: {
         x: {
             grid: { display: false },
         },
         y: {
             ...commonChartOptions.scales.y,
             beginAtZero: true, // Amounts usually start at 0 for bar charts
             title: { display: !!axisLabel, text: axisLabel }
         },
     }
 });


  return (
    <div className={`h-full ${sideBarOpen ? "w-[80vw]" : "w-[95vw]" }  bg-slate-100 p-4 sm:p-6 lg:p-8`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* First Half: Totals and Plots */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white shadow-lg rounded-xl p-6 flex flex-col justify-center items-center text-center">
            <h2 className="text-sm font-medium text-slate-500 uppercase">Total Balance</h2>
            <p className="text-4xl font-bold text-slate-800 mt-2">
              {formatCurrency(totalBalance)}
            </p>
          </div>

          <div className="md:col-span-2 bg-white shadow-lg rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-700 mb-1">Balance Over Time</h3>
            <p className="text-sm text-slate-500 mb-4">Track your account balance trend.</p>
            <div className="h-60 sm:h-72"> {/* Adjusted height for chart */}
              {balanceTrendData ? (
                <Line options={timeChartOptions as any} data={balanceTrendData} />
              ) : (
                <div className="h-full bg-slate-50 border border-dashed border-slate-300 rounded-md flex items-center justify-center text-slate-400">
                  Loading chart...
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-700 mb-1">Monthly Sent</h3>
            <p className="text-sm text-slate-500 mb-4">
              Total payments sent per month.
            </p>
            <div className="h-60 sm:h-72"> {/* Adjusted height for chart */}
              {monthlySentData ? (
                <Bar options={barChartOptions() as any} data={monthlySentData} />
              ) : (
                <div className="h-full bg-red-50 border border-dashed border-red-200 rounded-md flex items-center justify-center text-red-400">
                 Loading chart...
                </div>
              )}
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-700 mb-1">Monthly Received</h3>
            <p className="text-sm text-slate-500 mb-4">
              Total payments received per month.
            </p>
            <div className="h-60 sm:h-72"> {/* Adjusted height for chart */}
              {monthlyReceivedData ? (
                <Bar options={barChartOptions() as any} data={monthlyReceivedData} />
              ) : (
                <div className="h-full bg-green-50 border border-dashed border-green-200 rounded-md flex items-center justify-center text-green-400">
                  Loading chart...
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Second Half: Transaction Logs (Same as before) */}
        <section className="bg-white shadow-lg rounded-xl p-0 sm:p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 px-4 sm:px-0 pt-4 sm:pt-0">
            Transaction Logs
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm text-left text-slate-700">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                <tr>
                  <th scope="col" className="px-4 py-3">Date</th>
                  <th scope="col" className="px-4 py-3">Description</th>
                  <th scope="col" className="px-4 py-3 text-right">Amount</th>
                  <th scope="col" className="px-4 py-3 text-right">Running Balance</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((tx, index) => (
                    <tr key={tx.id} className={`border-b border-slate-100 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {formatDate(tx.date, { month: 'short', day: 'numeric', year: '2-digit', hour: 'numeric', minute: '2-digit'})}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-medium ${tx.type === 'sent' ? 'text-red-600' : 'text-green-600'}`}>
                          {tx.type === 'sent' ? 'Sent: ' : 'Received: '}
                        </span>
                        {tx.description}
                      </td>
                      <td className={`px-4 py-3 text-right font-medium whitespace-nowrap ${tx.type === 'sent' ? 'text-red-600' : 'text-green-600'}`}>
                        {tx.type === 'sent' ? '-' : '+'}
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-600 whitespace-nowrap">
                        {formatCurrency(tx.runningBalance)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-slate-500">
                      No transactions yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}