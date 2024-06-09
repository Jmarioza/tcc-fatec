import { ComponentProps } from 'react'
import { UploadFile } from '@mui/icons-material'
import { Button } from '@mui/material'

interface InputButtonProps extends ComponentProps<'input'> {
  accept?: string
  label?: string
}

export function InputButton({
  accept,
  label = 'Upload',
  ...rest
}: InputButtonProps) {
  return (
    <>
      <input
        accept={accept}
        id="input-file"
        multiple
        type="file"
        hidden
        {...rest}
      />
      <label htmlFor="input-file">
        <Button variant="contained" component="span" startIcon={<UploadFile />}>
          {label}
        </Button>
      </label>
    </>
  )
}
