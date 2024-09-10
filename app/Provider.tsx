"use client"; // Ensures this component runs on the client side

import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "../store"; // Adjust the path to your store

interface ProviderProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProviderProps) => {
  return (
    <SessionProvider>
      <Provider store={store}>{children}</Provider>
    </SessionProvider>
  );
};

export default Providers;
