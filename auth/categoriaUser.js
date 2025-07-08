// auth/registerFinance.js
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.post('/', async (req, res) => {
    const db = req.app.locals.db;
    const { renda } = req.body;
    try {
        
        const [id] = await db('usuarios').insert({
            renda
        });
        res.status(201).json({ id });
    } catch (err) {
        console.error(err);
        res.status(400).json({ erro: 'Erro ao registrar usuário' });
    }
});

module.exports = router;
