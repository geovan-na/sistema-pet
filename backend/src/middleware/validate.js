// Validações de inputs para tutores e pets

const validateTutor = (req, res, next) => {
  const { nome, email, telefone } = req.body;

  if (!nome || typeof nome !== 'string' || nome.trim() === '') {
    return res.status(400).json({ error: 'Nome é obrigatório e deve ser um texto válido' });
  }

  if (email && email.trim() !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Formato de e-mail inválido' });
    }
  }

  if (telefone && typeof telefone !== 'string') {
    return res.status(400).json({ error: 'Telefone deve ser um texto válido' });
  }

  next();
};

const validatePet = (req, res, next) => {
  const { nome, especie, peso, tutor_id } = req.body;

  if (!nome || typeof nome !== 'string' || nome.trim() === '') {
    return res.status(400).json({ error: 'Nome do pet é obrigatório' });
  }

  if (!especie || typeof especie !== 'string' || especie.trim() === '') {
    return res.status(400).json({ error: 'Espécie é obrigatória' });
  }

  if (!tutor_id || isNaN(parseInt(tutor_id))) {
    return res.status(400).json({ error: 'Tutor responsável é obrigatório e deve ser um ID válido' });
  }

  if (peso !== undefined && peso !== null) {
    const numPeso = parseFloat(peso);
    if (isNaN(numPeso) || numPeso <= 0) {
      return res.status(400).json({ error: 'O peso deve ser um número maior que zero' });
    }
  }

  next();
};

module.exports = { validateTutor, validatePet };
