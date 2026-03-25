import { Sun, Moon } from 'lucide-react'
import { useAppStore } from '../../stores/appStore'

export function ThemeToggle() {
  const { theme, setTheme } = useAppStore()
  
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-7 h-7 rounded-sm flex items-center justify-center text-secondary hover:text-primary hover:bg-hover transition-colors"
    >
      {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  )
}
