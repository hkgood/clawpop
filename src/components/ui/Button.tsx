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
  const baseStyles = 'rounded-sm font-medium transition-all duration-150 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-white/20'
  
  // 主按钮使用固定灰色背景 + 白色文字，在任何主题下都清晰可见
  const variants = {
    primary: 'bg-btn-primary text-btn-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'bg-transparent border border-default text-secondary hover:bg-hover hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed',
    ghost: 'bg-transparent text-secondary hover:text-primary hover:bg-hover disabled:opacity-50 disabled:cursor-not-allowed',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </motion.button>
  )
}
