import {
  createContext,
  type Dispatch,
  type ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";

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
      type: "UPDATE_TEXT_FIELD";
      field: "adminName" | "adminEmail" | "storeName" | "storeDescription";
      value: string;
    }
  | {
      type: "UPDATE_BOOLEAN_FIELD";
      field: "emailNotifications" | "lowStockNotifications" | "darkMode";
      value: boolean;
    }
  | {
      type: "RESET_SETTINGS";
    };

const initialSettings: SettingsState = {
  adminName: "Admin User",
  adminEmail: "admin@example.com",
  storeName: "ShopAdmin",
  storeDescription: "E-Commerce Dashboard",
  emailNotifications: true,
  lowStockNotifications: true,
  darkMode: false,
};

const SETTINGS_STORAGE_KEY = "shopadmin-settings";

function settingsReducer(
  state: SettingsState,
  action: SettingsAction,
): SettingsState {
  switch (action.type) {
    case "UPDATE_TEXT_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };

    case "UPDATE_BOOLEAN_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };

    case "RESET_SETTINGS":
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
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);

      if (!savedSettings) {
        return initialSettings;
      }

      try {
        const parsedSettings: unknown = JSON.parse(savedSettings);

        if (
          typeof parsedSettings !== "object" ||
          parsedSettings === null ||
          Array.isArray(parsedSettings)
        ) {
          return initialSettings;
        }

        const candidate = parsedSettings as Record<string, unknown>;

        return {
          adminName:
            typeof candidate.adminName === "string"
              ? candidate.adminName
              : initialSettings.adminName,
          adminEmail:
            typeof candidate.adminEmail === "string"
              ? candidate.adminEmail
              : initialSettings.adminEmail,
          storeName:
            typeof candidate.storeName === "string"
              ? candidate.storeName
              : initialSettings.storeName,
          storeDescription:
            typeof candidate.storeDescription === "string"
              ? candidate.storeDescription
              : initialSettings.storeDescription,
          emailNotifications:
            typeof candidate.emailNotifications === "boolean"
              ? candidate.emailNotifications
              : initialSettings.emailNotifications,
          lowStockNotifications:
            typeof candidate.lowStockNotifications === "boolean"
              ? candidate.lowStockNotifications
              : initialSettings.lowStockNotifications,
          darkMode:
            typeof candidate.darkMode === "boolean"
              ? candidate.darkMode
              : initialSettings.darkMode,
        };
      } catch {
        return initialSettings;
      }
    },
  );

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));

    document.documentElement.classList.toggle("dark", settings.darkMode);
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
    throw new Error("useSettings must be used within a SettingsProvider");
  }

  return context;
}
