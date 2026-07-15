import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DB_URL;

if (!dbUrl) {
  console.error("DB_URL is not defined in environment variables");
  process.exit(1);
}

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  logging: false,
});

export default sequelize;
