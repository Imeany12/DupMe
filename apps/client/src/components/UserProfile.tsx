import Image from 'next/image';

type User =
  | {
      name?: string | null | undefined;
      email?: string | null | undefined;
      image?: string | null | undefined;
    }
  | undefined;

type Props = {
  user: User;
};

export default function UserProfile({ user }: Props) {
  console.log(user);
  const greeting = user?.name ? (
    <div className='flex flex-col items-center rounded-lg bg-white p-6 text-5xl font-bold text-black'>
      Hello {user?.name}!
    </div>
  ) : null;

  const userImage = user?.image ? (
    <Image
      className='mx-auto mt-8 rounded-full border-4 border-black shadow-black drop-shadow-xl dark:border-slate-500'
      src={user?.image}
      width={200}
      height={200}
      alt={user?.name ?? 'Profile Pic'}
      priority={true}
    />
  ) : null;

  return (
    <section className='flex flex-col items-center gap-4 py-2'>
      {userImage}
      {greeting}
    </section>
  );
}
