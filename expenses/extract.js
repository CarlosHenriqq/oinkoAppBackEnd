// Extrato detalhado dos gastos do usuário (pode filtrar por mês se quiser)

const express = require('express');
const router = express.Router();

router.get('/extrato', async (req, res) => {
  const db = req.app.locals.db;
  const usuario_id = req.headers.usuario_id;
  
  // Opcional: pegar mês e ano via query params para filtrar (ex: ?ano=2025&mes=7)
  const { ano, mes } = req.query;
  console.log('Recebendo', ano, mes)
  try {
    let query = db('gastosMensais as g')
      .join('categoriasFinanceiras as c', 'g.categoria_id', 'c.id')
      .where('g.usuario_id', usuario_id)
      .select(
        'g.id',
        'g.valor',
        'g.data',
        'g.descricao',
        'c.nome as categoria_nome',
        'c.id as id_cat'
        
      )
      .orderBy('g.data', 'desc');

    if (ano && mes) {
      const mesStr = mes.toString().padStart(2, '0');
      const dataInicio = `${ano}-${mesStr}-01`;
      // Calcula a data fim para o filtro do mês
      const dataFim = new Date(ano, mes, 0); // último dia do mês
      const dataFimStr = `${ano}-${mesStr}-${dataFim.getDate()}`;

      query = query.whereBetween('g.data', [dataInicio, dataFimStr]);
    }

    const gastos = await query;

    res.json(gastos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar extrato de gastos' });
  }
});

module.exports = router;