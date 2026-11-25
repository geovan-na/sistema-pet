/**
 * Validadores de regras de negócio para Tutores e Cadastros
 */

// Validação de algoritmo de CPF oficial brasileiro
function validateCPF(cpf) {
  if (!cpf || typeof cpf !== 'string') return false;
  
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '');
  
  // Deve conter 11 dígitos
  if (cleanCPF.length !== 11) return false;
  
  // Rejeita dígitos repetidos (ex: 111.111.111-11)
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  // Valida 1º dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  let digito1 = resto >= 10 ? 0 : resto;
  if (digito1 !== parseInt(cleanCPF.charAt(9))) return false;
  
  // Valida 2º dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  let digito2 = resto >= 10 ? 0 : resto;
  if (digito2 !== parseInt(cleanCPF.charAt(10))) return false;
  
  return true;
}

// Validação de telefone com DDD (10 ou 11 dígitos)
function validateTelefone(telefone) {
  if (!telefone || typeof telefone !== 'string') return false;
  const clean = telefone.replace(/\D/g, '');
  // 10 dígitos (fixo com DDD) ou 11 dígitos (celular com DDD)
  return clean.length === 10 || clean.length === 11;
}

// Validação de formato de e-mail
function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

module.exports = {
  validateCPF,
  validateTelefone,
  validateEmail
};
