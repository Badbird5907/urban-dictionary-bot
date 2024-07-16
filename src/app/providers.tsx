"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import React from "react";

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}


const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute={"class"} defaultTheme="dark">
      {children}
    </ThemeProvider>
  );
};

export default Providers;