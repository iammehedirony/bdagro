import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { useMemo } from 'react';

export const useApi = () => {
  const { getToken } = useAuth();

  // useMemo ব্যবহার করা হয়েছে যাতে বারবার নতুন ইনস্ট্যান্স তৈরি না হয়
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // এখানে ইন্টারসেপ্টর কাজ করবে এবং হুক থেকে পাওয়া getToken() ব্যবহার করবে
    instance.interceptors.request.use(async (config) => {
      try {
        const token = await getToken();
        console.log('Fetched token in interceptor:', token);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error fetching token in interceptor:', error);
      }
      return config;
    }, (error) => {
      return Promise.reject(error);
    });

    return instance;
  }, [getToken]);

  return api;
};