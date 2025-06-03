require('dotenv').config();
const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  });

  try {
    console.log('Conexão com o MySQL estabelecida com sucesso!');
    // Aqui você pode adicionar código para executar consultas.
  } catch (err) {
    console.error('Erro ao executar consulta:', err);
  } finally {
    await connection.end();
  }
}

module.exports = run;
