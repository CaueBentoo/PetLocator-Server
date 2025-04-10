const mysql = require('mysql2/promise');

async function insertResgate(tipo, caracteristicas, motivo, estado, cidade, rua, ponto_referencia, urgencia, codusuario) {
  let connection;
  
  try {
    // Crie uma conexão com o MySQL
    connection = await mysql.createConnection({
      host: 'localhost', // Endereço do servidor MySQL
      user: 'root', // Nome de usuário do MySQL
      password: 'clbclb10', // Senha do usuário do MySQL
      database: 'sospets' // Nome do banco de dados MySQL
    });
  
    // Crie um array com os valores dos parâmetros
    const values = [tipo, caracteristicas, motivo, estado, cidade, rua, ponto_referencia, urgencia, codusuario];
  
    // Execute a consulta SQL com os valores dos parâmetros
    const [result] = await connection.execute(`
      INSERT INTO resgate (tipo, caracteristicas, motivo, estado, cidade, rua, ponto_referencia, urgencia, idusuario) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, values);
  
    await connection.commit();
  
    return result;
  
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}


module.exports = { insertResgate };