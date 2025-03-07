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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!persist ? (
        children || <Outlet />
      ) : isLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : (
        children || <Outlet />
      )}
    </>
  );
};

export default PersistLogin;
