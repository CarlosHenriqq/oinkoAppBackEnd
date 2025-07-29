const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const db = req.app.locals.db;
    const { usuario_id, clerk_id, nome, email, renda, categorias } = req.body;
    console.log("BODY RECEBIDO NO BACKEND:", req.body);


    try {
        let userId = usuario_id || null;

        // Se não houver usuario_id, mas houver clerk_id, tenta achar usuário pelo clerk_id
        if (!userId && clerk_id) {
            const usuarioExistente = await db('usuarios').where({ clerk_id }).first();

            if (usuarioExistente) {
                userId = usuarioExistente.id;
            } else {
                // Cria usuário com dados mínimos (ajuste conforme seu schema)
                const [novoUserId] = await db('usuarios').insert({
                    nome: nome || 'Usuário Clerk',
                    email: email || null,
                    clerk_id
                });
                userId = novoUserId;
            }
        }

        if (!userId) {
            return res.status(400).json({ erro: 'Usuário não identificado' });
        }

        // Atualiza renda (convertendo para número)
        if (renda !== undefined && renda !== null) {
            const rendaReais = parseFloat(
                renda.toString().replace(/[^\d]/g, '')
            ) / 100;
            await db('usuarios')
                .where({ id: userId })
                .update({ renda: rendaReais });
        }

        // Atualiza categorias financeiras do usuário
        if (Array.isArray(categorias) && categorias.length > 0) {
            // Consulta categorias no banco pelo nome
            const categoriasDB = await db('categoriasFinanceiras')
                .whereIn('nome', categorias)
                .select('id');

            // Apaga categorias antigas do usuário
            await db('categoriasFinanceirasUsuario')
                .where({ usuario_id: userId })
                .del();

            // Prepara novas associações categorias-usuário
            const categoriasParaInserir = categoriasDB.map(cat => ({
                usuario_id: userId,
                categoria_id: cat.id
            }));

            if (categoriasParaInserir.length > 0) {
                await db('categoriasFinanceirasUsuario').insert(categoriasParaInserir);
            }
        }

        // Busca o usuário atualizado para retornar info atualizada
        const usuario = await db('usuarios').where({ id: userId }).first();

        res.status(200).json({
            mensagem: 'Informações financeiras atualizadas com sucesso',
            userId: userId,
            renda: renda
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao registrar informações financeiras' });
    }
});

module.exports = router;
