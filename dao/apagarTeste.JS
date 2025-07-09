
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: '/oinkoDb' // ajuste o caminho para o seu banco
  },
  useNullAsDefault: true
});

async function limparUsuarios() {
  try {
    const deleted = await knex('usuarios').del();
    console.log(`Foram deletados ${deleted} usuários.`);
    process.exit(0);
  } catch (error) {
    console.error('Erro ao deletar usuários:', error);
    process.exit(1);
  }
}

limparUsuarios();

