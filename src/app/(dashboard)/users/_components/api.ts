import axios from "axios";

export const getAllUsers = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/user/all-users`,
  );
  return response.data;
};
