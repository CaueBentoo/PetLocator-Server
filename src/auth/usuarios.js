const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false // importante para a Render
  }
});

async function insertUsuarios(nome, telefone, email, senha) {
  const client = await pool.connect();

  console.log('nome: '+ nome)

  try {
    const senhaHash = bcrypt.hashSync(senha, 10);

    const query = `
      INSERT INTO usuarios (nome, telefone, email, senha)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [nome, telefone, email, senhaHash];

    const result = await client.query(query, values);

    console.log('Usuário inserido com sucesso:', result.rows[0]);

    return result.rows[0]; // Retorna o usuário inserido

  } catch (err) {
    console.error('Erro ao inserir usuário:', err);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { insertUsuarios };
