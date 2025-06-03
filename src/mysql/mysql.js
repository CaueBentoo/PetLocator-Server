require('dotenv').config();
const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT
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
