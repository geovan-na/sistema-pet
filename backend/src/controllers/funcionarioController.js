const pool = require('../database/connection');

// Autenticação (Login)
const login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
    }

    const [rows] = await pool.query('SELECT * FROM funcionarios WHERE email = ?', [email.trim()]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuário não cadastrado' });
    }

    const funcionario = rows[0];
    
    // Comparação simples para fins acadêmicos e MVP
    if (funcionario.senha !== senha) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    res.json({
      id: funcionario.id,
      nome: funcionario.nome,
      email: funcionario.email,
      cargo: funcionario.cargo,
      role: funcionario.role
    });
  } catch (error) {
    next(error);
  }
};

// Listar todos os funcionários (Apenas para Admins no front)
const getAll = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id, nome, email, cargo, role, created_at FROM funcionarios ORDER BY nome');
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// Buscar funcionário por ID
const getById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const [rows] = await pool.query('SELECT id, nome, email, cargo, role, created_at FROM funcionarios WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// Cadastrar novo funcionário
const create = async (req, res, next) => {
  try {
    const { nome, email, senha, cargo, role } = req.body;

    if (!nome || !email || !senha || !cargo) {
      return res.status(400).json({ error: 'Nome, e-mail, senha e cargo são obrigatórios' });
    }

    // Verificar se e-mail já existe
    const [emailExists] = await pool.query('SELECT id FROM funcionarios WHERE email = ?', [email.trim()]);
    if (emailExists.length > 0) {
      return res.status(409).json({ error: 'E-mail já cadastrado por outro funcionário' });
    }

    const [result] = await pool.query(
      'INSERT INTO funcionarios (nome, email, senha, cargo, role) VALUES (?, ?, ?, ?, ?)',
      [nome.trim(), email.trim(), senha, cargo.trim(), role || 'comum']
    );

    res.status(201).json({
      id: result.insertId,
      nome: nome.trim(),
      email: email.trim(),
      cargo: cargo.trim(),
      role: role || 'comum'
    });
  } catch (error) {
    next(error);
  }
};

// Atualizar funcionário
const update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const { nome, email, senha, cargo, role } = req.body;

    if (!nome || !email || !cargo) {
      return res.status(400).json({ error: 'Nome, e-mail e cargo são obrigatórios' });
    }

    // Verificar se e-mail já existe em outro ID
    const [emailExists] = await pool.query('SELECT id FROM funcionarios WHERE email = ? AND id != ?', [email.trim(), id]);
    if (emailExists.length > 0) {
      return res.status(409).json({ error: 'E-mail já está sendo utilizado por outro funcionário' });
    }

    let query = 'UPDATE funcionarios SET nome = ?, email = ?, cargo = ?, role = ? WHERE id = ?';
    let params = [nome.trim(), email.trim(), cargo.trim(), role || 'comum', id];

    // Se informou senha nova, atualiza ela também
    if (senha && senha.trim() !== '') {
      query = 'UPDATE funcionarios SET nome = ?, email = ?, senha = ?, cargo = ?, role = ? WHERE id = ?';
      params = [nome.trim(), email.trim(), senha, cargo.trim(), role || 'comum', id];
    }

    const [result] = await pool.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }

    res.json({ id, nome: nome.trim(), email: email.trim(), cargo: cargo.trim(), role: role || 'comum' });
  } catch (error) {
    next(error);
  }
};

// Excluir funcionário
const remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const [result] = await pool.query('DELETE FROM funcionarios WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }

    res.json({ message: 'Funcionário removido com sucesso' });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, getAll, getById, create, update, remove };
