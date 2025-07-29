const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const db = req.app.locals.db;
    const usuario_id = req.headers['usuario_id'];

    try {
        const usuario = await db('usuarios').where('id', usuario_id).first();

let dt_nasc = null;
if (usuario.data_nascimento) {
    const data = new Date(usuario.data_nascimento);
    const dia = String(data.getUTCDate()).padStart(2, '0');
    const mes = String(data.getUTCMonth() + 1).padStart(2, '0');
    const ano = data.getUTCFullYear();
    dt_nasc = `${dia}${mes}${ano}`; // ou `${dia}/${mes}/${ano}` se preferir
}

res.json({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    dt_nasc: dt_nasc,
    renda: usuario.renda,
    image_url : usuario.foto_perfil_url
});

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao buscar informações do usuário' });
    }
});

module.exports = router;
