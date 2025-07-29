// auth/categoriaUser.js
const express = require('express');
const router = express.Router();

router.get('/categoriasSelecionadas', async (req, res) => {
  const db = req.app.locals.db;
  const usuario_id = req.headers.usuario_id;
  console.log('Usuário requisitando categorias:', usuario_id);

  try {
    const resumo = await db('categoriasFinanceirasUsuario as cf')
      .join('categoriasFinanceiras as c', 'cf.categoria_id', 'c.id')
      .where('cf.usuario_id', usuario_id)
      .select('c.nome','c.id')
      .groupBy('c.id');

    res.json(resumo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar as categorias selecionadas' });
  }
});


module.exports = router;
