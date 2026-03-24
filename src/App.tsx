import { motion, AnimatePresence } from 'framer-motion'
import { X, HelpCircle, Minus } from 'lucide-react'
import { Welcome } from './components/pages/Welcome'
import { EnvCheck } from './components/pages/EnvCheck'
import { Config } from './components/pages/Config'
import { Install } from './components/pages/Install'
import { Success } from './components/pages/Success'
import { Uninstall } from './components/pages/Uninstall'
import { SettingsPage } from './components/pages/Settings'
import { ProgressBar } from './components/ui/ProgressBar'
import { LanguageSelector } from './components/ui/LanguageSelector'
import { ThemeToggle } from './components/ui/ThemeToggle'
import { useAppStore } from './stores/appStore'
import { useTranslation } from './i18n/useTranslation'
import { invoke } from '@tauri-apps/api/core'
import { useEffect, useState } from 'react'

function App() {
  const { currentPage, setPage, theme } = useAppStore()
  const { t } = useTranslation()
  const [showHelp, setShowHelp] = useState(false)
  const [serviceStatus, setServiceStatus] = useState<'running' | 'stopped'>('stopped')
  const [isInstalled, setIsInstalled] = useState(false)
  
  // 获取服务状态
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const installed = await invoke<boolean>('check_installed')
        setIsInstalled(installed)
        if (installed) {
          const status = await invoke<string>('get_service_status')
          setServiceStatus(status as 'running' | 'stopped')
        }
      } catch {}
    }
    checkStatus()
    const interval = setInterval(checkStatus, 10000)
    return () => clearInterval(interval)
  }, [])
  
  // 应用主题
  useEffect(() => {
    document.body.className = theme === 'light' ? 'theme-light' : ''
  }, [theme])
  
  // 键盘导航支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '.') {
        e.preventDefault()
        const pageOrder = ['welcome', 'env', 'config', 'install', 'success']
        const currentIndex = pageOrder.indexOf(currentPage)
        if (currentIndex > 0 && currentPage !== 'install') {
          setPage(pageOrder[currentIndex - 1] as typeof currentPage)
        }
      }
      if (e.key === '?' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setShowHelp(prev => !prev)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'm') {
        e.preventDefault()
        invoke('minimize_window')
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPage, setPage])
  
  const pageComponents = {
    welcome: <Welcome />,
    env: <EnvCheck />,
    config: <Config />,
    install: <Install />,
    success: <Success />,
    uninstall: <Uninstall />,
    settings: <SettingsPage />,
  }

  const handleClose = () => {
    invoke('close_window')
  }

  const handleMinimize = () => {
    invoke('minimize_window')
  }
  
  const handleDragStart = () => {
    invoke('start_dragging')
  }
  
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden rounded-xl bg-primary">
      {/* 自定义标题栏 */}
      <div 
        className="h-10 flex items-center justify-between px-4 select-none bg-secondary text-primary border-b border-light"
        onMouseDown={handleDragStart}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs text-secondary">ClawPop</span>
          {isInstalled && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-xs border border-default text-secondary">
              <span className={`w-1.5 h-1.5 rounded-full ${serviceStatus === 'running' ? 'bg-brand animate-pulse' : 'bg-muted'}`} />
              {serviceStatus === 'running' ? t.settings.running : t.settings.stopped}
            </div>
          )}
          <LanguageSelector />
          <ThemeToggle />
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleMinimize}
            className="w-6 h-6 rounded-md flex items-center justify-center text-secondary hover:bg-hover hover:text-primary transition-colors"
            title="最小化 (⌘M)"
          >
            <Minus size={14} />
          </button>
          <button
            onClick={() => setShowHelp(true)}
            className="w-6 h-6 rounded-md flex items-center justify-center text-secondary hover:bg-hover hover:text-primary transition-colors"
            title="帮助 (⌘?)"
          >
            <HelpCircle size={14} />
          </button>
          <button
            onClick={handleClose}
            className="w-6 h-6 rounded-md flex items-center justify-center text-secondary hover:bg-error hover:text-primary transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>
      
      {/* 帮助弹窗 */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-bg-secondary rounded-2xl p-6 max-w-sm mx-4 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-4 text-primary">快捷键</h3>
              <div className="space-y-2 text-sm text-secondary">
                <div className="flex justify-between">
                  <span>返回上一步</span>
                  <kbd className="px-2 py-1 bg-hover rounded text-xs text-primary">⌘ + .</kbd>
                </div>
                <div className="flex justify-between">
                  <span>确认 / 下一步</span>
                  <kbd className="px-2 py-1 bg-hover rounded text-xs text-primary">Enter</kbd>
                </div>
                <div className="flex justify-between">
                  <span>最小化窗口</span>
                  <kbd className="px-2 py-1 bg-hover rounded text-xs text-primary">⌘ + M</kbd>
                </div>
                <div className="flex justify-between">
                  <span>显示帮助</span>
                  <kbd className="px-2 py-1 bg-hover rounded text-xs text-primary">⌘ + ?</kbd>
                </div>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="mt-4 w-full py-2 bg-btn-primary text-btn-primary rounded-lg hover:opacity-90 transition-colors"
              >
                知道了
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 主内容区 */}
      <div className="flex-1 flex overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {pageComponents[currentPage]}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* 底部进度条 */}
      <ProgressBar />
    </div>
  )
}

export default App
