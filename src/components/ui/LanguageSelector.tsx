import { useTranslation } from '../../i18n/useTranslation'
import { useAppStore } from '../../stores/appStore'

interface LanguageSelectorProps {
  className?: string
  showLabel?: boolean
}

export function LanguageSelector({ className = '', showLabel = false }: LanguageSelectorProps) {
  const { language, setLanguage } = useTranslation()
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className="text-sm text-secondary">{language === 'zh' ? '语言' : 'Lang'}</span>
      )}
      <div className="flex gap-1">
        <button 
          onClick={() => setLanguage('zh')}
          className={`px-2 py-1 text-xs rounded-sm transition-all ${
            language === 'zh' 
              ? 'bg-btn-primary text-btn-primary font-medium' 
              : 'text-secondary hover:text-primary'
          }`}
        >
          中
        </button>
        <button 
          onClick={() => setLanguage('en')}
          className={`px-2 py-1 text-xs rounded-sm transition-all ${
            language === 'en' 
              ? 'bg-btn-primary text-btn-primary font-medium' 
              : 'text-secondary hover:text-primary'
          }`}
        >
          EN
        </button>
      </div>
    </div>
  )
}
