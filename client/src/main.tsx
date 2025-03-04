import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./contexts/AuthProvider.tsx";
import ThemeContextProvider from "./contexts/theme-context.tsx";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeContextProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
      <Toaster />
    </ThemeContextProvider>
  </React.StrictMode>
);
