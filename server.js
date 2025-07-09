// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const knex = require('knex');
dotenv.config();

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


app.use('/auth/registerFinance', registerFinance)
app.use('/categoriasFinanceiras', categoriesRoute);
app.use('/auth/login', loginRoute);
app.use('/auth/register', registerRoute);
app.use('/gastos', gastosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Oinko API rodando na porta ${PORT}`));
