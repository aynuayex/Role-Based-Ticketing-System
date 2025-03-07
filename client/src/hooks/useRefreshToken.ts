import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get("/users/refresh");
    const {id, email, fullName, accessToken, role} = response.data;
    
    setAuth((prev) => {
      console.log(JSON.stringify(prev));
      console.log(response.data);
      return { ...prev, id, email, fullName, accessToken, role };
    });

    return accessToken;
  };

  return refresh;
};

export default useRefreshToken;
