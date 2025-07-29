const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.post('/', async (req, res) => {
    console.log('Body recebido:', req.body);
    const db = req.app.locals.db;
    const { nome, email, senha, data_nascimento } = req.body;

    try {
        const hashed = await bcrypt.hash(senha, 10);

        // Prepara data
        let dataNascimentoFormatada = null;
        if (data_nascimento) {
            let dataStr = data_nascimento.trim().replace(/\D/g, '');

            if (dataStr.length === 7) {
                dataStr = '0' + dataStr; // garante 8 dígitos
            }

            if (dataStr.length === 8) {
                const dia = dataStr.slice(0, 2);
                const mes = dataStr.slice(2, 4);
                const ano = dataStr.slice(4, 8);
                dataNascimentoFormatada = `${ano}-${mes}-${dia}`;
            } else {
                console.error('Formato de data inválido recebido:', dataStr);
            }
        }

        const [id] = await db('usuarios').insert({
            nome,
            email,
            senha: hashed,
            data_nascimento: dataNascimentoFormatada,
        });

        res.status(201).json({ id, nome });
    } catch (err) {
        console.error(err);
        res.status(400).json({ erro: 'Erro ao registrar usuário' });
    }
});

module.exports = router;
