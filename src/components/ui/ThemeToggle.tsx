import { Sun, Moon } from 'lucide-react'
import { useAppStore } from '../../stores/appStore'

export function ThemeToggle() {
  const { theme, setTheme } = useAppStore()
  
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
        theme === 'light'
          ? 'text-[#64748B] hover:bg-black/10 hover:text-[#1E293B]'
          : 'text-text-secondary hover:bg-white/10 hover:text-white'
      }`}
      title={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
    >
      {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  )
}
