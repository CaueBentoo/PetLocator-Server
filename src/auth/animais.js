const mysql = require('mysql2/promise');

async function getAnimais() {
  let connection;

  try {
    // Crie uma conexão com o MySQL
    connection = await mysql.createConnection({
      host: 'localhost', // Endereço do servidor MySQL
      user: 'root', // Nome de usuário do MySQL
      password: 'clbclb10', // Senha do usuário do MySQL
      database: 'pet_locator' // Nome do banco de dados MySQL
    });

    // Execute a consulta SQL com os valores dos parâmetros
    const [result] = await connection.execute(`
      select animais.* from animais
      where encontrado = 'N'
    `);

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


async function insertAnimais(nome, caracteristicas, endereco, bairro, cidade, estado, telefone, tipo, data, nomefoto) {
  let connection;
  
  try {
    // Crie uma conexão com o MySQL
    connection = await mysql.createConnection({
      host: 'localhost', // Endereço do servidor MySQL
      user: 'root', // Nome de usuário do MySQL
      password: 'clbclb10', // Senha do usuário do MySQL
      database: 'pet_locator' // Nome do banco de dados MySQL
    });
  
    // Crie um array com os valores dos parâmetros
    const values = [nome, caracteristicas, endereco, bairro, cidade, estado, telefone, tipo, data, nomefoto, '1', 'N'];
  
    // Execute a consulta SQL com os valores dos parâmetros
    const [result] = await connection.execute(`
      INSERT INTO animais (nome, caracteristicas, endereco, bairro, cidade, estado, telefone, tipo, data, nome_foto, idusuario, encontrado) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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


module.exports = { getAnimais, insertAnimais };
