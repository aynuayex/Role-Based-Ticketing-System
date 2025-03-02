// import { useAuth } from "@clerk/clerk-react";
import PersistLogin from "@/contexts/PersistLogin";
import RequireAuth from "@/contexts/RequireAuth";
import {
  Outlet,
  // useNavigate
} from "react-router";

export default function DashboardLayout() {
  // const { userId, isLoaded } = useAuth();
  // const navigate = useNavigate();

  // React.useEffect(() => {
  //   if (!userId) {
  //     navigate("/sign-in");
  //   }
  // }, [navigate, userId]);

  // if (!isLoaded) return "Loading...";

  return (
    <PersistLogin>
      <RequireAuth>
        <Outlet />
      </RequireAuth>
    </PersistLogin>
  );
}
