// disable eslint for this file
/* eslint-disable */

import { useState, createContext, useMemo } from 'react';
import ThemePreferences from '../Themes/ThemePreferences';

export const PreferenceContext = createContext();

export function PreferenceProvider({ children }) {
  // Set theme preference state based on localStorage or system preference
  const [themePreference, setThemePreference] = useState(
    localStorage.getItem('theme')
    || (window.matchMedia('(prefers-color-scheme: dark)').matches
      ? ThemePreferences.dark : ThemePreferences.light)
  );

  // eslint-disable-next-line max-len
  const providerValue = useMemo(() => ({
    themePreference, setThemePreference
  }), [themePreference]);

  // return context provider
  return (
    <PreferenceContext.Provider value={providerValue}>
      {children}
    </PreferenceContext.Provider>
  );
}
