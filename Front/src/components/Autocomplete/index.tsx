import {
  SxProps,
  Autocomplete as MUIAutocomplete,
  TextField,
} from '@mui/material'

interface AutocompleteProps<T> {
  options: T[]
  label: string
  errorMessage?: string
  getValue: () => T | null
  onChange: (item: T | null) => void
  getOptionLabel: (item: T) => string | undefined
  getOptionKey: (item: T) => string | number | undefined
  sx?: SxProps
  disabled?: boolean
}

export function Autocomplete<T>({
  options,
  label,
  getOptionLabel,
  getOptionKey,
  getValue,
  onChange,
  errorMessage,
  sx,
  disabled = false,
}: AutocompleteProps<T>) {
  return (
    <MUIAutocomplete
      value={getValue() || null}
      onChange={(_, newValue) => onChange(newValue)}
      options={options}
      getOptionLabel={(opt) => getOptionLabel(opt) || ''}
      sx={sx}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={!!errorMessage}
          helperText={errorMessage}
          size="small"
        />
      )}
      renderOption={(props, option) => (
        <li {...props} key={getOptionKey(option)}>
          {getOptionLabel(option)}
        </li>
      )}
    />
  )
}
