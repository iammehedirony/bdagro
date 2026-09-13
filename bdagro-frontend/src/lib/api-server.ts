import { auth } from '@clerk/nextjs/server';
import axios from 'axios';

export async function createServerApi() {
  // Clerk থেকে সার্ভার সাইডে টোকেন বের করা
  const { getToken } = await auth();
  const token = await getToken();

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
}