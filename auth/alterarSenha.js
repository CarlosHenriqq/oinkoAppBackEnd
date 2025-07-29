const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

router.put('/', async (req, res) => {
    const db = req.app.locals.db;
    const { usuario_id, nova_senha } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedSenha = await bcrypt.hash(nova_senha, salt);

        await db('usuarios')
            .where('id', usuario_id)
            .update({ senha: hashedSenha });

        res.json({ mensagem: 'Senha atualizada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao atualizar senha' });
    }
});

module.exports = router;
