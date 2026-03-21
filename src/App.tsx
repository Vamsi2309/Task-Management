import React from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { Dashboard } from "@/components/tasks/Dashboard";

export default function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  );
}
