// components/Modal
//.js
import React, { useEffect } from 'react';
import clsx from 'clsx';

const Modal = ({ show, type, message, onClose }: any) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose(); // auto close after 3 seconds
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const styles: any = {
    success: 'bg-green-100 text-green-700 border-green-400',
    error: 'bg-red-100 text-red-700 border-red-400',
  };

  return (
    <div className="fixed top-5 right-5 z-50">
      <div
        className={clsx(
          'px-4 py-3 rounded-lg border shadow-lg min-w-[250px] max-w-xs transition-all duration-300',
          styles[type]
        )}
      >
        <strong className="capitalize">{type}:</strong>
        <p className="mt-1 text-sm">{message}</p>
      </div>
    </div>
  );
};

export default Modal;
