import type { MaskPattern } from '@/components/ui/mask-input'

const nonDigits = /\D/g

export const brPhoneMask: MaskPattern = {
  pattern: '(##) #####-####',
  transform: (value) => value.replace(nonDigits, ''),
  validate: (value) => /^\d{10,11}$/.test(value.replace(nonDigits, '')),
}

export const cnpjMask: MaskPattern = {
  pattern: '##.###.###/####-##',
  transform: (value) => value.replace(nonDigits, ''),
  validate: (value) => /^\d{14}$/.test(value.replace(nonDigits, '')),
}

export const accessKeyMask: MaskPattern = {
  pattern: '#### #### #### #### #### #### #### #### #### #### ####',
  transform: (value) => value.replace(nonDigits, ''),
  validate: (value) => /^\d{44}$/.test(value.replace(nonDigits, '')),
}
