import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Welcome } from './components/pages/Welcome'
import { EnvCheck } from './components/pages/EnvCheck'
import { Config } from './components/pages/Config'
import { Install } from './components/pages/Install'
import { Success } from './components/pages/Success'
import { ProgressBar } from './components/ui/ProgressBar'
import { useAppStore } from './stores/appStore'
import { invoke } from '@tauri-apps/api/core'

function App() {
  const { currentPage } = useAppStore()
  
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
        <button
          onClick={handleClose}
          className="w-6 h-6 rounded-md flex items-center justify-center text-text-secondary hover:bg-status-error/80 hover:text-white transition-colors"
        >
          <X size={14} />
        </button>
      </div>
      
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
