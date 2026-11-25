const { validateTutor, validatePet } = require('../src/middleware/validate');
const { validateCPF, validateTelefone, validateEmail } = require('../src/utils/validators');
const { generateToken, verifyToken } = require('../src/services/tokenService');
const authMiddleware = require('../src/middleware/authMiddleware');
const { formatCPF, formatTelefone, formatDateBR, formatMoedaBRL } = require('../src/utils/formatters');

describe('PetGestão — Suíte de Testes Unitários do Backend', () => {

  // Teste 1: Validação de CPF e telefone do tutor (validators.js)
  test('1. Validação de CPF e telefone do tutor (validators.js) — valida algoritmo e rejeita inválidos', () => {
    // CPF Válido oficial (algoritmo)
    expect(validateCPF('52998224725')).toBe(true);
    expect(validateCPF('529.982.247-25')).toBe(true);

    // CPFs com dígitos repetidos ou inválidos
    expect(validateCPF('11111111111')).toBe(false);
    expect(validateCPF('12345678900')).toBe(false);
    expect(validateCPF('123')).toBe(false);
    expect(validateCPF(null)).toBe(false);

    // Telefones válidos (10 ou 11 dígitos)
    expect(validateTelefone('11987654321')).toBe(true);
    expect(validateTelefone('(11) 98765-4321')).toBe(true);
    expect(validateTelefone('1133334444')).toBe(true);
    expect(validateTelefone('(11) 3333-4444')).toBe(true);
    expect(validateTelefone('12345')).toBe(false);

    // E-mail válido
    expect(validateEmail('veterinario@petgestao.com')).toBe(true);
    expect(validateEmail('email-invalido')).toBe(false);
  });

  // Teste 2: Middleware de autenticação e bloqueio 401 (authMiddleware.js)
  test('2. Middleware de autenticação e bloqueio 401 (authMiddleware.js) — bloqueia sem token e libera com token válido', () => {
    const mockRes = () => {
      const res = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      return res;
    };
    const next = jest.fn();

    // Caso 1: Sem header Authorization -> Bloqueia 401
    const reqSemAuth = { headers: {} };
    const resSemAuth = mockRes();
    authMiddleware(reqSemAuth, resSemAuth, next);
    expect(resSemAuth.status).toHaveBeenCalledWith(401);
    expect(resSemAuth.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
    expect(next).not.toHaveBeenCalled();

    // Caso 2: Token no formato errado -> Bloqueia 401
    const reqFormatoErrado = { headers: { authorization: 'TokenInvalido' } };
    const resFormatoErrado = mockRes();
    authMiddleware(reqFormatoErrado, resFormatoErrado, next);
    expect(resFormatoErrado.status).toHaveBeenCalledWith(401);

    // Caso 3: Token válido -> Libera requisição com next()
    const tokenValido = generateToken({ id: 1, email: 'admin@petgestao.com', role: 'admin' });
    const reqValido = { headers: { authorization: `Bearer ${tokenValido}` } };
    const resValido = mockRes();
    authMiddleware(reqValido, resValido, next);
    expect(next).toHaveBeenCalled();
    expect(reqValido.user.email).toBe('admin@petgestao.com');
  });

  // Teste 3: Geração e verificação de token JWT (tokenService.js)
  test('3. Geração e verificação de token JWT (tokenService.js) — assina payload e valida assinatura', () => {
    const payload = { id: 42, nome: 'Dr. Lucas', role: 'veterinario' };
    const token = generateToken(payload, 3600);

    expect(typeof token).toBe('string');
    const parts = token.split('.');
    expect(parts.length).toBe(3); // header.payload.signature

    const decoded = verifyToken(token);
    expect(decoded.id).toBe(42);
    expect(decoded.nome).toBe('Dr. Lucas');
    expect(decoded.role).toBe('veterinario');

    // Validação de tamper / token corrompido
    const tokenAdulterado = token.slice(0, -5) + 'AAAAA';
    expect(() => verifyToken(tokenAdulterado)).toThrow('Assinatura do token inválida');
  });

  // Teste 4: Validação de campos obrigatórios do Pet (validate.js)
  test('4. Validação de campos obrigatórios do Pet (validate.js) — barra pets sem nome, espécie ou tutor', () => {
    const mockRes = () => {
      const res = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      return res;
    };

    // Caso 1: Sem nome do pet -> Retorna 400
    const reqSemNome = { body: { especie: 'Canino', tutor_id: 1 } };
    const resSemNome = mockRes();
    const next1 = jest.fn();
    validatePet(reqSemNome, resSemNome, next1);
    expect(resSemNome.status).toHaveBeenCalledWith(400);
    expect(resSemNome.json).toHaveBeenCalledWith({ error: 'Nome do pet é obrigatório' });
    expect(next1).not.toHaveBeenCalled();

    // Caso 2: Sem espécie -> Retorna 400
    const reqSemEspecie = { body: { nome: 'Rex', tutor_id: 1 } };
    const resSemEspecie = mockRes();
    const next2 = jest.fn();
    validatePet(reqSemEspecie, resSemEspecie, next2);
    expect(resSemEspecie.status).toHaveBeenCalledWith(400);
    expect(resSemEspecie.json).toHaveBeenCalledWith({ error: 'Espécie é obrigatória' });

    // Caso 3: Pet completo válido -> Chama next()
    const reqValido = { body: { nome: 'Thor', especie: 'Canino', porte: 'Grande', peso: 28.5, tutor_id: 2 } };
    const resValido = mockRes();
    const next3 = jest.fn();
    validatePet(reqValido, resValido, next3);
    expect(next3).toHaveBeenCalled();
  });

  // Teste 5: Formatação de máscaras e datas de atendimento (formatters.js)
  test('5. Formatação de máscaras e datas de atendimento (formatters.js) — formata CPF, telefone, data e moeda BRL', () => {
    // Formatação de CPF
    expect(formatCPF('52998224725')).toBe('529.982.247-25');

    // Formatação de Telefones (Celular 11 dígitos e Fixo 10 dígitos)
    expect(formatTelefone('11987654321')).toBe('(11) 98765-4321');
    expect(formatTelefone('1133334444')).toBe('(11) 3333-4444');

    // Formatação de Datas
    const dataFormatada = formatDateBR('2026-10-10T12:00:00Z');
    expect(dataFormatada).toMatch(/\d{2}\/\d{2}\/2026/);

    // Formatação de Moeda BRL
    const moeda = formatMoedaBRL(185.50);
    expect(moeda).toContain('185,50');
    expect(moeda).toContain('R$');
  });

});
