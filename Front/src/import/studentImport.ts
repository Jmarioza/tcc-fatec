import { BeneficiaryInputDTO } from '@/dtos/Beneficiary'
import { sanitize } from '@/func/sanitize'
import { beneficiaryService } from '@/services/beneficiary'
import { beneficiaryGroupService } from '@/services/beneficiaryGroupService'
import { beneficiarySubGroupService } from '@/services/beneficiarySubGroupService'
import { cpf } from 'cpf-cnpj-validator'

export interface BeneficiaryPlain {
  ['Nome completo']: string
  CPF: string
  Matricula: string
  Campus: string
  Unidade: string
  Curso: string
  ['Situação']: string
}

export async function importStudent(
  data: BeneficiaryPlain[],
  accreditorId: number,
) {
  const groups = await beneficiaryGroupService.getAll()
  if (!groups) {
    throw new Error('Nenhuma unidade encontrada.')
  }

  const subGroups = await beneficiarySubGroupService.getAll()
  if (!subGroups) {
    throw new Error('Nenhum curso encontrado')
  }

  const beneficiaries = await beneficiaryService.getAll()

  const beneficiariesImport: BeneficiaryInputDTO[] = data.map((plan) => {
    plan.CPF = sanitize(String(plan.CPF).padStart(11, '0'))
    if (!cpf.isValid(plan.CPF)) {
      throw new Error(`CPF inválido para ${plan['Nome completo']}`)
    }

    const beneficiaryGroupId = groups.find(
      (item) => item.name.split('-')[0].trim() === plan.Unidade.trim(),
    )?.id
    if (!beneficiaryGroupId) {
      throw new Error(`Unidade ${plan.Unidade} não cadastrada.`)
    }

    const beneficiarySubgroupId = subGroups.find(
      (item) =>
        item.name
          .toUpperCase()
          .trim()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') ===
        plan.Curso.toUpperCase()
          .trim()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, ''),
    )?.id
    if (!beneficiarySubgroupId) {
      throw new Error(`Curso: ${plan.Curso} não cadastrado.`)
    }

    const statusBeneficiary =
      plan['Situação'].toUpperCase() === 'ATIVO' ? 'ENABLED' : 'DISABLED'

    return {
      name: String(plan['Nome completo']).trim(),
      accreditorId,
      beneficiaryGroupId,
      cpf: sanitize(String(plan.CPF)),
      codeRef: String(plan.Matricula),
      status: statusBeneficiary,
      beneficiarySubgroupId,
    }
  })

  for (const beneficiary of beneficiariesImport) {
    const findBeneficiary = beneficiaries?.find(
      (item) => item.cpf === beneficiary.cpf,
    )

    if (findBeneficiary) {
      await beneficiaryService.update(findBeneficiary.id, {
        beneficiaryGroupId: beneficiary.beneficiaryGroupId,
        beneficiarySubgroupId: beneficiary.beneficiarySubgroupId,
        codeRef: beneficiary.codeRef,
        name: beneficiary.name,
        status: beneficiary.status,
      })
    } else {
      await beneficiaryService.create(beneficiary)
    }
  }
}
