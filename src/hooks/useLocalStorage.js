import { useState } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try { const item = localStorage.getItem(key); return item ? JSON.parse(item) : initialValue; }
    catch { return initialValue; }
  });
  const set = (val) => {
    setValue(val);
    localStorage.setItem(key, JSON.stringify(val));
  };
  return [value, set];
};
