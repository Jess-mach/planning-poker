import React, { useState, useEffect } from 'react';
import './Toast.css';

export type ToastMessage = {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
};

type ToastProps = {
  toast: ToastMessage;
  onClose: (id: number) => void;
};

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose(toast.id), 300);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [toast, onClose]);

  return (
    <div className={`toast ${toast.type} ${visible ? 'show' : ''}`}>
      {toast.message}
    </div>
  );
};

export default Toast;
