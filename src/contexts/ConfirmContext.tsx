import React, { createContext, useContext, useState, type ReactNode } from 'react';
import ConfirmModal from '../components/ConfirmModal/ConfirmModal';

type ConfirmContextType = {
  showConfirm: (title: string, message: string) => Promise<boolean>;
};

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
};

type ConfirmProviderProps = {
  children: ReactNode;
};

export const ConfirmProvider: React.FC<ConfirmProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [resolvePromise, setResolvePromise] = useState<(value: boolean) => void>(() => {});

  const showConfirm = (title: string, message: string): Promise<boolean> => {
    setTitle(title);
    setMessage(message);
    setIsOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolvePromise(() => resolve);
    });
  };

  const handleConfirm = () => {
    resolvePromise(true);
    setIsOpen(false);
  };

  const handleCancel = () => {
    resolvePromise(false);
    setIsOpen(false);
  };

  return (
    <ConfirmContext.Provider value={{ showConfirm }}>
      {children}
      <ConfirmModal
        isOpen={isOpen}
        title={title}
        message={message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmContext.Provider>
  );
};
