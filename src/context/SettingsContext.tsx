import {
  createContext,
  type Dispatch,
  type ReactNode,
  useContext,
  useEffect,
  useReducer,
} from 'react';

interface SettingsState {
  adminName: string;
  adminEmail: string;
  storeName: string;
  storeDescription: string;
  emailNotifications: boolean;
  lowStockNotifications: boolean;
  darkMode: boolean;
}

type SettingsAction =
  | {
      type: 'UPDATE_FIELD';
      field: keyof SettingsState;
      value: string | boolean;
    }
  | {
      type: 'RESET_SETTINGS';
    };

const initialSettings: SettingsState = {
  adminName: 'Admin User',
  adminEmail: 'admin@example.com',
  storeName: 'ShopAdmin',
  storeDescription: 'E-Commerce Dashboard',
  emailNotifications: true,
  lowStockNotifications: true,
  darkMode: false,
};

const SETTINGS_STORAGE_KEY = 'shopadmin-settings';

function settingsReducer(
  state: SettingsState,
  action: SettingsAction,
): SettingsState {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.field]: action.value,
      };

    case 'RESET_SETTINGS':
      return initialSettings;

    default:
      return state;
  }
}

interface SettingsContextValue {
  settings: SettingsState;
  dispatch: Dispatch<SettingsAction>;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined,
);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, dispatch] = useReducer(
    settingsReducer,
    initialSettings,
    () => {
      const savedSettings = localStorage.getItem(
        SETTINGS_STORAGE_KEY,
      );

      if (!savedSettings) {
        return initialSettings;
      }

      try {
        return {
          ...initialSettings,
          ...JSON.parse(savedSettings),
        } as SettingsState;
      } catch {
        return initialSettings;
      }
    },
  );

  useEffect(() => {
    localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify(settings),
    );

    document.documentElement.classList.toggle(
      'dark',
      settings.darkMode,
    );
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, dispatch }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error(
      'useSettings must be used within a SettingsProvider',
    );
  }

  return context;
}