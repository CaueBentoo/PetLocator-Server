require('dotenv').config();
const mysql = require('mysql2/promise');

async function run() {
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || 3306;

  console.log("Tentando conectar no MySQL em", host, "porta", port);

  const connection = await mysql.createConnection({
    host: host,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: port
  });

  try {
    console.log('Conexão com o MySQL estabelecida com sucesso!');
    // Aqui você pode executar consultas se precisar
  } catch (err) {
    console.error('Erro ao executar consulta:', err);
  } finally {
    await connection.end();
  }
}

module.exports = run;
