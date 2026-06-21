import { Sequelize } from "sequelize";
import { env } from "./env";

const isProduction = env.NODE_ENV === "production";

const sequelize = new Sequelize(env.DATABASE_URL, {
  dialect: "postgres",

  logging: !isProduction,

  dialectOptions: isProduction
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: true, // ✅ secure
        },
      }
    : {},

  pool: {
    max: 10,        // ✅ better for production
    min: 2,
    acquire: 30000,
    idle: 10000,
  },
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL Connected (Review Service)");

    // In dev: alter tables to match models. In prod: only create missing tables (safe).
    if (isProduction) {
      await sequelize.sync(); // safe — only creates tables that don't exist
    } else {
      await sequelize.sync({ alter: true }); // dev — alters columns to match model
    }
    console.log("🚀 Database schema synchronized");

  } catch (error) {
    console.error("❌ DB Error:", error);
    process.exit(1);
  }
};

export default sequelize;
