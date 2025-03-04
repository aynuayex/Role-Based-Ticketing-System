// import { Toaster } from "react-hot-toast";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router";
import { RouterProvider } from "react-router/dom";

import RootLayout from "./layouts/root-layout";
import DashboardLayout from "./layouts/dashboard-layout";
import HomePage from "./routes/home";
import TicketForm from "./routes/ticket-form";
import DashboardPage, { ticketsDataLoader } from "./routes/dashboard";
// import ThemeContextProvider from "@/contexts/theme-context";
import SignUp from "./routes/sign-up";
import SignIn from "./routes/sign-in";
// import { AuthProvider } from "./contexts/AuthProvider";
import useAxiosPrivate from "./hooks/useAxiosPrivate";

function App() {
  const axiosPrivate = useAxiosPrivate();
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
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route
            index
            element={<DashboardPage />}
            loader={() => ticketsDataLoader(axiosPrivate)}
          />
          <Route
            path="ticket"
            element={<TicketForm />}
            loader={async () => null}
          />
          <Route
            path="ticket/:id"
            element={<TicketForm />}
            loader={async ({ params }) => {
              const response = await axiosPrivate.get(`/tickets/${params.id}`);
              console.log(response.data);
              return response.data;
            }}
          />
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
    // <ThemeContextProvider>
    //   <AuthProvider>
        <RouterProvider
          router={router}
          // future={{
          //   v7_startTransition: true,
          // }}
        />
    //   </AuthProvider>
    //   <Toaster />
    // </ThemeContextProvider>
  );
}

export default App;
