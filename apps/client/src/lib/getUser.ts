export default async function getUser(userId: string) {
  const res = await fetch(`http://localhost:5001/user/${userId}`);

  if (!res.ok) return undefined;

  return res.json();
}
