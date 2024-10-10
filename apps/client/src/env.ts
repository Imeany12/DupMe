import 'dotenv/config';

export const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5001';

export const CLIENT_GOOGLE_ID = process.env.GOOGLE_ID as string;
export const CLIENT_GOOGLE_SECRET = process.env.GOOGLE_SECRET as string;

export const CLIENT_GITHUB_ID = process.env.GITHUB_ID as string;
export const CLIENT_GITHUB_SECRET = process.env.GITHUB_SECRET as string;

export const CLIENT_TWITTER_ID = process.env.TWITTER_ID as string;
export const CLIENT_TWITTER_SECRET = process.env.TWITTER_SECRET as string;
