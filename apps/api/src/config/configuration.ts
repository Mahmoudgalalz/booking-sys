import * as process from 'process';

export default () => ({
  port: parseInt(process.env.PORT ?? '3005', 10),
  database: {
    type: 'postgres',
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
  cors: {
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    credentials: process.env.CORS_CREDENTIALS ?? true,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  },
  system: {
    baseUrl: process.env.BASE_URL,
    frontendUrl: process.env.FRONTEND_URL,
    uploadPath: process.env.UPLOAD_PATH ?? './uploads',
  },
});
