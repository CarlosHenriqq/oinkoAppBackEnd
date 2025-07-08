// auth/login.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/', async (req, res) => {
    const db = req.app.locals.db;
    const { email, senha } = req.body;
    try {
        const usuario = await db('usuarios').where({ email }).first();
        if (!usuario) {
            return res.status(401).json({ erro: 'Usuário não encontrado' });
        }
        const valido = await bcrypt.compare(senha, usuario.senha);
        if (!valido) {
            return res.status(401).json({ erro: 'Senha incorreta' });
        }
        const token = jwt.sign(
            { id: usuario.id },
            process.env.JWT_SECRET || 'segredo',
            { expiresIn: '1d' }
        );
        res.json({
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro no login' });
    }
});

module.exports = router;
