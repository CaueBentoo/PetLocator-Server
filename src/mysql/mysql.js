const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: 'localhost', // Endereço do servidor MySQL
    user: 'root', // Nome de usuário do MySQL
    password: 'clbclb10', // Senha do usuário do MySQL
    database: 'pet_locator' // Nome do banco de dados MySQL
  });

  try {
    // Use a conexão aqui
    console.log('Conexão com o MySQL estabelecida com sucesso!');

  } catch (err) {
    console.error('Erro ao executar consulta:', err);
  } finally {
    // Feche a conexão
    await connection.end();
  }
}

module.exports = run;
