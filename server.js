// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const knex = require('knex');
dotenv.config();
const path = require('path');
const app = express();
app.use(cors());
app.use(express.json());

// Configuração do Knex + SQLite
const db = knex({
  client: 'sqlite3',
  connection: {
    filename: './oinko.db'
  },
  useNullAsDefault: true
});

// Torna o db disponível para as rotas
app.locals.db = db;

// Importa rotas de auth
const loginRoute = require('./auth/login');
const registerRoute = require('./auth/register');
const registerFinance = require('./auth/registerFinance')
const gastosRoutes = require('./expenses/gastos');
const categoriesRoute = require('./categories/categorias');
const categoriaPorUsuario = require('./auth/categoriaUser')
const userInfo = require('./auth/userInfo')
const updateProfile = require('./auth/updateUser');
const extrato = require('./expenses/extract')
const verificarSenhaRoute = require('./auth/verificarSenha');
const alterarSenhaRoute = require('./auth/alterarSenha');
const updateGasto = require ('./controller/updateGasto')
const deleteGasto = require ('./controller/deleteGasto')
const forgetPassword = require('./auth/recoverPassword')
const uploadFoto = require('./upload/uploadFoto');


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/auth/registerFinance', registerFinance)
app.use('/categories/categorias', categoriesRoute);
app.use('/auth/login', loginRoute);
app.use('/auth/register', registerRoute);
app.use('/expenses/gastos', gastosRoutes);
app.use('/auth', categoriaPorUsuario)
app.use('/auth/userInfo', userInfo)
app.use('/auth/updateUser', updateProfile);
app.use('/expenses/extract', extrato)
app.use('/auth/verificarSenha', verificarSenhaRoute);
app.use('/auth/alterarSenha', alterarSenhaRoute);
app.use('/controller/updateGasto', updateGasto);
app.use('/controller/deleteGasto', deleteGasto);
app.use('/auth/recoverPassword',forgetPassword);
app.use('/upload', uploadFoto);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Oinko API rodando na porta ${PORT}`));
