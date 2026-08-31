const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

let dbInstance = null;

async function getConnection() {
  if (dbInstance) return dbInstance;

  dbInstance = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  });

  // Criar tabelas se não existirem
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS tutores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      telefone TEXT,
      email TEXT,
      endereco TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS pets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      especie TEXT NOT NULL,
      raca TEXT,
      sexo TEXT,
      data_nascimento TEXT,
      peso REAL,
      observacoes TEXT,
      tutor_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tutor_id) REFERENCES tutores(id)
    );

    CREATE TABLE IF NOT EXISTS funcionarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL,
      cargo TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'comum',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Inserir carga inicial de funcionários (Seed) se a tabela estiver vazia
  const rows = await dbInstance.all('SELECT id FROM funcionarios LIMIT 1');
  if (rows.length === 0) {
    // Inserindo Admin padrão e Veterinário comum para testes rápidos (senhas em formato texto plano para simplificar o MVP)
    await dbInstance.run(`
      INSERT INTO funcionarios (nome, email, senha, cargo, role) 
      VALUES 
      ('Administrador Principal', 'admin@petgestao.com', 'senha123', 'Administrador', 'admin'),
      ('Dra. Ana Silva', 'vet@petgestao.com', 'senha123', 'Veterinário', 'comum')
    `);
    console.log('Seed de funcionários executado com sucesso!');
  }

  return dbInstance;
}

const pool = {
  query: async (sql, params = []) => {
    const db = await getConnection();
    let sqliteSql = sql
      .replace(/\?/g, '$param')
      .replace(/ORDER BY nome/gi, 'ORDER BY nome COLLATE NOCASE')
      .replace(/AUTO_INCREMENT/gi, 'AUTOINCREMENT');

    if (sqliteSql.trim().toUpperCase().startsWith('SELECT')) {
      const rows = await db.all(sql, params);
      return [rows];
    } else {
      const result = await db.run(sql, params);
      return [{
        insertId: result.lastID,
        affectedRows: result.changes
      }];
    }
  }
};

module.exports = pool;
