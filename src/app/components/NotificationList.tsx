'use client';

import React, { useState } from 'react';
import { EyeIcon } from './EyeIcon';
import { TrashIcon } from './TrashIcon';
import NotificationModal from './Notification';

export interface Notification {
  id: string;
  senderName: string;
  receiverName: string;
  amount: number;
  date: string; // ISO date string or similar
  type: 'sent' | 'received'; // To determine message format
}

const initialNotifications: Notification[] = [
  { id: '1', senderName: 'Alice', receiverName: 'You', amount: 50.00, date: new Date(2023, 10, 15, 10, 30).toISOString(), type: 'received' },
  { id: '2', senderName: 'You', receiverName: 'Bob', amount: 25.50, date: new Date(2023, 10, 14, 14, 0).toISOString(), type: 'sent' },
  { id: '3', senderName: 'Charlie', receiverName: 'You', amount: 100.00, date: new Date(2023, 10, 14, 9, 15).toISOString(), type: 'received' },
  { id: '4', senderName: 'You', receiverName: 'David Corp.', amount: 1200.75, date: new Date(2023, 10, 13, 16, 45).toISOString(), type: 'sent' },
  { id: '5', senderName: 'Eve Market', receiverName: 'You', amount: 75.20, date: new Date(2023, 10, 12, 11, 0).toISOString(), type: 'received' },
];

const NotificationsList = ({sideBarOpen}: any) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const handleViewDetails = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null); // Important to clear after closing
  };

  const formatDateShort = (dateString: string) => {
     return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  const formatAmount = (amount: number) => {
     return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }); // Adjust currency as needed
  }

  return (
    <div className= {`${sideBarOpen ? "w-[80vw]" : "w-[93vw]" } p-4 pt-10`}>
      <h2 className="text-4xl font-semibold text-slate-800 mb-6">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-center text-gray-500">No new notifications.</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex-grow pr-4">
                <p className="text-sm text-slate-700 leading-relaxed">
                  {notif.type === 'received' ? (
                    <>
                      <span className='text-lg' > <span className="font-semibold text-lg text-indigo-600">{notif.senderName}</span> sent you{' '}</span>
                      <span className="font-semibold text-lg">{formatAmount(notif.amount)}</span>
                    </>
                  ) : (
                    <>
                       <span className='text-lg' >You sent <span className="text-lg font-semibold">{formatAmount(notif.amount)}</span> to{' '}</span>
                      <span className="font-semibold text-lg text-indigo-600">{notif.receiverName}</span>
                    </>
                  )}
                  <span className=" text-gray-500 text-lg ml-1">on {formatDateShort(notif.date)}</span>
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
                <button
                  onClick={() => handleDelete(notif.id)}
                  className="p-1.5 cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Delete Notification"
                  aria-label="Delete notification"
                >
                  <TrashIcon className="w-5 h-5" />
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
  );
};

export default NotificationsList;