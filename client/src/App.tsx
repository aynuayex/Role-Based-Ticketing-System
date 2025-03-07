import { Toaster } from "react-hot-toast";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router";
import { RouterProvider } from "react-router/dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import RootLayout from "./layouts/root-layout";
import DashboardLayout from "./layouts/dashboard-layout";
import HomePage from "./routes/home";
import TicketForm from "./routes/ticket-form";
import DashboardPage from "./routes/dashboard";
import SignUp from "./routes/sign-up";
import SignIn from "./routes/sign-in";
import VerifyEmail from "./routes/verify-email";
import ThemeContextProvider from "@/contexts/theme-context";
import { AuthProvider } from "./contexts/auth-provider";

const queryClient = new QueryClient();

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route
          path="sign-in"
          element={
            <div className="flex justify-center">
              <SignIn />
            </div>
          }
        />
        <Route
          path="sign-up"
          element={
            <div className="flex justify-center">
              <SignUp />
            </div>
          }
        />
        <Route
          path="verify-email"
          element={
            <div className="flex justify-center">
              <VerifyEmail />
            </div>
          }
        />
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="ticket" element={<TicketForm />} />
          <Route path="ticket/:ticketId" element={<TicketForm />} />
        </Route>
      </Route>
    ),
    {
      future: {
        v7_relativeSplatPath: true,
        v7_startTransition: true,
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_skipActionErrorRevalidation: true,
      },
    }
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContextProvider>
        <AuthProvider>
          <RouterProvider
            router={router}
            // future={{
            //   v7_startTransition: true,
            // }}
          />
        </AuthProvider>
        <Toaster />
      </ThemeContextProvider>
    </QueryClientProvider>
  );
}

export default App;
