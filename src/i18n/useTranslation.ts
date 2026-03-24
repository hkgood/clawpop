import { useAppStore } from '../stores/appStore'
import { translations, Translations } from './translations'

export function useTranslation() {
  const language = useAppStore(state => state.language)
  const setLanguage = useAppStore(state => state.setLanguage)
  
  const t: Translations = translations[language]
  
  return {
    t,
    language,
    setLanguage,
  }
}
