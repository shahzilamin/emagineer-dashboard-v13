import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { DashboardState, TimeRange } from '../types';

interface DashboardContextType extends DashboardState {
  setCompany: (company: DashboardState['company']) => void;
  setView: (view: DashboardState['view']) => void;
  setTimeRange: (range: TimeRange) => void;
  toggleDarkMode: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DashboardState>(() => {
    // Check for saved preferences
    const saved = localStorage.getItem('dashboard-preferences');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fall through to defaults
      }
    }

    // Check system preference for dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    return {
      company: 'wellbefore',
      view: 'executive',
      timeRange: 'month',
      darkMode: prefersDark,
    };
  });

  // Save preferences
  useEffect(() => {
    localStorage.setItem('dashboard-preferences', JSON.stringify(state));
  }, [state]);

  // Apply dark mode to document
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  const setCompany = (company: DashboardState['company']) => {
    setState((prev) => ({ ...prev, company }));
  };

  const setView = (view: DashboardState['view']) => {
    setState((prev) => ({ ...prev, view }));
  };

  const setTimeRange = (timeRange: TimeRange) => {
    setState((prev) => ({ ...prev, timeRange }));
  };

  const toggleDarkMode = () => {
    setState((prev) => ({ ...prev, darkMode: !prev.darkMode }));
  };

  return (
    <DashboardContext.Provider
      value={{
        ...state,
        setCompany,
        setView,
        setTimeRange,
        toggleDarkMode,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
