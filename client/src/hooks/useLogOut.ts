import axios from "@/api/axios";

const useLogOut = () => {
  const logOut = async () => {
    try {
      const response = await axios.get("/users/logout");
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return logOut;
};

export default useLogOut;
