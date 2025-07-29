const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

router.post('/', async (req, res) => {
    const db = req.app.locals.db;
    const { usuario_id, senha } = req.body;

    try {
        const usuario = await db('usuarios').where('id', usuario_id).first();

        if (!usuario) {
            return res.status(404).json({ valida: false, mensagem: 'Usuário não encontrado' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (senhaValida) {
            return res.json({ valida: true });
        } else {
            return res.json({ valida: false, mensagem: 'Senha incorreta' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao verificar senha' });
    }
});

module.exports = router;
