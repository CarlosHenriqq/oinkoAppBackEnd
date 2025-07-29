const express = require('express');
const router = express.Router();

router.put('/:id', async (req, res) => {
    const db = req.app.locals.db;
    const gastoId = req.params.id;
    const usuario_id = req.headers.usuario_id;
    const { descricao, data, valor } = req.body;

    try {
        await db('gastosMensais')
            .where({ id: gastoId, usuario_id })
            .update({
                descricao,
                data,
                valor
            });

        res.json({ mensagem: 'Gasto atualizado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao atualizar gasto' });
    }
});

module.exports = router;
