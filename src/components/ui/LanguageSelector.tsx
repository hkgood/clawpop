import { useTranslation } from '../../i18n/useTranslation'
import { useAppStore } from '../../stores/appStore'

interface LanguageSelectorProps {
  className?: string
  showLabel?: boolean
}

export function LanguageSelector({ className = '', showLabel = false }: LanguageSelectorProps) {
  const { language, setLanguage } = useTranslation()
  const { theme } = useAppStore()
  
  const activeClass = theme === 'light' ? 'bg-brand text-white' : 'bg-white text-primary'
  const inactiveClass = theme === 'light' ? 'text-secondary' : 'text-secondary'
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className="text-sm text-secondary">{language === 'zh' ? '语言' : 'Lang'}</span>
      )}
      <div className="flex gap-1">
        <button 
          onClick={() => setLanguage('zh')}
          className={`px-2 py-1 text-xs rounded-sm transition-all ${language === 'zh' ? activeClass : inactiveClass}`}
        >
          中
        </button>
        <button 
          onClick={() => setLanguage('en')}
          className={`px-2 py-1 text-xs rounded-sm transition-all ${language === 'en' ? activeClass : inactiveClass}`}
        >
          EN
        </button>
      </div>
    </div>
  )
}
