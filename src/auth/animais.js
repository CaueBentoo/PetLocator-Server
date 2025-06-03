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

async function getAnimais() {
  const client = await pool.connect();

  try {
    const query = `
      SELECT * FROM animais
      WHERE encontrado = 'N'
    `;

    const result = await client.query(query);
    return result.rows;  // array de objetos

  } catch (err) {
    console.error('Erro ao buscar animais:', err);
    throw err;
  } finally {
    client.release();
  }
}

async function insertAnimais(nome, caracteristicas, endereco, bairro, cidade, estado, telefone, tipo, data, nomefoto) {
  const client = await pool.connect();

  try {
    const values = [
      nome, caracteristicas, endereco, bairro, cidade,
      estado, telefone, tipo, data, nomefoto, '1', 'N'
    ];

    const query = `
      INSERT INTO animais 
      (nome, caracteristicas, endereco, bairro, cidade, estado, telefone, tipo, data, nome_foto, idusuario, encontrado)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const result = await client.query(query, values);
    return result.rows[0];  // retorna o objeto inserido

  } catch (err) {
    console.error('Erro ao inserir animal:', err);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { getAnimais, insertAnimais };
