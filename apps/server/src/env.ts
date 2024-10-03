import 'dotenv/config';

export const { NODE_ENV, PORT, CORS_ORIGIN } = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5001,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
};
