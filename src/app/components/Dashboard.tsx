'use client';

import React, { useState, useEffect } from 'react';
import { formatCurrency, formatDate } from '@/app/utils/currencyFormatter'; // Adjust path

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
  Filler,
  TimeScale,
  // TimeSeriesScale, // TimeScale is generally preferred for time-based x-axis
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import Navbar from '@/app/components/Navbar';
import Cookies from 'js-cookie';
import axios from 'axios';
import { BASE_URL } from "@/contants";

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
  TimeScale
  // TimeSeriesScale
);

interface ApiTransactionItem {
  id: string;
  type: 'sent' | 'received';
  amount: number | string;
  date: string;
  description?: string;
  senderName?: string;
  receiverName?: string;
}

interface Transaction {
  id: string;
  type: 'sent' | 'received';
  amount: number;
  date: string; // ISO date string
  description?: string;
  // runningBalance: number; // No longer directly used for main charts
  time?: string;
  senderName?: string;
  receiverName?: string;
}

export default function Dashboard({ sideBarOpen }: any) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // --- Chart Data States ---
  const [amountTrendData, setAmountTrendData] = useState<any>(null); // For Sent vs Received amounts line chart
  const [individualSentBarData, setIndividualSentBarData] = useState<any>(null); // For individual sent transaction bars
  const [individualReceivedBarData, setIndividualReceivedBarData] = useState<any>(null); // For individual received transaction bars

  function transformTransactions(apiItems: ApiTransactionItem[]): Transaction[] {
    return apiItems.map((item, index) => {
      const transactionDate = new Date(item.date);

      let finalDescription = item.description;
      if (!finalDescription) {
        if (item.type === 'sent') {
          finalDescription = `Sent ${item.senderName ? `from ${item.senderName} ` : ''}to ${item.receiverName || 'Unknown'}`;
        } else {
          finalDescription = `Received ${item.receiverName ? `by ${item.receiverName} ` : ''}from ${item.senderName || 'Unknown'}`;
        }
      }
      if (!finalDescription) {
          finalDescription = item.type === 'sent' ? 'Sent transaction' : 'Received transaction';
      }

      return {
        id: item.id || `tx-${Date.now()}-${index}`,
        type: item.type,
        description: finalDescription,
        amount: Number(item.amount),
        date: transactionDate.toISOString(),
        // runningBalance: 0, // Not strictly needed for these chart types
        time: `${String(transactionDate.getHours()).padStart(2, '0')}:${String(transactionDate.getMinutes()).padStart(2, '0')}`,
        senderName: item.senderName,
        receiverName: item.receiverName,
      };
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      console.log(Cookies.get('token'))
      setIsLoading(true);
      try {
        const [transactionsRes, balanceRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/notifications/my-notifications`, {
            headers: { Authorization: `Bearer ${Cookies.get('token')}` }
          }),
          axios.get(`${BASE_URL}/api/user/total-balance`, {
            headers: { Authorization: `Bearer ${Cookies.get('token')}` }
          })
        ]);

        setTotalBalance(balanceRes.data.data.totalBalance);
        const formattedTransactions = transformTransactions(transactionsRes.data.data.transactionTransformed || []);
        setTransactions(formattedTransactions);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setTransactions([]);
        setTotalBalance(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    if (isLoading) {
        setAmountTrendData(null);
        setIndividualSentBarData(null);
        setIndividualReceivedBarData(null);
        return;
    }

    if (transactions.length === 0) {
      setAmountTrendData(null);
      setIndividualSentBarData(null);
      setIndividualReceivedBarData(null);
      return;
    }

    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // --- Data for Sent vs Received Amounts Line Chart ---
    const sentAmountPoints = sortedTransactions
      .filter(tx => tx.type === 'sent')
      .map(tx => ({ x: new Date(tx.date), y: tx.amount }));

    const receivedAmountPoints = sortedTransactions
      .filter(tx => tx.type === 'received')
      .map(tx => ({ x: new Date(tx.date), y: tx.amount }));
    
    if(sentAmountPoints.length > 0 || receivedAmountPoints.length > 0) {
      setAmountTrendData({
        // Labels are automatically generated by the time scale from data points
        datasets: [
          {
            label: 'Sent Amount',
            data: sentAmountPoints,
            borderColor: 'rgb(220, 38, 38)', // Red
            backgroundColor: 'rgba(220, 38, 38, 0.1)',
            tension: 0.1,
            fill: false, // Can be true if you want area fill
            pointRadius: 3,
            pointHoverRadius: 6,
          },
          {
            label: 'Received Amount',
            data: receivedAmountPoints,
            borderColor: 'rgb(22, 163, 74)', // Green
            backgroundColor: 'rgba(22, 163, 74, 0.1)',
            tension: 0.1,
            fill: false,
            pointRadius: 3,
            pointHoverRadius: 6,
          },
        ],
      });
    } else {
      setAmountTrendData(null);
    }


    // --- Data for Individual Sent Transactions Bar Chart ---
    const individualSentTxs = sortedTransactions.filter(tx => tx.type === 'sent');
    if (individualSentTxs.length > 0) {
      setIndividualSentBarData({
        datasets: [{
          label: 'Sent Transaction Amount',
          data: individualSentTxs.map(tx => ({ x: new Date(tx.date), y: tx.amount })),
          backgroundColor: 'rgba(220, 38, 38, 0.6)', // red-600
          borderColor: 'rgb(220, 38, 38)',
          borderWidth: 1,
        }],
      });
    } else {
      setIndividualSentBarData(null);
    }

    // --- Data for Individual Received Transactions Bar Chart ---
    const individualReceivedTxs = sortedTransactions.filter(tx => tx.type === 'received');
    if (individualReceivedTxs.length > 0) {
      setIndividualReceivedBarData({
        datasets: [{
          label: 'Received Transaction Amount',
          data: individualReceivedTxs.map(tx => ({ x: new Date(tx.date), y: tx.amount })),
          backgroundColor: 'rgba(22, 163, 74, 0.6)', // green-600
          borderColor: 'rgb(22, 163, 74)',
          borderWidth: 1,
        }],
      });
    } else {
      setIndividualReceivedBarData(null);
    }

  }, [transactions, isLoading]); // Dependency: re-run when transactions or isLoading change

  // --- Chart Options ---
  const commonChartOptionsBase = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
            }
            // You could add date to tooltip title or here if needed
            // const date = new Date(context.parsed.x);
            // label += ` on ${formatDate(date, { month: 'short', day: 'numeric' })}`;
            return label;
          },
          title: function (tooltipItems: any[]) { // Add date to tooltip title
            if (tooltipItems.length > 0) {
                const date = new Date(tooltipItems[0].parsed.x);
                return formatDate(date, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
            }
            return '';
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true, // Amounts generally start at 0
        ticks: {
          callback: function (value: any) {
            return formatCurrency(value, 'USD').replace('.00', '');
          }
        }
      },
    }
  };

  const amountTrendLineChartOptions = {
    ...commonChartOptionsBase,
    plugins: {
      ...commonChartOptionsBase.plugins,
      legend: {
        display: true, // Show legend for sent/received lines
        position: 'top' as const,
      },
    },
    scales: {
      ...commonChartOptionsBase.scales,
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const, // Adjust unit based on data density (e.g., 'week', 'month')
          tooltipFormat: 'MMM dd, yyyy HH:mm',
          displayFormats: {
            day: 'MMM dd', // e.g., Aug 20
            month: 'MMM yy' // e.g., Aug 23
          }
        },
        ticks: {
          maxRotation: 0,
          autoSkipPadding: 20,
          source: 'auto' as const, // Let chart.js decide how many ticks based on space
        }
      },
    }
  };

  const individualTransactionBarChartOptions = {
    ...commonChartOptionsBase,
    plugins: {
        ...commonChartOptionsBase.plugins,
        legend: {
            display: false, // Legend might be redundant for a single series bar chart
        },
    },
    scales: {
        ...commonChartOptionsBase.scales,
        x: {
            type: 'time' as const,
            time: {
                unit: 'day' as const, // Display bars grouped by day initially
                tooltipFormat: 'MMM dd, yyyy HH:mm', // Full date in tooltip
                displayFormats: {
                    day: 'MMM dd', // Label for days
                    week: 'MMM dd',
                    month: 'MMM yyyy'
                },
            },
            ticks: {
                autoSkip: true,
                maxRotation: 45,
                minRotation: 0,
                source: 'auto' as const,
                // For more control over bar spacing on time scale, you might need to adjust adapter or use category scale with formatted labels
            },
            grid: {
                display: false
            }
        },
    },
    // Adjust bar thickness/spacing if needed
    // barPercentage: 0.8,
    // categoryPercentage: 0.9,
    // barThickness: 'flex', // or a number
    // maxBarThickness: 50, // example
  };


  const ChartPlaceholder = ({ message, type = 'default' }: { message: string, type?: 'default' | 'red' | 'green' }) => {
    let bgColor = 'bg-slate-50 border-slate-300 text-slate-400';
    if (type === 'red') bgColor = 'bg-red-50 border-red-200 text-red-400';
    if (type === 'green') bgColor = 'bg-green-50 border-green-200 text-green-400';
    return (
      <div className={`h-full border border-dashed rounded-md flex items-center justify-center ${bgColor}`}>
        {message}
      </div>
    );
  };

  return (
    <div className="flex flex-col" >
      <Navbar />
      <div className={`h-full ${sideBarOpen ? "w-[80vw]" : "w-[95vw]"}  bg-slate-100 p-4 sm:p-6 lg:p-8`}>
        <div className="max-w-7xl mx-auto space-y-8">
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 bg-white shadow-lg rounded-xl p-6 flex flex-col justify-center items-center text-center">
              <h2 className="text-sm font-medium text-slate-500 uppercase">Total Balance</h2>
              <p className="text-4xl font-bold text-slate-800 mt-2">
                {isLoading ? "..." : formatCurrency(totalBalance)}
              </p>
            </div>

            <div className="md:col-span-2 bg-white shadow-lg rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-700 mb-1">Transaction Amounts Over Time</h3>
              <p className="text-sm text-slate-500 mb-4">Shows individual sent (red) and received (green) transaction amounts.</p>
              <div className="h-60 sm:h-72">
                {isLoading ? <ChartPlaceholder message="Loading chart..." /> :
                 amountTrendData ? <Line options={amountTrendLineChartOptions as any} data={amountTrendData} /> :
                 <ChartPlaceholder message="No transaction data for trend." />}
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-700 mb-1">Individual Sent Transactions</h3>
              <p className="text-sm text-slate-500 mb-4">
                Each bar represents a single sent transaction amount.
              </p>
              <div className="h-60 sm:h-72">
                {isLoading ? <ChartPlaceholder message="Loading chart..." type="red" /> :
                 individualSentBarData ? <Bar options={individualTransactionBarChartOptions as any} data={individualSentBarData} /> :
                 <ChartPlaceholder message="No sent transactions." type="red" />}
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-700 mb-1">Individual Received Transactions</h3>
              <p className="text-sm text-slate-500 mb-4">
                Each bar represents a single received transaction amount.
              </p>
              <div className="h-60 sm:h-72">
                {isLoading ? <ChartPlaceholder message="Loading chart..." type="green" /> :
                 individualReceivedBarData ? <Bar options={individualTransactionBarChartOptions as any} data={individualReceivedBarData} /> :
                 <ChartPlaceholder message="No received transactions." type="green" />}
              </div>
            </div>
          </section>
          {/* Transaction Logs section remains commented */}
        </div>
      </div>
    </div>
  );
}