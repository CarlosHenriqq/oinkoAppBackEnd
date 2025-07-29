const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Pasta onde as imagens serão salvas (exemplo: "uploads/")
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração multer para salvar arquivos na pasta uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Cria um nome único para o arquivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `foto-${req.headers['usuario_id']}-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({ storage: storage });

// Endpoint para upload da foto
router.post('/upload-foto', upload.single('foto'), async (req, res) => {
    const db = req.app.locals.db;
    const usuario_id = req.headers['usuario_id'];

    if (!usuario_id) {
        return res.status(400).json({ erro: 'Usuário não informado' });
    }

    if (!req.file) {
        return res.status(400).json({ erro: 'Arquivo de foto não enviado' });
    }

    try {
        const serverUrl = 'http://192.168.1.108:3000'; // substitua pelo IP fixo na sua rede

        const fotoPerfilUrl = `${serverUrl}/uploads/${req.file.filename}`;
        await db('usuarios').where('id', usuario_id).update({ foto_perfil_url: fotoPerfilUrl });

        res.json({ sucesso: true, fotoPerfilUrl });


       
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao salvar foto no banco' });
    }
});

module.exports = router;
