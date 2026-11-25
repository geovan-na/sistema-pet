/**
 * Formatadores e máscaras de dados para a interface e relatórios
 */

function formatCPF(cpf) {
  if (!cpf) return '';
  const clean = String(cpf).replace(/\D/g, '').slice(0, 11);
  if (clean.length !== 11) return clean;
  return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatTelefone(tel) {
  if (!tel) return '';
  const clean = String(tel).replace(/\D/g, '');
  if (clean.length === 11) {
    return clean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (clean.length === 10) {
    return clean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return clean;
}

function formatDateBR(dateInput) {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

function formatMoedaBRL(valor) {
  const num = typeof valor === 'number' ? valor : parseFloat(valor) || 0;
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

module.exports = {
  formatCPF,
  formatTelefone,
  formatDateBR,
  formatMoedaBRL
};
