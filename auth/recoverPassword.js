const express = require('express');
const router = express.Router();
// seu módulo de conexão com banco
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// 1. Enviar código para o email
router.post('/forgot', async (req, res) => {
  const db = req.app.locals.db;
  const { email } = req.body;
  try {
    const user = await db('usuarios').where({ email }).first();
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    const code = Math.floor(10000 + Math.random() * 90000).toString();

    // Salva o código e validade
    await db('password_resets').insert({
      usuario_id: user.id,
      code,
      expires_at: new Date(Date.now() + 15 * 60 * 1000),
    });

    // Envia email via SendGrid
    const msg = {
      to: email,
      from: 'oinkofinancas@gmail.com', // seu e-mail validado no SendGrid
      subject: 'Código para recuperação de senha',
      text: `Seu código de recuperação é: ${code}`,
      html: `<p>Seu código de recuperação é: <strong>${code}</strong></p>`,
    };

    await sgMail.send(msg);

    res.json({ message: 'Código enviado para o e-mail' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});



// 2. Verificar código
router.post('/verify', async (req, res) => {
  const db = req.app.locals.db;
  const { email, code } = req.body;
  console.log(email, 'recebido')
  try {
    const user = await db('usuarios').where({ email }).first();
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    const record = await db('password_resets')
      .where({ usuario_id: user.id, code })
      .where('expires_at', '>', new Date())
      .first();

    if (!record) return res.json({ valido: false });

    res.json({ valido: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// 3. Resetar a senha
router.put('/reset', async (req, res) => {
  const db = req.app.locals.db;
  const { email, nova_senha } = req.body;
  try {
    const user = await db('usuarios').where({ email }).first();
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    const hashed = await bcrypt.hash(nova_senha, 10);
    await db('usuarios').where({ id: user.id }).update({ senha: hashed });

    // Apagar códigos usados ou expirados
    await db('password_resets').where({ usuario_id: user.id }).del();

    res.json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

module.exports = router;
