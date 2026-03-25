import { motion } from 'framer-motion'
import { useTranslation } from '../../i18n/useTranslation'

interface ProgressProps {
  value: number
  className?: string
  showLabel?: boolean
  showPercentage?: boolean
}

export function Progress({ value, className = '', showLabel = true, showPercentage = false }: ProgressProps) {
  const { t } = useTranslation()
  const clampedValue = Math.min(100, Math.max(0, value))
  
  return (
    <div className={`w-full ${className}`}>
      <div className="h-3 bg-brand/20 rounded-full overflow-hidden relative">
        <motion.div 
          className="h-full rounded-full bg-brand"
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
      {(showLabel || showPercentage) && (
        <div className="flex justify-between mt-2 text-sm text-secondary">
          {showLabel && <span>{t.install.progress || 'Progress'}</span>}
          {showPercentage && <span>{Math.round(clampedValue)}%</span>}
        </div>
      )}
    </div>
  )
}
