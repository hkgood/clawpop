import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Trash2, Settings, Play, Loader2, Cog } from 'lucide-react'
import { Button } from '../ui/Button'
import { useAppStore } from '../../stores/appStore'
import { useTranslation } from '../../i18n/useTranslation'
import { invoke } from '@tauri-apps/api/core'

export function Welcome() {
  const { setPage, theme } = useAppStore()
  const { t } = useTranslation()
  const [isInstalled, setIsInstalled] = useState<boolean | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [checking, setChecking] = useState(true)

  // 检测安装和运行状态
  useEffect(() => {
    const checkStatus = async () => {
      setChecking(true)
      try {
        const installed = await invoke<boolean>('check_installed')
        setIsInstalled(installed)
        
        if (installed) {
          const running = await invoke<boolean>('check_running')
          setIsRunning(running)
        }
      } catch {
        setIsInstalled(false)
      } finally {
        setChecking(false)
      }
    }
    checkStatus()
  }, [])

  const handleOpenConsole = () => {
    window.open('http://127.0.0.1:18789', '_blank')
  }

  const handleStartService = async () => {
    try {
      await invoke('start_service')
      setIsRunning(true)
    } catch (err) {
      console.error('Failed to start:', err)
    }
  }

  // 加载中
  if (checking) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <Loader2 size={32} className="text-brand-start animate-spin mb-4" />
        <p className={theme === 'light' ? 'text-[#64748B]' : 'text-text-secondary'}>检测安装状态...</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
        className="w-32 h-32 rounded-3xl bg-gradient-to-br from-brand-start via-brand-end to-orange-300 flex items-center justify-center mb-10 shadow-2xl shadow-brand-start/30"
      >
        <span className="text-white font-bold text-4xl">CP</span>
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`text-4xl font-bold text-center mb-4 tracking-tight ${theme === 'light' ? 'text-[#1E293B]' : ''}`}
      >
        {t.welcome.title}
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`text-lg text-center mb-3 ${theme === 'light' ? 'text-[#64748B]' : 'text-text-secondary'}`}
      >
        {t.welcome.subtitle}
      </motion.p>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-base text-brand-start font-medium mb-8"
      >
        {t.welcome.slogan}
      </motion.p>
      
      {/* 根据安装状态显示不同按钮 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col gap-3"
      >
        {isInstalled ? (
          // 已安装
          <>
            {isRunning ? (
              <Button size="lg" onClick={handleOpenConsole} className="px-12">
                <Play size={18} />
                打开控制台
              </Button>
            ) : (
              <Button size="lg" onClick={handleStartService} className="px-12">
                <Play size={18} />
                启动服务
              </Button>
            )}
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={() => setPage('config')}>
                <Settings size={16} />
                配置
              </Button>
              <Button variant="secondary" onClick={() => setPage('settings')}>
                <Cog size={16} />
                设置
              </Button>
              <Button variant="ghost" onClick={() => setPage('uninstall')}>
                <Trash2 size={16} />
                卸载
              </Button>
            </div>
          </>
        ) : (
          // 未安装
          <>
            <Button 
              size="lg"
              onClick={() => setPage('env')}
              className="px-12"
            >
              {t.welcome.button}
              <ArrowRight size={18} />
            </Button>
            <Button variant="ghost" onClick={() => setPage('uninstall')}>
              <Trash2 size={16} />
              {t.welcome.uninstall}
            </Button>
          </>
        )}
      </motion.div>
    </div>
  )
}
