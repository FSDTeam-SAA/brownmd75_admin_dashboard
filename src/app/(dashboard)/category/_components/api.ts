import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create axios instance with default config
const axiosInstance = (token?: string) => {
  const instance = axios.create({
    baseURL: API_URL,
  });

  // Add token to headers if provided
  if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  return instance;
};

export const getCategories = async (page = 1, token?: string) => {
  const { data } = await axiosInstance(token).get(`/category?page=${page}`);
  return data;
};

export const createCategory = async ({
  formData,
  token,
}: {
  formData: FormData;
  token?: string;
}) => {
  const { data } = await axiosInstance(token).post(
    `/category/create`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return data;
};

export const updateCategory = async ({
  id,
  formData,
  token,
}: {
  id: string;
  formData: FormData;
  token?: string;
}) => {
  const { data } = await axiosInstance(token).put(
    `/category/update/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return data;
};

export const deleteCategory = async ({
  id,
  token,
}: {
  id: string;
  token?: string;
}) => {
  const { data } = await axiosInstance(token).delete(`/category/delete/${id}`);
  return data;
};

export const getSingleCategory = async (id: string, token?: string) => {
  const { data } = await axiosInstance(token).get(`/category/${id}`);
  return data;
};
