import axios from "axios";
import getIdToken from "@/firebase/getIdToken";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${await getIdToken()}`,
  },
});

export default axiosInstance;
