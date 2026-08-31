const pool = require('../database/connection');

// Listar todos os pets (com nome do tutor via JOIN)
const getAll = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT pets.*, tutores.nome AS tutor_nome
      FROM pets
      INNER JOIN tutores ON pets.tutor_id = tutores.id
      ORDER BY pets.nome
    `);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// Buscar pet por ID
const getById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID do pet inválido' });
    }

    const [rows] = await pool.query(`
      SELECT pets.*, tutores.nome AS tutor_nome
      FROM pets
      INNER JOIN tutores ON pets.tutor_id = tutores.id
      WHERE pets.id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pet não encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// Criar novo pet
const create = async (req, res, next) => {
  try {
    const { nome, especie, raca, sexo, data_nascimento, peso, observacoes, tutor_id } = req.body;
    const cleanTutorId = parseInt(tutor_id);

    // REGRA DE NEGÓCIO: Verificar se o tutor existe antes de criar o pet
    const [tutorExists] = await pool.query('SELECT id FROM tutores WHERE id = ?', [cleanTutorId]);
    if (tutorExists.length === 0) {
      return res.status(400).json({ error: 'O tutor responsável informado não existe' });
    }

    const [result] = await pool.query(
      'INSERT INTO pets (nome, especie, raca, sexo, data_nascimento, peso, observacoes, tutor_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        nome.trim(),
        especie.trim(),
        raca ? raca.trim() : null,
        sexo ? sexo.trim() : null,
        data_nascimento || null,
        peso ? parseFloat(peso) : null,
        observacoes ? observacoes.trim() : null,
        cleanTutorId
      ]
    );

    res.status(201).json({
      id: result.insertId,
      nome: nome.trim(),
      especie: especie.trim(),
      raca,
      sexo,
      data_nascimento,
      peso,
      observacoes,
      tutor_id: cleanTutorId
    });
  } catch (error) {
    next(error);
  }
};

// Atualizar pet
const update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID do pet inválido' });
    }

    const { nome, especie, raca, sexo, data_nascimento, peso, observacoes, tutor_id } = req.body;
    const cleanTutorId = parseInt(tutor_id);

    // REGRA DE NEGÓCIO: Verificar se o tutor existe antes de atualizar o pet
    const [tutorExists] = await pool.query('SELECT id FROM tutores WHERE id = ?', [cleanTutorId]);
    if (tutorExists.length === 0) {
      return res.status(400).json({ error: 'O tutor responsável informado não existe' });
    }

    const [result] = await pool.query(
      'UPDATE pets SET nome = ?, especie = ?, raca = ?, sexo = ?, data_nascimento = ?, peso = ?, observacoes = ?, tutor_id = ? WHERE id = ?',
      [
        nome.trim(),
        especie.trim(),
        raca ? raca.trim() : null,
        sexo ? sexo.trim() : null,
        data_nascimento || null,
        peso ? parseFloat(peso) : null,
        observacoes ? observacoes.trim() : null,
        cleanTutorId,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Pet não encontrado' });
    }

    res.json({
      id,
      nome: nome.trim(),
      especie: especie.trim(),
      raca,
      sexo,
      data_nascimento,
      peso,
      observacoes,
      tutor_id: cleanTutorId
    });
  } catch (error) {
    next(error);
  }
};

// Excluir pet
const remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID do pet inválido' });
    }

    const [result] = await pool.query('DELETE FROM pets WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Pet não encontrado' });
    }

    res.json({ message: 'Pet excluído com sucesso' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };
