
"use client";

import { useState, useEffect } from 'react';

/**
 * A custom hook to auto-save some data (e.g., code from an editor) to localStorage.
 * @param data The data to be saved.
 * @param key The localStorage key to save the data under.
 * @param delay The debounce delay in milliseconds.
 * @returns An object containing the saving state.
 */
export function useAutoSave<T>(data: T, key: string, delay = 1000) {
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setIsSaving(true);
      try {
        const serializedData = JSON.stringify(data);
        localStorage.setItem(key, serializedData);
      } catch (error) {
        console.error("Failed to save to localStorage", error);
      }
      
      // Simulate a short delay for the saving process to be visible
      setTimeout(() => {
        setIsSaving(false);
      }, 500);

    }, delay);

    // Cleanup function to clear the timeout if the component unmounts or data changes
    return () => {
      clearTimeout(handler);
    };
  }, [data, key, delay]);

  return { isSaving };
}
