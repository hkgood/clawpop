import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { useAppStore } from '../../stores/appStore'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  disabled,
  onClick,
  type = 'button',
}: ButtonProps) {
  const { theme } = useAppStore()
  
  const baseStyles = 'rounded-sm font-medium transition-all duration-150 flex items-center justify-center gap-2 focus:outline-none focus:ring-1 focus:ring-brand/50'
  
  const variants = {
    primary: theme === 'light'
      ? 'bg-brand text-white hover:bg-brand-hover'  
      : 'bg-white text-[#0A0A0A] hover:bg-gray-200',
    secondary: theme === 'light' 
      ? 'bg-transparent border border-default text-primary hover:bg-hover' 
      : 'bg-transparent border border-default text-secondary hover:bg-hover',
    ghost: theme === 'light'
      ? 'bg-transparent text-secondary hover:text-primary hover:bg-hover'
      : 'bg-transparent text-secondary hover:text-primary hover:bg-hover',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-sm',
    md: 'px-4 py-2 text-sm rounded-sm',
    lg: 'px-6 py-3 text-base rounded-sm',
  }

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </motion.button>
  )
}
