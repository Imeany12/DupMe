import { SERVER_URL } from '@/env';

export default async function getAllUsers() {
  const res = await fetch(`${SERVER_URL}/user/list`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());

  if (res.ok) console.log(res);
  if (!res.ok) throw new Error('failed to fetch data');
  return res;
}
