'use client';

import React, { useState, useEffect } from 'react';
import { EyeIcon } from './EyeIcon';
import NotificationModal from './Notification';
import Navbar from '@/app/components/Navbar';
import Cookies from 'js-cookie';
import axios from 'axios';
import { BASE_URL } from "@/contants"


export interface Notification {
  id: string;
  senderName: string;
  receiverName: string;
  amount: number;
  date: string; // ISO date string or similar
  type: 'sent' | 'received'; // To determine message format
  time?: string
  createdAt: string
}


const NotificationsList = ({ sideBarOpen }: any) => {



  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchNotfications = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/notifications/my-notifications`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get('token')}`
            }
          }
        );
        console.log(res.data.data.transactionTransformed);
        setNotifications(res.data.data.transactionTransformed);
      } catch (error) {
        // console.error('Error fetching keys:', error);
      }
    }

    fetchNotfications();
  }, []);


  const handleViewDetails = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null); // Important to clear after closing
  };

  const formatDateShort = (dateString: string) => {
    console.log(dateString)
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  const formatAmount = (amount: number) => {
    return amount > 0 
      ? amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
      : 0

  }

  return (
    <div className="flex flex-col" >
      <Navbar />
      <div className={`${sideBarOpen ? "w-[80vw]" : "w-[95vw]"} ml-10 p-4 pt-10`}>
        <h2 className="text-4xl ml-4 font-semibold text-slate-800 mb-6">Notifications</h2>
        {notifications.length === 0 ? (
          <p className="text-center text-gray-500">No new notifications.</p>
        ) : (
          <div className="space-y-3">
            {notifications && notifications?.map((notif,index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex-grow pr-4">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {notif.type === 'received' ? (
                      <>
                        <span className='text-lg' > <span className="font-semibold text-lg text-indigo-600">{notif.senderName}</span> sent you{' '}</span>
                        <span className="font-semibold text-lg">{formatAmount(notif?.amount)}</span>
                      </>
                    ) : (
                      <>
                        <span className='text-lg' >You sent <span className="text-lg font-semibold">{formatAmount(notif?.amount)}</span> to{' '}</span>
                        <span className="font-semibold text-lg text-indigo-600">{notif.receiverName}</span>
                      </>
                    )}
                    <span className=" text-gray-500 text-lg ml-1">on {formatDateShort(notif?.createdAt)} at {notif.time}</span>
                  </p>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={() => handleViewDetails(notif)}
                    className="p-1.5 text-indigo-500 cursor-pointer hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                    title="View Details"
                    aria-label="View notification details"
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <NotificationModal
          notification={selectedNotification}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default NotificationsList;



// *) post video on linkedin
// *) give video to whatsapp


// - TODO: complete dashboard api's
// - send some payment across acc

// refactor code
// web name 
// remove browser errors

// final testing
// npm run build

// deploy
