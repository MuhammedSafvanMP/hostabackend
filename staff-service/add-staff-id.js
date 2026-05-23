const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false }
  },
  logging: false
});

async function run() {
  try {
    await sequelize.query('ALTER TABLE staff ADD COLUMN IF NOT EXISTS "staffId" VARCHAR(255) UNIQUE;');
    console.log('SUCCESS: staffId column added to staff table.');
  } catch (e) {
    console.error('ERROR:', e.message);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

run();
