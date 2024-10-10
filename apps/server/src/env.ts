import 'dotenv/config';

export const { NODE_ENV, PORT, CORS_ORIGIN, MONGO_URL, JWT_SECRET } = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5001,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  MONGO_URL: process.env.MONGO_URL || 'default_connection_string',
  JWT_SECRET: process.env.JWT_SECRET || 'default_secret',
};
