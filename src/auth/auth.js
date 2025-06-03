const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

async function auth(email) {
  const client = await pool.connect();

  try {

    const query = `SELECT * FROM usuarios WHERE email = $1`;
    const values = [email];

    const result = await client.query(query, values);

    return result.rows;

  } catch (err) {
    console.error('Erro na autenticação:', err);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = auth;
