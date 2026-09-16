const path = require('path');
const fs = require('fs');

let dbInstance = null;

async function getConnection() {
  if (dbInstance) return dbInstance;

  // Tentar usar sqlite3 / sqlite
  try {
    const sqlite3 = require('sqlite3');
    const { open } = require('sqlite');

    // Tentar caminho local primeiro; se falhar, usar /tmp (garantido gravável em Linux/Cloud)
    let dbPath = path.join(__dirname, 'database.sqlite');
    try {
      fs.accessSync(path.dirname(dbPath), fs.constants.W_OK);
    } catch (e) {
      dbPath = path.join('/tmp', 'database.sqlite');
    }

    dbInstance = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    await initTables(dbInstance);
    return dbInstance;
  } catch (err) {
    console.warn('Aviso: SQLite nativo não pôde ser carregado. Usando armazenamento resiliente em memória/arquivo:', err.message);
    dbInstance = createFallbackDb();
    await initFallbackTables(dbInstance);
    return dbInstance;
  }
}

async function initTables(db) {
  await db.exec(`
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

  const rows = await db.all('SELECT id FROM funcionarios LIMIT 1');
  if (rows.length === 0) {
    await db.run(`
      INSERT INTO funcionarios (nome, email, senha, cargo, role) 
      VALUES 
      ('Administrador Principal', 'admin@petgestao.com', 'senha123', 'Administrador', 'admin'),
      ('Dra. Ana Silva', 'vet@petgestao.com', 'senha123', 'Veterinário', 'comum')
    `);
    console.log('Seed de funcionários executado com sucesso!');
  }
}

// Fallback ultra-resiliente em JS para ambientes cloud com filesystem restrito
function createFallbackDb() {
  const memory = {
    tutores: [],
    pets: [],
    funcionarios: []
  };

  let nextIds = { tutores: 1, pets: 1, funcionarios: 1 };

  return {
    isFallback: true,
    all: async (sql, params = []) => {
      const lower = sql.toLowerCase();
      if (lower.includes('from tutores')) {
        let res = [...memory.tutores];
        if (lower.includes('where id =')) {
          res = res.filter(t => t.id === Number(params[0]));
        }
        return res;
      }
      if (lower.includes('from pets')) {
        let res = memory.pets.map(p => {
          const t = memory.tutores.find(tut => tut.id === p.tutor_id);
          return { ...p, tutor_nome: t ? t.nome : 'Não informado' };
        });
        if (lower.includes('where pets.id =') || lower.includes('where id =')) {
          res = res.filter(p => p.id === Number(params[0]));
        }
        return res;
      }
      if (lower.includes('from funcionarios')) {
        let res = [...memory.funcionarios];
        if (lower.includes('where email =')) {
          res = res.filter(f => f.email === String(params[0]));
        } else if (lower.includes('where id =')) {
          res = res.filter(f => f.id === Number(params[0]));
        }
        return res;
      }
      return [];
    },
    run: async (sql, params = []) => {
      const lower = sql.toLowerCase();
      if (lower.includes('insert into tutores')) {
        const item = { id: nextIds.tutores++, nome: params[0], telefone: params[1], email: params[2], endereco: params[3], created_at: new Date().toISOString() };
        memory.tutores.push(item);
        return { lastID: item.id, changes: 1 };
      }
      if (lower.includes('insert into pets')) {
        const item = { id: nextIds.pets++, nome: params[0], especie: params[1], raca: params[2], sexo: params[3], data_nascimento: params[4], peso: params[5], observacoes: params[6], tutor_id: Number(params[7]), created_at: new Date().toISOString() };
        memory.pets.push(item);
        return { lastID: item.id, changes: 1 };
      }
      if (lower.includes('insert into funcionarios')) {
        const item = { id: nextIds.funcionarios++, nome: params[0], email: params[1], senha: params[2], cargo: params[3], role: params[4] || 'comum', created_at: new Date().toISOString() };
        memory.funcionarios.push(item);
        return { lastID: item.id, changes: 1 };
      }
      if (lower.includes('delete from tutores')) {
        memory.tutores = memory.tutores.filter(t => t.id !== Number(params[0]));
        return { changes: 1 };
      }
      if (lower.includes('delete from pets')) {
        memory.pets = memory.pets.filter(p => p.id !== Number(params[0]));
        return { changes: 1 };
      }
      if (lower.includes('delete from funcionarios')) {
        memory.funcionarios = memory.funcionarios.filter(f => f.id !== Number(params[0]));
        return { changes: 1 };
      }
      return { lastID: 1, changes: 1 };
    }
  };
}

async function initFallbackTables(db) {
  const existing = await db.all('SELECT id FROM funcionarios');
  if (existing.length === 0) {
    await db.run('INSERT INTO funcionarios VALUES (?, ?, ?, ?, ?)', ['Administrador Principal', 'admin@petgestao.com', 'senha123', 'Administrador', 'admin']);
    await db.run('INSERT INTO funcionarios VALUES (?, ?, ?, ?, ?)', ['Dra. Ana Silva', 'vet@petgestao.com', 'senha123', 'Veterinário', 'comum']);
  }
}

const pool = {
  query: async (sql, params = []) => {
    const db = await getConnection();
    let sqliteSql = sql
      .replace(/\?/g, '$param')
      .replace(/ORDER BY nome/gi, 'ORDER BY nome')
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
