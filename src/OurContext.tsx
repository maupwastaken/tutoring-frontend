import { createContext } from "react";
import { User } from "./Models";

interface IOurContext {
  theme: "light" | "dark";
  setTheme: (newTheme: "light" | "dark") => void;
  user: User | null;
  setUser: (newUser: User | null) => void;
  cookieConsent: boolean;
  setCookieConsent: (newValue: boolean) => void;
  cookieModalVisible: boolean;
  setCookieModalVisible: (newValue: boolean) => void;
}

export const OurContext = createContext<IOurContext>({
  theme: "dark",
  setTheme: (_: string) => {},
  user: null,
  setUser: (_: User | null) => {},
  cookieConsent: false,
  setCookieConsent: (_: boolean) => {},
  cookieModalVisible: true,
  setCookieModalVisible: (_: boolean) => {},
});
