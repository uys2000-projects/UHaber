import axios from "axios";

export const get = async (url: string) => {
  return await axios.get(url);
};
export const post = async (url: string, data: Record<string, string>) => {
  return await axios.post(url, data);
};
