import { motion } from 'framer-motion'

interface ProgressProps {
  value: number
  className?: string
  showLabel?: boolean
}

export function Progress({ value, className = '', showLabel = true }: ProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value))
  
  return (
    <div className={`w-full ${className}`}>
      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          className="h-full rounded-full bg-gradient-to-r from-brand-start to-brand-end"
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-2 text-sm text-text-secondary">
          <span>进度</span>
          <span>{Math.round(clampedValue)}%</span>
        </div>
      )}
    </div>
  )
}
