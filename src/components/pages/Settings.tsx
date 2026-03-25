import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Play, Square, RotateCcw, Download, Upload, 
  FileText, Moon, Sun, Globe, ArrowLeft
} from 'lucide-react'
import { Button } from '../ui/Button'
import { useAppStore } from '../../stores/appStore'
import { useTranslation } from '../../i18n/useTranslation'
import { invoke } from '@tauri-apps/api/core'

export function SettingsPage() {
  const { t, language, setLanguage } = useTranslation()
  const { theme, setTheme, setPage } = useAppStore()
  const [serviceStatus, setServiceStatus] = useState<'running' | 'stopped' | 'checking'>('checking')
  const [loading, setLoading] = useState(false)
  const [versionInfo, setVersionInfo] = useState<{installed: boolean; version: string | null}>({
    installed: false,
    version: null
  })

  // 获取服务状态
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await invoke<string>('get_service_status')
        setServiceStatus(status as 'running' | 'stopped')
      } catch {
        setServiceStatus('stopped')
      }
    }
    checkStatus()
    const interval = setInterval(checkStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  // 获取版本信息
  useEffect(() => {
    const getVersion = async () => {
      try {
        const info = await invoke<{installed: boolean; version: string | null}>('get_version')
        setVersionInfo(info)
      } catch {}
    }
    getVersion()
  }, [])

  const handleStart = async () => {
    setLoading(true)
    try {
      await invoke('start_service')
      setServiceStatus('running')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStop = async () => {
    setLoading(true)
    try {
      await invoke('stop_service')
      setServiceStatus('stopped')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRestart = async () => {
    setLoading(true)
    try {
      await invoke('restart_service')
      setServiceStatus('running')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    const config = localStorage.getItem('clawpop-storage')
    if (config) {
      const blob = new Blob([config], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'clawpop-config.json'
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const text = await file.text()
        try {
          const data = JSON.parse(text)
          localStorage.setItem('clawpop-storage', JSON.stringify(data))
          window.location.reload()
        } catch {
          alert('配置文件格式错误')
        }
      }
    }
    input.click()
  }

  return (
    <div className="flex-1 flex flex-col px-8 py-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className={`text-2xl font-bold mb-2 ${theme === 'light' ? 'text-primary' : ''}`}>{t.settings.title}</h2>
        <p className="text-sm mb-8 text-secondary">{t.settings.manageOpenClaw}</p>
      </motion.div>

      {/* 服务状态 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h3 className={`text-lg font-medium mb-4 flex items-center gap-2 ${theme === 'light' ? 'text-primary' : ''}`}>
          <Play size={18} />
          服务状态
        </h3>
        
        <div className={`rounded-xl p-4 border ${
          theme === 'light' 
            ? 'bg-white/80 border-default' 
            : 'bg-white/5 border border-white/5'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                serviceStatus === 'running' ? 'bg-status-success animate-pulse' :
                serviceStatus === 'stopped' ? (theme === 'light' ? 'bg-muted' : 'bg-muted') : 'bg-status-warning animate-pulse'
              }`} />
              <span className={`font-medium ${theme === 'light' ? 'text-primary' : ''}`}>
                {serviceStatus === 'running' ? '运行中' : 
                 serviceStatus === 'stopped' ? '已停止' : '检测中...'}
              </span>
              {versionInfo.installed && versionInfo.version && (
                <span className={`text-sm ml-2 ${theme === 'light' ? 'text-secondary' : 'text-secondary'}`}>
                  v{versionInfo.version}
                </span>
              )}
            </div>
            
            <div className="flex gap-2">
              {serviceStatus === 'running' ? (
                <>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={handleRestart}
                    disabled={loading}
                  >
                    <RotateCcw size={14} />
                    重启
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={handleStop}
                    disabled={loading}
                  >
                    <Square size={14} />
                    停止
                  </Button>
                </>
              ) : (
                <Button 
                  size="sm" 
                  onClick={handleStart}
                  disabled={loading || !versionInfo.installed}
                >
                  <Play size={14} />
                  启动
                </Button>
              )}
            </div>
          </div>
          
          {!versionInfo.installed && (
            <div className="text-sm text-status-warning">
              请先安装 OpenClaw
            </div>
          )}
        </div>
      </motion.div>

      {/* 外观 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <h3 className={`text-lg font-medium mb-4 flex items-center gap-2 ${theme === 'light' ? 'text-primary' : ''}`}>
          <Moon size={18} />
          外观
        </h3>
        
        <div className={`rounded-xl p-4 border ${
          theme === 'light' 
            ? 'bg-white/80 border-default' 
            : 'bg-white/5 border border-white/5'
        }`}>
          <div className="flex items-center justify-between">
            <span className={theme === 'light' ? 'text-primary' : ''}>主题</span>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme('dark')}
                className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 ${
                  theme === 'dark' 
                    ? 'bg-brand-start text-white' 
                    : theme === 'light'
                      ? 'bg-[#E2E8F0] text-primary'
                      : 'bg-white/10'
                }`}
              >
                <Moon size={14} />
                深色
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 ${
                  theme === 'light' 
                    ? 'bg-brand-start text-white' 
                    : 'bg-white/10'
                }`}
              >
                <Sun size={14} />
                浅色
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 语言 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <h3 className={`text-lg font-medium mb-4 flex items-center gap-2 ${theme === 'light' ? 'text-primary' : ''}`}>
          <Globe size={18} />
          语言
        </h3>
        
        <div className={`rounded-xl p-4 border ${
          theme === 'light' 
            ? 'bg-white/80 border-default' 
            : 'bg-white/5 border border-white/5'
        }`}>
          <div className="flex items-center justify-between">
            <span className={theme === 'light' ? 'text-primary' : ''}>界面语言</span>
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage('zh')}
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  language === 'zh' 
                    ? 'bg-brand-start text-white' 
                    : theme === 'light'
                      ? 'bg-[#E2E8F0] text-primary'
                      : 'bg-white/10'
                }`}
              >
                中文
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  language === 'en' 
                    ? 'bg-brand-start text-white' 
                    : theme === 'light'
                      ? 'bg-[#E2E8F0] text-primary'
                      : 'bg-white/10'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 导入导出 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <h3 className={`text-lg font-medium mb-4 flex items-center gap-2 ${theme === 'light' ? 'text-primary' : ''}`}>
          <FileText size={18} />
          配置备份
        </h3>
        
        <div className={`rounded-xl p-4 border ${
          theme === 'light' 
            ? 'bg-white/80 border-default' 
            : 'bg-white/5 border border-white/5'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <div className={`font-medium ${theme === 'light' ? 'text-primary' : ''}`}>导入/导出配置</div>
              <div className={`text-sm ${theme === 'light' ? 'text-secondary' : 'text-secondary'}`}>备份或恢复你的设置</div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={handleExport}>
                <Download size={14} />
                导出
              </Button>
              <Button variant="secondary" size="sm" onClick={handleImport}>
                <Upload size={14} />
                导入
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 返回 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-auto"
      >
        <Button variant="ghost" onClick={() => setPage('welcome')}>
          <ArrowLeft size={16} />
          返回
        </Button>
      </motion.div>
    </div>
  )
}
