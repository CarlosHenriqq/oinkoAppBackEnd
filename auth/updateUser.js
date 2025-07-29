// auth/updateProfile.js
const express = require('express');
const router = express.Router();

router.put('/', async (req, res) => {
  const db = req.app.locals.db;
  const { usuario_id, nome, email, data_nascimento } = req.body;

  // data_nascimento virá como ddmmaaaa, converta para yyyy-mm-dd antes de salvar:
  let dataFormatada = null;
  if (data_nascimento && data_nascimento.length === 8) {
    const dia = data_nascimento.slice(0, 2);
    const mes = data_nascimento.slice(2, 4);
    const ano = data_nascimento.slice(4);
    dataFormatada = `${ano}-${mes}-${dia}`;
  }

  try {
    await db('usuarios')
      .where({ id: usuario_id })
      .update({
        nome,
        email,
        data_nascimento: dataFormatada,
      });

    res.json({ mensagem: 'Perfil atualizado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao atualizar perfil' });
  }
});

module.exports = router;
