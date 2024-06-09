import { sanitize } from './sanitize'

export function hideCPF(cpf: string): string {
  return cpf
    .replace(/\D/g, '')
    .padStart(11, '0')
    .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '***.***.$3-$4')
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('pt-Br').format(
    date.setDate(date.getDate() + 1),
  )
}

export function formatCPF(cpf: string) {
  return cpf
    .replace(/\D/g, '')
    .replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
}

export function formatCNPJ(cnpj: string) {
  return sanitize(cnpj).replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5',
  )
}

export function formatCEP(cep: string) {
  return sanitize(cep).replace(/^(\d{5})(\d{3})$/, '$1-$2')
}
