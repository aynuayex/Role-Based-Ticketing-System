import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import useRefreshToken from "../hooks/useRefreshToken";
import { Outlet } from "react-router";

interface PersistLoginProps {
  children?: React.ReactNode;
}

const PersistLogin = ({ children }: PersistLoginProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const { auth, persist } = useAuth();
  const refresh = useRefreshToken();

  useEffect(() => {
    let isMounted = true;
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    if (!auth.accessToken && persist) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }
    return () => {
      isMounted = false;
    };
  }, [persist, refresh, auth.accessToken]);

  return (
    <>
      {!persist ? (
        children || <Outlet />
      ) : isLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <div className="size-5 animate-spin" />
        </div>
      ) : (
        children || <Outlet />
      )}
    </>
  );
};

export default PersistLogin;
