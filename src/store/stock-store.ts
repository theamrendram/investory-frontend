import {create} from "zustand";
import {persist, createJSONStorage} from "zustand/middleware";

interface Stock {
  id: string;
  name: string;
  price: number;
  quantity: number;
}