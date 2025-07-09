// auth/register.js
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();


router.post('/', async (req, res) => {
    console.log('Body recebido:', req.body);
    const db = req.app.locals.db;
    const { nome, email, senha, data_nascimento } = req.body;
    try {
        const hashed = await bcrypt.hash(senha, 10);
        const [id] = await db('usuarios').insert({
            nome,
            email,
            senha: hashed,
            data_nascimento,
           
        });
        res.status(201).json({ id, nome });
    } catch (err) {
        console.error(err);
        res.status(400).json({ erro: 'Erro ao registrar usuário' });
    }
});

module.exports = router;
