import { motion } from 'framer-motion'
import { Check, Circle } from 'lucide-react'
import { useAppStore, Page } from '../../stores/appStore'

const steps: { id: Page; label: string }[] = [
  { id: 'welcome', label: '欢迎' },
  { id: 'env', label: '环境' },
  { id: 'config', label: '配置' },
  { id: 'install', label: '安装' },
  { id: 'success', label: '完成' },
]

export function ProgressBar() {
  const { currentPage, setPage } = useAppStore()
  
  const currentIndex = steps.findIndex(s => s.id === currentPage)
  
  return (
    <div className="h-16 bg-bg-secondary/80 backdrop-blur-xl flex items-center justify-center px-8 border-t border-white/5">
      <div className="flex items-center gap-2">
        {steps.map((step, index) => {
          const isActive = index === currentIndex
          const isCompleted = index < currentIndex
          const isClickable = index <= currentIndex || step.id === 'welcome'
          
          return (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => isClickable && setPage(step.id)}
                disabled={!isClickable}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-brand-start/20 text-brand-start' 
                    : isCompleted
                    ? 'text-status-success hover:bg-white/5'
                    : 'text-text-secondary hover:bg-white/5'
                } ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              >
                {isCompleted ? (
                  <Check size={16} />
                ) : isActive ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <Circle size={16} className="fill-brand-start" />
                  </motion.div>
                ) : (
                  <Circle size={16} />
                )}
                <span className="text-sm font-medium">{step.label}</span>
              </button>
              
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-1 ${
                  isCompleted ? 'bg-status-success' : 'bg-white/10'
                }`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
