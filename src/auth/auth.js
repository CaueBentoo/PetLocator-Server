const mysql = require('mysql2/promise'); // Importe o pacote mysql2

async function auth(email) {
  let connection;

  try {
    // Crie uma conexão com o MySQL
    connection = await mysql.createConnection({
      host: 'localhost', // Endereço do servidor MySQL
      user: 'root', // Nome de usuário do MySQL
      password: 'clbclb10', // Senha do usuário do MySQL
      database: 'pet_locator' // Nome do banco de dados MySQL
    });

    // Execute a consulta SQL
    const result = await connection.execute(`SELECT * FROM USUARIOS WHERE EMAIL = '${email}'`);

    return result

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.end(); // Feche a conexão com o MySQL
      } catch (err) {
        console.error(err);
      }
    }
  }
}


module.exports = auth;
