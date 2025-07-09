const knex = require('knex');

const db = knex({
    client: 'sqlite3',
    connection: {
        filename: '../oinko.db'
    },
    useNullAsDefault: true
});

(async () => {
    try {
        const [id] = await db('gastosMensais').insert({
            usuario_id: 12,
            categoria_id: 1, // coloque um ID existente ou desejado da categoria
            valor: 160.75,
            data: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
            descricao: 'Gasto de teste no usuário 3'
        });

        console.log(`✅ Gasto inserido com id ${id}`);
    } catch (err) {
        console.error('Erro ao inserir gasto de teste:', err);
    } finally {
        process.exit();
    }
})();
