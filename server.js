// node server.js para começar

const express = require("express");
const cors = require("cors");
require('dotenv').config();

const bodyParser = require("body-parser");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: "arquivos/imagens/animais",
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg"); // Define o nome do arquivo com a extensão .jpg
  },
});
const upload = multer({ storage: storage });

const fs = require("fs");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());

const { getAnimais, insertAnimais } = require("./src/auth/animais.js");

app.use(cors());

const run = require("./src/mysql/mysql.js");
const { insertUsuarios } = require("./src/auth/usuarios.js");

function carregarMysqlDB() {
  run();
}

run();
setInterval(carregarMysqlDB, 2400000);

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

app.get("/", (req, res) => {
  res.send("Hello World!!");
});

app.get("/usuario", verifyToken, async (req, res) => {
  const { codusursdk } = req.headers || {};

  async function buscaUsuario() {
    const usuario = await getUsuario(codusursdk);
    return usuario;
  }

  const usuario = await buscaUsuario();

  const usuarioJson = JSON.stringify(usuario.rows);
  res.send(usuario);
});

app.get("/animais", async (req, res) => {
  async function buscaAnimais() {
    const animais = await getAnimais();
    return animais;
  }

  const animais = await buscaAnimais();
  const animaisJson = JSON.stringify(animais);
  console.log(animaisJson);
  res.send(animaisJson);
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
    foto: fotobody,
  } = req.body;
  const foto = req.file;
  const nomeArquivo = foto.filename;

  let result;
  result = await insertAnimais(
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

  res.send(result);
});

app.post("/cadastro-usuario", upload.single("file"), async (req, res) => {
  console.log(req.body);

  const { nome, telefone, email, senha } = req.body;
  let result;
  result = await insertUsuarios(nome, telefone, email, senha)

  res.send(result);
});

app.post('/login', async (req, res) => {

  const { email, senha } = req.body || {};

  if (!email || !senha) {
    return res.status(400).json({ message: 'E-mail e/ou senha inválidos'  });
  }
  
  const auth = require('./src/auth/auth.js');

  async function buscaUsuario(){
    const usuario = await auth(email);
    return usuario;
  }
  
  const usuario = await buscaUsuario();


  if (!usuario[0][0]) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }

  if (!bcrypt.compareSync(senha, usuario[0][0].senha)) {   
    
    return res.status(401).json({ message: 'Senha incorreta' });
  }
  
  // Gera o token JWT
  const token = jwt.sign({ userId: usuario[0][0].email }, 'secret-key');
  //const token = jwt.sign({ userId: usuario.rows[0].EMAIL }, 'secret-key', { expiresIn: '2h' });

  const id = usuario[0][0].idusuarios
  const nome = usuario[0][0].nome
  const telefone = usuario[0][0].telefone
  const emails = usuario[0][0].email

  let d = new Date()
  console.log("login de: "+ email+ " às "+ d)
  res.json({ id, token, email, nome, telefone });

});

app.use(
  "/imagens/animais",
  express.static(path.join(__dirname, "arquivos", "imagens", "animais"))
);

app.get("/imagens/animais", async (req, res) => {
  const directoryPath = path.join(__dirname, "arquivos", "imagens", "animais");

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).json({ message: "Erro ao ler o diretorio" });
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
