/**
 * Hotel PMS - Theme Provider Component
 * Provides dark/light mode theme context
 */

import * as React from 'react';

type Theme = 'dark' | 'light';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeProviderContext = React.createContext<ThemeProviderState | undefined>(undefined);

/**
 * ThemeProvider component
 * Manages theme state and applies it to the document
 */
export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'hotel-pms-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey) as Theme;
      // Only accept 'light' or 'dark', default to 'light' for any other value
      return stored === 'dark' || stored === 'light' ? stored : defaultTheme;
    }
    return defaultTheme;
  });

  // Apply theme to document
  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const setTheme = React.useCallback(
    (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme);
      setThemeState(newTheme);
    },
    [storageKey]
  );

  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme, setTheme]
  );

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

/**
 * useTheme hook
 * Access theme context from any component
 */
export function useTheme() {
  const context = React.useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
