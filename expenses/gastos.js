const express = require('express');
const router = express.Router();

// Middleware para pegar db e autenticar usuário (você pode criar um middleware para auth depois)
router.use((req, res, next) => {
  // Exemplo: usuario_id no header só pra testar (depois usa JWT)
  req.usuario_id = req.headers['usuario_id']; 
  if (!req.usuario_id) return res.status(401).json({ erro: 'Usuário não autenticado' });
  next();
});
 
// Retorna valor total gasto pelo usuário
router.get('/total', async (req, res) => {
  const db = req.app.locals.db;
  const usuario_id = req.usuario_id;
console.log('Usuário requisitando total:', usuario_id);
  try {
    const [{ total = 0 }] = await db('gastosMensais')
      .where({ usuario_id })
      .sum('valor as total');

    res.json({ total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar total de gastos' });
  }
});

// Adiciona um novo gasto
router.post('/', async (req, res) => {
  const db = req.app.locals.db;
  const usuario_id = req.usuario_id;
  const { nome, valor, categoria_id, data, descricao } = req.body;

  try {
    const [id] = await db('gastosMensais').insert({
      usuario_id,
      categoria_id,
      valor,
      data,
      descricao
    });
    res.status(201).json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao adicionar gasto' });
  }
});

// Retorna resumo por categoria (nome, cor, total)
router.get('/resumo', async (req, res) => {
  const db = req.app.locals.db;
  const usuario_id = req.usuario_id;

  try {
    const resumo = await db('gastosMensais as g')
      .join('categoriasFinanceiras as c', 'g.categoria_id', 'c.id')
      .where('g.usuario_id', usuario_id)
      .select('c.nome', 'c.cor')
      .sum('g.valor as total')
      .groupBy('c.id');

    res.json(resumo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar resumo de gastos' });
  }
});

module.exports = router;
