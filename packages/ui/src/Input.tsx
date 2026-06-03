import React from 'react'
import { cn } from './cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, leadingIcon, trailingIcon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-bold uppercase tracking-wider text-[#6b6b6b]">
            {label}
          </label>
        )}
        <div className="relative">
          {leadingIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6b6b]">{leadingIcon}</div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full h-11 bg-[#f2f2f2] border text-[#0a0a0a] text-sm placeholder:text-[#d8d8d8] outline-none transition-all',
              'focus:border-[#c8102e] focus:ring-1 focus:ring-[#c8102e]/20',
              error ? 'border-[#ff3c3c]' : 'border-[#d8d8d8]',
              leadingIcon ? 'pl-10' : 'pl-4',
              trailingIcon ? 'pr-10' : 'pr-4',
              className
            )}
            {...props}
          />
          {trailingIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6b6b]">{trailingIcon}</div>
          )}
        </div>
        {error && <p className="text-[#ff3c3c] text-xs">{error}</p>}
        {helper && !error && <p className="text-[#6b6b6b] text-xs">{helper}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helper?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helper, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-bold uppercase tracking-wider text-[#6b6b6b]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-[#f2f2f2] border text-[#0a0a0a] text-sm placeholder:text-[#d8d8d8] outline-none transition-all p-4 resize-none',
            'focus:border-[#c8102e] focus:ring-1 focus:ring-[#c8102e]/20',
            error ? 'border-[#ff3c3c]' : 'border-[#d8d8d8]',
            className
          )}
          {...props}
        />
        {error && <p className="text-[#ff3c3c] text-xs">{error}</p>}
        {helper && !error && <p className="text-[#6b6b6b] text-xs">{helper}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-bold uppercase tracking-wider text-[#6b6b6b]">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={cn(
            'w-full h-11 bg-[#f2f2f2] border text-[#0a0a0a] text-sm outline-none transition-all px-4',
            'focus:border-[#c8102e]',
            error ? 'border-[#ff3c3c]' : 'border-[#d8d8d8]',
            className
          )}
          {...props}
        >
          {options.map(({ value, label: optLabel }) => (
            <option key={value} value={value} className="bg-[#f2f2f2]">
              {optLabel}
            </option>
          ))}
        </select>
        {error && <p className="text-[#ff3c3c] text-xs">{error}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'
