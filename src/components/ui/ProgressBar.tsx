import { useAppStore, Page } from '../../stores/appStore'
import { useTranslation } from '../../i18n/useTranslation'

// 安装流程页面才显示进度条
const installPages: Page[] = ['welcome', 'env', 'config', 'install', 'success']

export function ProgressBar() {
  const { t } = useTranslation()
  const { currentPage, setPage } = useAppStore()
  
  // 非安装流程页面不显示进度条
  if (!installPages.includes(currentPage)) {
    return null
  }
  
  const steps: { id: Page; label: string }[] = [
    { id: 'welcome', label: t.progressBar.welcome },
    { id: 'env', label: t.progressBar.env },
    { id: 'config', label: t.progressBar.config },
    { id: 'install', label: t.progressBar.install },
    { id: 'success', label: t.progressBar.success },
  ]
  
  const currentIndex = steps.findIndex(s => s.id === currentPage)
  
  return (
    <div className="h-14 flex items-center justify-center px-8 border-t bg-secondary border-light">
      <div className="flex items-center gap-1">
        {steps.map((step, index) => {
          const isActive = index === currentIndex
          const isCompleted = index < currentIndex
          
          return (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => setPage(step.id)}
                className={`px-3 py-1 text-xs transition-all hover:underline ${
                  isActive 
                    ? 'font-semibold text-primary' 
                    : isCompleted
                    ? 'text-secondary'
                    : 'text-muted'
                }`}
              >
                {step.label}
              </button>
              
              {index < steps.length - 1 && (
                <span className="text-muted mx-1">/</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
