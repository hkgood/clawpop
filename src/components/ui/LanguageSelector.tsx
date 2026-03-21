import { useTranslation } from '../../i18n/useTranslation'
import { useAppStore } from '../../stores/appStore'

interface LanguageSelectorProps {
  className?: string
  showLabel?: boolean
}

export function LanguageSelector({ className = '', showLabel = false }: LanguageSelectorProps) {
  const { language, setLanguage } = useTranslation()
  const { theme } = useAppStore()
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className={`text-sm ${theme === 'light' ? 'text-[#64748B]' : 'text-text-secondary'}`}>语言</span>
      )}
      <div className="flex gap-1">
        <button 
          onClick={() => setLanguage('zh')}
          className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
            language === 'zh' 
              ? 'bg-brand-start text-white' 
              : theme === 'light'
                ? 'text-[#64748B] hover:text-[#1E293B] hover:bg-black/10'
                : 'text-text-secondary hover:text-white hover:bg-white/10'
          }`}
        >
          中文
        </button>
        <button 
          onClick={() => setLanguage('en')}
          className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
            language === 'en' 
              ? 'bg-brand-start text-white' 
              : theme === 'light'
                ? 'text-[#64748B] hover:text-[#1E293B] hover:bg-black/10'
                : 'text-text-secondary hover:text-white hover:bg-white/10'
          }`}
        >
          EN
        </button>
      </div>
    </div>
  )
}
