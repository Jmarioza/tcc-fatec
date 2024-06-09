'use client'
import { ChangeEvent, useState } from 'react'
import { beneficiaryService } from '@/services/beneficiary'
import { ImportTable } from './components/ImportTable'
import { ErrorsTable } from './components/ErrorsTable'
import { Container } from '@/components/Container'
import { CustomBox } from '@/components/CustomBox'
import { InputButton } from '@/components/InputButton'
import { Breadcrumb } from '@/components/Breadcrumbs'
import { NavigationContainer } from '@/components/NavigationContainer'
import { GridBox } from '@/components/GridBox'
import { Info } from '@/components/Info'
import { Button, Backdrop, CircularProgress } from '@mui/material'
import { Download, Refresh } from '@mui/icons-material'
import { sanitize } from '@/func/sanitize'
import { useToast } from '@/hooks/useToast'
import {
  exportPlan,
  processExcelFile,
} from '@/services/processExcelFileService'
import {
  BeneficiaryImportDTO,
  ImportBeneficiariesResponseDTO,
} from '@/dtos/ImportBeneficiaries'
import { useAccreditor } from '@/hooks/useAccreditor'

interface PlanBeneficiary {
  Nome: string
  CPF: string
  Matricula: string
  Campus: string
  Unidade: string
  Curso: string
  ['Situação']: string
}

export default function ImportBeneficiaries() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [importedData, setImportedData] = useState<BeneficiaryImportDTO[]>([])
  const [importResponse, setImportResponse] =
    useState<ImportBeneficiariesResponseDTO>()

  const toast = useToast()
  const { accreditor } = useAccreditor()

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setIsLoading(true)
    setImportedData([])
    setImportResponse(undefined)
    const selectedFile = event.target.files?.[0]

    if (selectedFile) {
      const fileExtension = String(selectedFile.name.split('.').pop())
      const acceptedFilesTypes = ['xlsx', 'xls', 'csv']
      if (acceptedFilesTypes.includes(fileExtension)) {
        try {
          const result = await processExcelFile<PlanBeneficiary>(selectedFile)
          setImportedData(
            result.map((item) => {
              return {
                nome: String(item.Nome || ''),
                cpf: sanitize(item.CPF || ''),
                matricula: String(item.Matricula || ''),
                campus: String(item.Campus || ''),
                unidade: String(item.Unidade || ''),
                curso: String(item.Curso || ''),
                situacao: String(item.Situação || ''),
              }
            }),
          )
        } catch (error) {
          if (error instanceof Error) toast.error(error.message)
        }
      } else {
        toast.error('Formato de arquivo inválido')
      }
    }
    setIsLoading(false)
  }

  async function importBeneficiary() {
    setIsLoading(true)
    const response = await beneficiaryService.importBeneficiaries({
      accreditorId: accreditor.id,
      beneficiaryData: importedData,
    })
    if (response) {
      setImportResponse(response)
    }
    setIsLoading(false)
    if (response.success) toast.success('Beneficários importados com sucesso')
    else if (response.totalImported > 0)
      toast.success(
        `(${response.totalImported}) Beneficiários importados com sucesso`,
      )
    else toast.error('Nenhum beneficiário foi importado.')
  }

  function exportPlanWithErrors() {
    const data: string[][] = [
      ['Nome', 'CPF', 'Matricula', 'Campus', 'Unidade', 'Curso', 'Situação'],
    ]

    importResponse?.beneficiaryErrors.map((item) => {
      const beneficiary = item.beneficiaryData
      return data.push([
        beneficiary.nome ?? '',
        beneficiary.cpf ?? '',
        beneficiary.matricula ?? '',
        beneficiary.campus ?? '',
        beneficiary.unidade ?? '',
        beneficiary.curso ?? '',
        beneficiary.situacao ?? '',
      ])
    })

    exportPlan({
      data,
      fileName: 'Erros',
      worksheetName: 'Beneficiários',
    })
  }

  function exportModelPlan() {
    const data: string[][] = [
      ['Nome', 'CPF', 'Matricula', 'Campus', 'Unidade', 'Curso', 'Situação'],
    ]
    exportPlan({
      data,
      fileName: 'Modelo',
      worksheetName: 'Beneficiários',
    })
  }

  const importedAmount = importedData.length || 0
  const errorsAmount = importResponse?.beneficiaryErrors.length || 0
  const updatedAmount = importResponse?.totalImported || 0

  return (
    <Container>
      <Backdrop open={isLoading}>
        <CircularProgress />
      </Backdrop>
      <NavigationContainer>
        <Breadcrumb
          crumbs={[
            {
              href: '/system',
              description: 'Home',
            },
            {
              href: '/system/beneficiaries',
              description: 'Beneficiários',
            },
            {
              href: '/system/beneficiaries/new',
              description: 'Novo',
            },
            {
              description: 'Importar',
            },
          ]}
        />
      </NavigationContainer>
      <CustomBox
        title="Importar Beneficiários"
        customHeader={
          <>
            <Button
              startIcon={<Download />}
              onClick={exportModelPlan}
              variant="outlined"
            >
              Exportar Modelo
            </Button>
            <InputButton
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileChange}
              label="Importar Modelo"
            />
          </>
        }
      >
        {!!importedAmount && (
          <>
            <GridBox column={4}>
              <Info
                title="Total Importados"
                description={String(importedAmount)}
              />
              <Info
                title="Total Atualizados"
                description={String(updatedAmount)}
              />

              <Info title="Total de Erros" description={String(errorsAmount)} />
              {!!errorsAmount && (
                <Button
                  onClick={exportPlanWithErrors}
                  startIcon={<Download />}
                  hidden={!errorsAmount}
                >
                  Exportar planilha com erros
                </Button>
              )}
              <Button
                onClick={importBeneficiary}
                variant="contained"
                startIcon={<Refresh />}
              >
                Atualizar Beneficiários
              </Button>
            </GridBox>

            {!!errorsAmount && (
              <ErrorsTable data={importResponse?.beneficiaryErrors} />
            )}
            {!errorsAmount && <ImportTable data={importedData} />}
          </>
        )}
      </CustomBox>
    </Container>
  )
}
