import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Loader2, Copy, Check } from 'lucide-react'
import { Button } from '../ui/Button'
import { Progress } from '../ui/Progress'
import { useAppStore } from '../../stores/appStore'
import { invoke } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'

const installSteps = [
  { id: 'check', name: '检查环境' },
  { id: 'clone', name: '克隆仓库' },
  { id: 'deps', name: '安装依赖' },
  { id: 'config', name: '初始化配置' },
  { id: 'service', name: '安装服务' },
  { id: 'start', name: '启动服务' },
]

export function Install() {
  const { setPage, installProgress, setInstallProgress, installError, setInstallError, installConfig } = useAppStore()
  const [logs, setLogs] = useState<string[]>([])
  const [isInstalling, setIsInstalling] = useState(true)
  const [copied, setCopied] = useState(false)
  const logContainerRef = useRef<HTMLDivElement>(null)
  
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
  
  // 监听安装日志事件
  useEffect(() => {
    const unlistenLog = listen<string>('install-log', (event) => {
      setLogs(prev => [...prev, event.payload])
    })
    
    const unlistenProgress = listen<{step: string, message: string, progress: number}>('install-progress', (event) => {
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
        
        // 第二步：开始安装（包含配置保存和克隆）
        await invoke('start_install', { config: installConfig })
        
        // 安装完成
        setIsInstalling(false)
        setTimeout(() => setPage('success'), 1000)
      } catch (err) {
        setInstallError(String(err))
        setIsInstalling(false)
      }
    }
    
    runInstall()
  }, [])
  
  const progressValue = installProgress?.progress || 0
  
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
      >
        <h2 className="text-2xl font-bold mb-2">
          {isInstalling ? '安装中' : '安装完成'}
        </h2>
        <p className="text-text-secondary mb-6">
          {installProgress?.message || '正在安装 OpenClaw...'}
        </p>
      </motion.div>
      
      {/* 进度条 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Progress value={progressValue} />
      </motion.div>
      
      {/* 步骤列表 */}
      <div className="mb-6 space-y-2">
        {installSteps.map((step, index) => {
          const status = getStepStatus(index)
          return (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center gap-3 p-3 rounded-lg ${
              status.active ? 'bg-brand-start/10' : 'bg-white/5'
            }`}
          >
            {status.done ? (
              <CheckCircle2 size={18} className="text-status-success" />
            ) : status.active ? (
              <Loader2 size={18} className="text-brand-start animate-spin" />
            ) : (
              <Circle size={18} className="text-text-secondary" />
            )}
            <span className={status.active ? 'text-white' : 'text-text-secondary'}>
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
              className="flex items-center gap-1 text-xs text-text-secondary hover:text-white transition-colors"
            >
              {copied ? <Check size={12} className="text-status-success" /> : <Copy size={12} />}
              {copied ? '已复制' : '复制日志'}
            </button>
          </div>
        )}
        {logs.map((log, index) => (
          <div 
            key={index} 
            className={`${
              log.includes('✓') ? 'text-status-success' :
              log.includes('>') ? 'text-brand-start' :
              log.includes('🎉') ? 'text-status-success font-bold' :
              log.includes('✗') ? 'text-status-error' :
              'text-text-secondary'
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
          <div className="text-status-error font-medium">安装失败</div>
          <div className="text-sm text-text-secondary mt-1">{installError}</div>
          <Button 
            className="mt-3" 
            onClick={() => setInstallError(null)}
          >
            重试
          </Button>
        </motion.div>
      )}
    </div>
  )
}
