const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const db = req.app.locals.db;
    const { usuario_id, renda, categorias } = req.body; // categorias = array de ids ou nomes

    try {
        // Atualizar renda do usuário
        await db('usuarios')
            .where({ id: usuario_id })
            .update({ renda });

        // Inserir categorias vinculadas
        if (Array.isArray(categorias) && categorias.length > 0) {
            const insertData = categorias.map(categoria_id => ({
                usuario_id,
                categoria_id
            }));
            await db('categoriasFinanceirasUsuario').insert(insertData);
        }

        res.status(201).json({ message: 'Informações financeiras salvas com sucesso.' });
    } catch (err) {
        console.error(err);
        res.status(400).json({ erro: 'Erro ao registrar informações financeiras.' });
    }
});

module.exports = router;
