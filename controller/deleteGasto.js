
const express = require('express');
const router = express.Router();

router.delete('/', async (req, res) => {
  const db = req.app.locals.db;
  const { gastoId } = req.body;

    try {
        await db('gastosMensais')
            .where({ id: gastoId })
            .del();
        res.status(200).json({ message: 'Gasto excluído com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao excluir gasto.' });
    }
});

module.exports = router;
