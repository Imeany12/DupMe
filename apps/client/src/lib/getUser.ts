import { SERVER_URL } from '@/env';

export default async function getUser(userId: string) {
  const res = await fetch(`${SERVER_URL}/user/${userId}`);

  if (!res.ok) return undefined;

  return res.json();
}
