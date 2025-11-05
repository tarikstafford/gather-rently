import React from 'react'

type BasicButtonProps = {
    children?: React.ReactNode
    className?: string
    onClick?: () => void
    disabled?: boolean
}

const BasicButton:React.FC<BasicButtonProps> = ({ children, className, onClick, disabled }) => {

    return (
        <button className={`bg-sweet-mint hover:bg-sweet-mint-75 animate-colors font-semibold text-white text-sm py-3 px-6 rounded-lg shadow-sm hover:shadow-md transition-all ${disabled ? 'pointer-events-none opacity-50' : ''} ${className}`} onClick={onClick}>
            {children}
        </button>
    )
}

export default BasicButton