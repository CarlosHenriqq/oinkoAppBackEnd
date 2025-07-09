// auth/login.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();


router.post('/', async (req, res) => {
    console.log('REQUISIÇÃO CHEGOU NO LOGIN');


    const db = req.app.locals.db;
    const { email, senha } = req.body;
    console.log('EMAIL:', email);
console.log('SENHA:', senha);

    try {
        const usuario = await db('usuarios').where({ email }).first();
        console.log('USUÁRIO NO BANCO:', usuario);
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
