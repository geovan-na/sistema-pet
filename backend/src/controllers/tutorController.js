const pool = require('../database/connection');

// Listar todos os tutores
const getAll = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tutores ORDER BY nome');
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// Buscar tutor por ID
const getById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID do tutor inválido' });
    }

    const [rows] = await pool.query('SELECT * FROM tutores WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Tutor não encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// Criar novo tutor
const create = async (req, res, next) => {
  try {
    const { nome, telefone, email, endereco } = req.body;

    const [result] = await pool.query(
      'INSERT INTO tutores (nome, telefone, email, endereco) VALUES (?, ?, ?, ?)',
      [nome.trim(), telefone ? telefone.trim() : null, email ? email.trim() : null, endereco ? endereco.trim() : null]
    );

    res.status(201).json({ 
      id: result.insertId, 
      nome: nome.trim(), 
      telefone, 
      email, 
      endereco 
    });
  } catch (error) {
    next(error);
  }
};

// Atualizar tutor
const update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID do tutor inválido' });
    }

    const { nome, telefone, email, endereco } = req.body;

    const [result] = await pool.query(
      'UPDATE tutores SET nome = ?, telefone = ?, email = ?, endereco = ? WHERE id = ?',
      [nome.trim(), telefone ? telefone.trim() : null, email ? email.trim() : null, endereco ? endereco.trim() : null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tutor não encontrado' });
    }

    res.json({ id, nome: nome.trim(), telefone, email, endereco });
  } catch (error) {
    next(error);
  }
};

// Excluir tutor
const remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID do tutor inválido' });
    }

    // REGRA DE NEGÓCIO: Verificar se o tutor possui pets vinculados
    const [pets] = await pool.query('SELECT id FROM pets WHERE tutor_id = ? LIMIT 1', [id]);
    if (pets.length > 0) {
      return res.status(409).json({ 
        error: 'Não é possível excluir o tutor pois existem pets vinculados a ele.' 
      });
    }

    const [result] = await pool.query('DELETE FROM tutores WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tutor não encontrado' });
    }

    res.json({ message: 'Tutor excluído com sucesso' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };
