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
  
  const baseStyles = 'rounded-xl font-semibold transition-all duration-150 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-start/50'
  
  const variants = {
    primary: 'btn-gradient text-white shadow-lg shadow-brand-start/25 hover:shadow-brand-start/40',
    secondary: theme === 'light' 
      ? 'bg-transparent border border-[#E2E8F0] text-[#1E293B] hover:bg-[#F1F5F9] hover:border-[#CBD5E1]' 
      : 'bg-transparent border border-white/20 text-white hover:bg-white/10 hover:border-white/30',
    ghost: theme === 'light'
      ? 'bg-transparent text-[#64748B] hover:text-[#1E293B] hover:bg-black/5'
      : 'bg-transparent text-text-secondary hover:text-white',
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:y-0`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </motion.button>
  )
}
