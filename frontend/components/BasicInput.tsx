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
        {label && <label className="block text-sm font-medium leading-6 text-dark-plum mb-2">
            {label}
        </label>}
        <div>
            <input
                type={type}
                className={`rounded-lg border-2 border-gray-50 py-2.5 px-4 text-dark-plum shadow-sm placeholder:text-dolphin-gray outline-none focus:border-plum focus:ring-2 focus:ring-plum-stain transition-all text-base leading-6 ${className}`}
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