import useAuth from './useAuth'
import useRefreshToken from './useRefreshToken';
import { axiosPrivate } from '../api/axios';
import { useEffect } from 'react';

const useAxiosPrivate = () => {
    const {auth} = useAuth();
    const refresh = useRefreshToken();

    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if(!config.headers["Authorization"]) {
                    config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        )
        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if(error?.response?.status === 403 && !prevRequest.sent) {
                    prevRequest.sent = true;
                    const newAccesstoken = await refresh();
                    prevRequest.headers["Authorization"] = `Bearer ${newAccesstoken}`;
                    return axiosPrivate(prevRequest);
                }
                return Promise.reject(error)
            }
        )
        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    },[auth, refresh])

  return axiosPrivate;
}

export default useAxiosPrivate