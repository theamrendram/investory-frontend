import axios from "axios";
import getIdToken from "@/firebase/getIdToken";

const createAxiosInstance = async () => {
  const token = await getIdToken();
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export default createAxiosInstance;
