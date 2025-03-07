import PersistLogin from "@/contexts/persist-login";
import RequireAuth from "@/contexts/require-auth";
import { Outlet } from "react-router";

export default function DashboardLayout() {
  return (
    <PersistLogin>
      <RequireAuth>
        <Outlet />
      </RequireAuth>
    </PersistLogin>
  );
}
