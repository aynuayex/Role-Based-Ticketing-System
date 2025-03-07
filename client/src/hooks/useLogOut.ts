import axios from "@/api/axios";
import toast from "react-hot-toast";

const useLogOut = () => {
  const logOut = async () => {
    try {
      const response = await axios.get("/users/logout");
      console.log(response);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (!err?.response) {
        toast.error("Server can not be reached, Please Try again later!");
      }
      console.error(err);
    }
  };

  return logOut;
};

export default useLogOut;
