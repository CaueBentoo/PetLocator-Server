// node server.js para começar

const express = require("express");
const cors = require("cors");
require('dotenv').config();

const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: "arquivos/imagens/animais",
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg"); // Nome do arquivo
  },
});
const upload = multer({ storage: storage });

// Importa as funções que acessam o banco (ajuste para receber conexão)
const { getAnimais, insertAnimais } = require("./src/auth/animais.js");
const { insertUsuarios } = require("./src/auth/usuarios.js");
const { getUsuario } = require("./src/auth/usuarios.js");

// Função para inicializar conexão MySQL e iniciar o servidor
async function startServer() {
  try {

    app.get("/", (req, res) => {
      res.send("Hello World!!");
    });

    // Middleware para validar token JWT
    const verifyToken = (req, res, next) => {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
      }
      try {
        const decodedToken = jwt.verify(token, "secret-key");
        req.userId = decodedToken.userId;
        next();
      } catch (err) {
        return res.status(401).json({ message: "Token inválido" });
      }
    };

    app.get("/usuario", verifyToken, async (req, res) => {
      const { codusursdk } = req.headers || {};
      try {
        const usuario = await getUsuario(codusursdk); // Passa conexão
        res.json(usuario.rows || usuario); // Ajuste dependendo do retorno
      } catch (err) {
        res.status(500).json({ message: "Erro ao buscar usuário", error: err.message });
      }
    });

    app.get("/animais", async (req, res) => {
      try {
        const animais = await getAnimais(); // Passa conexão
        res.json(animais);
      } catch (err) {
        res.status(500).json({ message: "Erro ao buscar animais", error: err.message });
      }
    });

    app.post("/procurar-animal", upload.single("file"), async (req, res) => {
      const {
        nome,
        caracteristicas,
        endereco,
        bairro,
        cidade,
        estado,
        telefone,
        tipo,
        data,
      } = req.body;
      const foto = req.file;
      const nomeArquivo = foto ? foto.filename : null;

      try {
        const result = await insertAnimais(
          nome,
          caracteristicas,
          endereco,
          bairro,
          cidade,
          estado,
          telefone,
          tipo,
          data,
          nomeArquivo
        );
        res.json(result);
      } catch (err) {
        res.status(500).json({ message: "Erro ao inserir animal", error: err.message });
      }
    });

    app.post("/cadastro-usuario", upload.single("file"), async (req, res) => {
      const { nome, telefone, email, senha } = req.body;
      try {
        const result = await insertUsuarios(nome, telefone, email, senha);
        res.json(result);
      } catch (err) {
        res.status(500).json({ message: "Erro ao cadastrar usuário", error: err.message });
      }
    });

    app.post('/login', async (req, res) => {
      const { email, senha } = req.body || {};

      if (!email || !senha) {
        return res.status(400).json({ message: 'E-mail e/ou senha inválidos' });
      }

      try {
        const auth = require('./src/auth/auth.js');

        const usuario = await auth(email);

        if (!usuario) {
          return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        if (!bcrypt.compareSync(senha, usuario[0].senha)) {
          return res.status(401).json({ message: 'Senha incorreta' });
        }

        // Gera token JWT
        const token = jwt.sign({ userId: usuario[0].email }, 'secret-key');

        const id = usuario[0].idusuarios;
        const nome = usuario[0].nome;
        const telefone = usuario[0].telefone;

        console.log(id+' - '+nome+' - '+telefone)

        let d = new Date();
        console.log("login de: " + email + " às " + d);

        res.json({ id, token, email, nome, telefone });
      } catch (err) {
        res.status(500).json({ message: "Erro no login", error: err.message });
      }
    });

    // Servir imagens estáticas
    app.use(
      "/imagens/animais",
      express.static(path.join(__dirname, "arquivos", "imagens", "animais"))
    );

    app.get("/imagens/animais", async (req, res) => {
      const directoryPath = path.join(__dirname, "arquivos", "imagens", "animais");

      fs.readdir(directoryPath, (err, files) => {
        if (err) {
          return res.status(500).json({ message: "Erro ao ler o diretório" });
        }

        const imageNames = files.filter((file) =>
          fs.statSync(path.join(directoryPath, file)).isFile()
        );

        res.json({ images: imageNames });
      });
    });

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Erro ao conectar no banco:", err);
    process.exit(1); // Sai do processo pois a conexão falhou
  }
}

startServer();
