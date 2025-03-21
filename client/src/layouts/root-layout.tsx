import { Outlet, useLocation, useNavigate } from "react-router";
import car from "@/assets/car.svg";
import MainNav from "@/components/main-nav";
import ThemeSwitch from "@/components/theme-switch";
import ContactPage from "@/components/contact";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import useLogOut from "@/hooks/useLogOut";
import useAuth from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function RootLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();

  const logOut = useLogOut();
  const { auth, setAuth } = useAuth();

  const handleLogout = () => {
    queryClient.clear(); // Clears all cached data, forcing a fresh fetch on login(otherwise the data would be stale)
    logOut();
    setAuth({
      id: "",
      email: "",
      fullName: "",
      role: "",
      accessToken: "",
      emailVerified: true
    });
    setTimeout(() => {
      navigate("/");
    }, 0); // Ensures auth state updates before navigation
    toast.success("You have Logged Out of your account!");
  };

  return (
    <>
      <header>
        <div
          className="bg-[#fbe2e3] -z-50 absolute top-[-6rem] right-[11rem] w-[31.25rem] h-[31.25rem] rounded-full
         blur-[10rem] sm:w-[68.75rem] dark:bg-[#946263]"
        ></div>
        <div
          className="bg-[#dbd7fb] -z-50 absolute top-[-1rem] left-[-35rem] w-[50rem] h-[31.25rem] rounded-full
         blur-[10rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#676394] "
        ></div>
        <div className="flex px-4">
          <div className="mr-32 hidden md:block my-2">
            <img src={car} width="100px" height="100px" alt="car logo" />
          </div>
          <div className="w-full flex items-center justify-around h-20 border-b">
            <MainNav />
            <ThemeSwitch />
            {location.pathname !== "/sign-in" &&
              location.pathname !== "/sign-up" &&
              location.pathname !== "/verify-email" &&
              (auth?.accessToken ? (
                <Button onClick={handleLogout}>Log Out</Button>
              ) : (
                <Button onClick={() => navigate("/sign-in")}>Log In</Button>
              ))}
          </div>
        </div>
      </header>
      <main className="px-4">
        <Outlet />
      </main>
      <footer>
        <ContactPage />
        <Footer />
      </footer>
    </>
  );
}
