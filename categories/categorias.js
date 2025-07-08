const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const db = req.app.locals.db;
    try {
        const categorias = await db('categoriasFinanceiras').select('*');
        res.json(categorias);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao buscar categorias.' });
    }
});

module.exports = router;
