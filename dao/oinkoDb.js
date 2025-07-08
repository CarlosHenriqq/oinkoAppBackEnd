const knex = require('knex');

const db = knex({
    client: 'sqlite3',
    connection: {
        filename: './oinko.db'
    },
    useNullAsDefault: true
});

(async () => {
    try {
        // Tabela 1
        if (!(await db.schema.hasTable('usuarios'))) {
            await db.schema.createTable('usuarios', table => {
                table.increments('id').primary();
                table.string('nome');
                table.string('email').unique();
                table.string('senha');
                table.date('data_nascimento');
                table.float('renda');
            });
            console.log('Tabela "usuarios" criada.');
        }

        // Tabela 2
        if (!(await db.schema.hasTable('categoriasFinanceiras'))) {
            await db.schema.createTable('categoriasFinanceiras', table => {
                table.increments('id').primary();
                table.string('nome');
                
            });
            console.log('Tabela "categoriasFinanceiras" criada.');

            await db('categoriasFinanceiras').insert([
                { nome: 'Dívidas' },
                { nome: 'Transporte' },
                { nome: 'Pets' },
                { nome: 'Saúde' },
                { nome: 'Cuidados Pessoais'},
                { nome: 'Educação'  },
                { nome: 'Entretenimento'  },
                { nome: 'Assinatura' },
                { nome: 'Alimentação'  },
                { nome: 'Moradia'  },
                { nome: 'Cartão de crédito'  },
                { nome: 'Contas do dia a dia'  },
                { nome: 'Outros' },
            ]);
            console.log('Categorias padrão inseridas.');

        }

        // Tabela 3
        if (!(await db.schema.hasTable('categoriasFinanceirasUsuario'))) {
            await db.schema.createTable('categoriasFinanceirasUsuario', table => {
                table.increments('id').primary();
                table.integer('usuario_id').references('id').inTable('usuarios');
                table.integer('categoria_id').references('id').inTable('categoriasFinanceiras');
            });
            console.log('Tabela "categoriasFinanceirasUsuario" criada.');
        }

        // Tabela 4
        if (!(await db.schema.hasTable('gastosMensais'))) {
            await db.schema.createTable('gastosMensais', table => {
                table.increments('id').primary();
                table.integer('usuario_id').references('id').inTable('usuarios');
                table.integer('categoria_id').references('id').inTable('categoriasFinanceiras');
                table.float('valor');
                table.date('data');
                table.string('descricao');
            });
            console.log('Tabela "gastosMensais" criada.');
        }

    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
})();
