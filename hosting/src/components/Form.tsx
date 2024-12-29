import {
  FormProvider,
  type UseFormReturn,
  useController,
  useFormContext,
} from 'react-hook-form'

import type { StandardTextFieldProps } from '@mui/material/TextField'
import MuiTextField from '@mui/material/TextField'

import type { ButtonProps } from '@mui/material/Button'
import Button from './Button'

interface MyTextFieldProps extends StandardTextFieldProps {
  name: string
  rules?: {
    required?: boolean
  }
}

export function Form({
  form,
  onSubmit,
  children,
}: {
  form: UseFormReturn
  onSubmit: (data: Record<string, any>) => void
  children: React.ReactNode
}) {
  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        autoComplete="off"
        noValidate
      >
        {children}
      </form>
    </FormProvider>
  )
}

export function TextField({ name, rules, ...props }: MyTextFieldProps) {
  const { control } = useFormContext()
  const { field } = useController({ name, control, rules })

  return (
    <MuiTextField
      {...field}
      {...props}
      onChange={(e) => field.onChange(e.target.value)}
      required={Boolean(rules?.required)}
    />
  )
}

export function SubmitButton({
  children,
  ...props
}: { children: React.ReactNode } & ButtonProps) {
  const { formState } = useFormContext()
  props.disabled = props.disabled || formState.isSubmitting
  return (
    <Button {...props} loading={formState.isSubmitting}>
      {children}
    </Button>
  )
}
