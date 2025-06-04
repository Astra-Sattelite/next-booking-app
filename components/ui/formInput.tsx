import React from 'react'
import { FieldError, FieldErrors, RegisterOptions, UseFormRegister } from 'react-hook-form'

interface FormInputProps extends React.InputHTMLAttributes<HTMLButtonElement> {
  errors?: FieldError
  defaultValue?: any
  register: { f: UseFormRegister<any>, name: string, options?: RegisterOptions }
  label?: string
  className?: string
  disabled?: boolean
  value?: string
  type?: string
}

export default function FormInput(props: FormInputProps) {

  const disabled = props.disabled === undefined 
    ? false
    : !props.disabled

  return (
    <div className="w-full">
      <div className="flex flex-row gap-1">
        <label>{props.label}</label>
        <p style={{opacity: "0.6", color: "gray"}}>{props.register.options?.required && "(required)"}</p>
      </div>

      <input
        // type={props.type}
        value={props.value}
        className={`
          ${props.className} w-full rounded-md p-1
          ${props.errors && "border-red-400 border"} outline-none
          ${disabled && "text-gray-500 opacity-75"}
        `}
        defaultValue={props.defaultValue}
        aria-invalid={props.errors ? "true" : "false"}
        {...props.register.f(props.register.name, props.register.options)}
        disabled={disabled}
      />
      {props.errors && <Error errors={props.errors} />}
    </div>
  )
}

function Error({ errors }: any) {
  console.log("ERRORS????", errors)
  return (
    <span className="text-red-400">
      {errors && <span>{errors.message?.toString()}</span>}
      {errors?.message === "required" && 
        <span role="alert">This is required</span>
      }
    </span>
  )
}
