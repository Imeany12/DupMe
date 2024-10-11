import 'dotenv/config';

export const { NODE_ENV, PORT, MONGO_URL, JWT_SECRET } = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: (process.env.PORT || 5001) as number,
  MONGO_URL: process.env.MONGO_URL as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
};
