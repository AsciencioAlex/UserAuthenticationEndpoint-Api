import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { URL } from 'url';

dotenv.config();

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const parsedUrl = new URL(dbUrl);

const sequelize = new Sequelize(parsedUrl.pathname!.slice(1), parsedUrl.username, parsedUrl.password, {
  host: parsedUrl.hostname,
  port: Number(parsedUrl.port),
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // This line is necessary if you're using self-signed certificates
    }
  },
  logging: false,
});

export default sequelize;
