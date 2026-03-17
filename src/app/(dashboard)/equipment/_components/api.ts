import axios from 'axios';
import { getSession } from 'next-auth/react';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Request interceptor to attach the token dynamically
api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

export default api;


export const getEquipments = async (page = 1) => {
  const { data } = await api.get(`/equipments/all?page=${page}`);
  return data;
};

export const createEquipment = async (formData: FormData) => {
  const { data } = await api.post(`/equipments/create`, formData);
  return data;
};

export const updateEquipment = async ({ id, formData }: { id: string; formData: FormData }) => {
  const { data } = await api.put(`/equipments/${id}`, formData);
  return data;
};

export const deleteEquipment = async (id: string) => {
  const { data } = await api.delete(`/equipments/${id}`);
  return data;
};;