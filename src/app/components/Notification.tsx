import React from 'react';
import { XMarkIcon } from './XMarkIcon';

type Notification = {
    id: string;
    senderName: string;
    receiverName: string;
    amount: number;
    date: string;
    type: 'sent' | 'received';
};

interface NotificationModalProps {
  notification: Notification | null;
  isOpen: boolean;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  notification,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !notification) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount: number) => {
     return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }); // Adjust currency as needed
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out"
      onClick={onClose} // Close on overlay click
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalShow"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-slate-800">Notification Details</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-3 text-slate-700 ">
          <p>
            <span className="font-medium">Type:</span>{' '}
            {notification.type === 'sent' ? 'Sent Payment' : 'Received Payment'}
          </p>
          <p>
            <span className="font-medium ">Sender:</span> {notification.senderName}
          </p>
          <p>
            <span className="font-medium ">Receiver:</span> {notification.receiverName}
          </p>
          <p>
            <span className="font-medium ">Amount:</span> {formatAmount(notification.amount)}
          </p>
          <p>
            <span className="font-medium ">Date:</span> {formatDate(notification.date)}
          </p>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
      {/* Add keyframes for animation in globals.css or a style tag */}
      <style jsx global>{`
        @keyframes modalShow {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-modalShow {
          animation: modalShow 0.3s forwards;
        }
      `}</style>
    </div>
  );
};

export default NotificationModal;