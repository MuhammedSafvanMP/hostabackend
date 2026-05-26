const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

(async () => {
  await client.connect();
  const res = await client.query('SELECT id, phone, otp, "otpExpiry" FROM users WHERE phone = $1', ['8590062623']);
  console.log(JSON.stringify(res.rows, null, 2));
  await client.end();
})().catch(async (err) => {
  console.error(err);
  await client.end();
  process.exit(1);
});
