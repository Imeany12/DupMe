export default async function getAllUsers() {
  const res = await fetch('http://localhost:5001/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());

  if (res.ok) console.log(res);
  if (!res.ok) throw new Error('failed to fetch data');
  return res;
}
