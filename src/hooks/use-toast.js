// src/hooks/use-toast.js
import { useState, useCallback } from 'react';

export function useToast() {
  const [toastMessage, setToastMessage] = useState(null);

  const toast = useCallback(({ title, description }) => {
    setToastMessage({ title, description });
    // Optionally: set a timeout to clear it after a few seconds
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  return {
    toast,
    toastMessage, // export this so you can render it in a Toast component
  };
}
