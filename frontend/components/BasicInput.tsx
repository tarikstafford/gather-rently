import React from 'react'

type BasicInputProps = {
    label?: string
    className?: string
    value?: string | number
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    type?: 'number' | 'text'
    maxLength?: number
}

const BasicInput:React.FC<BasicInputProps> = ({ label, className, value, onChange, type, maxLength }) => {
    
    if (!type) {
        type = 'text'
    }

    return (
        <div>
        {label && <label className="block text-sm font-medium leading-6 text-white mb-2">
            {label}
        </label>}
        <div>
            <input
                type={type}
                className={`rounded-lg border-2 py-2.5 px-4 shadow-sm outline-none transition-all text-base leading-6 ${className}`}
                autoComplete='off'
                placeholder=""
                value={value}
                onChange={onChange}
                maxLength={maxLength}
                spellCheck={false}
            />
        </div>
        </div>
  )
}

export default BasicInput