import { motion, AnimatePresence } from 'framer-motion'
import { X, HelpCircle } from 'lucide-react'
import { Welcome } from './components/pages/Welcome'
import { EnvCheck } from './components/pages/EnvCheck'
import { Config } from './components/pages/Config'
import { Install } from './components/pages/Install'
import { Success } from './components/pages/Success'
import { ProgressBar } from './components/ui/ProgressBar'
import { useAppStore } from './stores/appStore'
import { invoke } from '@tauri-apps/api/core'
import { useEffect, useState } from 'react'

function App() {
  const { currentPage, setPage } = useAppStore()
  const [showHelp, setShowHelp] = useState(false)
  
  // 键盘导航支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + . = 返回上一步
      if ((e.metaKey || e.ctrlKey) && e.key === '.') {
        e.preventDefault()
        const pageOrder = ['welcome', 'env', 'config', 'install', 'success']
        const currentIndex = pageOrder.indexOf(currentPage)
        if (currentIndex > 0 && currentPage !== 'install') {
          setPage(pageOrder[currentIndex - 1] as typeof currentPage)
        }
      }
      // ? = 显示帮助
      if (e.key === '?' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setShowHelp(prev => !prev)
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
  }

  const handleClose = () => {
    invoke('close_window')
  }
  
  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-bg-primary to-bg-dark overflow-hidden rounded-[16px]">
      {/* 自定义标题栏 - 包含关闭按钮 */}
      <div className="h-10 flex items-center justify-between px-4 bg-bg-secondary/50" data-tauri-drag-region>
        <div className="flex items-center gap-2" data-tauri-drag-region>
          <span className="text-xs text-text-secondary">ClawPop</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowHelp(true)}
            className="w-6 h-6 rounded-md flex items-center justify-center text-text-secondary hover:bg-white/10 hover:text-white transition-colors"
            title="帮助 (⌘?)"
          >
            <HelpCircle size={14} />
          </button>
          <button
            onClick={handleClose}
            className="w-6 h-6 rounded-md flex items-center justify-center text-text-secondary hover:bg-status-error/80 hover:text-white transition-colors"
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
              <h3 className="text-lg font-bold mb-4">快捷键</h3>
              <div className="space-y-2 text-sm text-text-secondary">
                <div className="flex justify-between">
                  <span>返回上一步</span>
                  <kbd className="px-2 py-1 bg-white/10 rounded text-xs">⌘ + .</kbd>
                </div>
                <div className="flex justify-between">
                  <span>确认 / 下一步</span>
                  <kbd className="px-2 py-1 bg-white/10 rounded text-xs">Enter</kbd>
                </div>
                <div className="flex justify-between">
                  <span>显示帮助</span>
                  <kbd className="px-2 py-1 bg-white/10 rounded text-xs">⌘ + ?</kbd>
                </div>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="mt-4 w-full py-2 bg-brand-start text-white rounded-lg hover:bg-brand-start/80 transition-colors"
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
