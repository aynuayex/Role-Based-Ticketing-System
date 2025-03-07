import { useLocation, Navigate, Outlet } from "react-router";
import useAuth from "../hooks/useAuth";

interface RequireAuthProps {
  children?: React.ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const { auth } = useAuth();
  const location = useLocation();
  console.log(location);
  console.log(auth);

  return auth?.accessToken && auth.emailVerified ? (
    children || <Outlet />
  ) : (
    <Navigate to="/sign-in" />
  );
};

export default RequireAuth;
