import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Loader2, Copy, Check, X } from 'lucide-react'
import { Button } from '../ui/Button'
import { Progress } from '../ui/Progress'
import { useAppStore } from '../../stores/appStore'
import { useTranslation } from '../../i18n/useTranslation'
import { invoke } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'

export function Install() {
  const { setPage, installProgress, setInstallProgress, installError, setInstallError, installConfig } = useAppStore()
  const { t } = useTranslation()
  const [logs, setLogs] = useState<string[]>([])
  const [isInstalling, setIsInstalling] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)
  const [copied, setCopied] = useState(false)
  const logContainerRef = useRef<HTMLDivElement>(null)
  const installCancelled = useRef(false)
  
  // 复制日志到剪贴板
  const handleCopyLogs = async () => {
    const logText = logs.join('\n')
    try {
      await navigator.clipboard.writeText(logText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }
  
  // 取消安装
  const handleCancel = useCallback(async () => {
    if (isCancelling) return
    setIsCancelling(true)
    installCancelled.current = true
    
    try {
      await invoke('cancel_install')
    } catch {
      // 忽略取消错误
    }
    
    // 延迟返回欢迎页
    setTimeout(() => {
      setIsInstalling(false)
      setPage('welcome')
    }, 500)
  }, [isCancelling, setPage])
  
  // 监听安装日志事件
  useEffect(() => {
    const unlistenLog = listen<string>('install-log', (event) => {
      if (installCancelled.current) return
      setLogs(prev => [...prev, event.payload])
    })
    
    const unlistenProgress = listen<{step: string, message: string, progress: number}>('install-progress', (event) => {
      if (installCancelled.current) return
      setInstallProgress(event.payload)
    })
    
    return () => {
      unlistenLog.then(fn => fn())
      unlistenProgress.then(fn => fn())
    }
  }, [setInstallProgress])
  
  // 执行真正的安装
  useEffect(() => {
    const runInstall = async () => {
      try {
        // 第一步：检查环境
        setLogs(prev => [...prev, '> 开始安装 OpenClaw...', ''])
        await invoke('check_env')
        
        if (installCancelled.current) return
        
        // 第二步：开始安装（包含配置保存和克隆）
        await invoke('start_install', { config: installConfig })
        
        if (installCancelled.current) return
        
        // 安装完成
        setIsInstalling(false)
        setTimeout(() => setPage('success'), 1000)
      } catch (err) {
        if (!installCancelled.current) {
          setInstallError(String(err))
          setIsInstalling(false)
        }
      }
    }
    
    runInstall()
  }, [])
  
  const progressValue = installProgress?.progress || 0
  
  // 步骤名称（根据语言）
  const steps = [
    { id: 'check', name: t.install.stepCheck },
    { id: 'clone', name: t.install.stepClone },
    { id: 'deps', name: t.install.stepDeps },
    { id: 'config', name: t.install.stepConfig },
    { id: 'service', name: t.install.stepService },
    { id: 'start', name: t.install.stepStart },
  ]
  
  // 根据进度计算当前步骤
  const getStepStatus = (stepIndex: number) => {
    if (!isInstalling && progressValue === 100) {
      return { done: true, active: false }
    }
    const thresholds = [17, 33, 50, 66, 83, 95]
    if (progressValue >= thresholds[stepIndex]) {
      return { done: true, active: false }
    }
    if (stepIndex === 0 && progressValue > 0) {
      return { done: true, active: false }
    }
    if (stepIndex === Math.floor(progressValue / 16.6)) {
      return { done: false, active: true }
    }
    return { done: false, active: false }
  }

  return (
    <div className="flex-1 flex flex-col px-8 py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold mb-2">
            {isInstalling ? t.install.title : t.install.titleDone}
          </h2>
          <p className="text-secondary">
            {installProgress?.message || t.install.subtitle}
          </p>
        </div>
        
        {/* 取消按钮 */}
        {isInstalling && (
          <Button 
            variant="ghost" 
            onClick={handleCancel}
            disabled={isCancelling}
            className="text-status-error hover:text-status-error"
          >
            {isCancelling ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <X size={16} />
            )}
            取消
          </Button>
        )}
      </motion.div>
      
      {/* 进度条 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="my-6"
      >
        <Progress value={progressValue} showPercentage />
      </motion.div>
      
      {/* 步骤列表 */}
      <div className="mb-6 space-y-2">
        {steps.map((step, index) => {
          const status = getStepStatus(index)
          return (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center gap-3 p-3 rounded-lg ${
              status.active ? 'bg-brand/30' : 'bg-card'
            }`}
          >
            {status.done ? (
              <CheckCircle2 size={18} className="text-status-success" />
            ) : status.active ? (
              <Loader2 size={18} className="text-brand animate-spin" />
            ) : (
              <Circle size={18} className="text-secondary" />
            )}
            <span className={status.active ? 'text-white' : 'text-secondary'}>
              {step.name}
            </span>
          </motion.div>
          )
        })}
      </div>
      
      {/* 日志输出 */}
      <div className="flex-1 bg-black/30 rounded-xl p-4 font-mono text-sm overflow-y-auto" ref={logContainerRef}>
        {logs.length > 0 && (
          <div className="flex justify-end mb-2">
            <button
              onClick={handleCopyLogs}
              className="flex items-center gap-1 text-xs text-secondary hover:text-white transition-colors"
            >
              {copied ? <Check size={12} className="text-status-success" /> : <Copy size={12} />}
              {copied ? t.install.copied : t.install.copyLogs}
            </button>
          </div>
        )}
        {logs.map((log, index) => (
          <div 
            key={index} 
            className={`${
              log.includes('✓') ? 'text-status-success' :
              log.includes('>') ? 'text-brand' :
              log.includes('🎉') ? 'text-status-success font-bold' :
              log.includes('✗') ? 'text-status-error' :
              'text-secondary'
            }`}
          >
            {log || '\u00A0'}
          </div>
        ))}
      </div>
      
      {/* 错误处理 */}
      {installError && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-status-error/20 border border-status-error rounded-xl"
        >
          <div className="text-status-error font-medium">{t.install.error}</div>
          <div className="text-sm text-secondary mt-1">{installError}</div>
          <Button 
            className="mt-3" 
            onClick={() => setInstallError(null)}
          >
            {t.install.retry}
          </Button>
        </motion.div>
      )}
    </div>
  )
}
