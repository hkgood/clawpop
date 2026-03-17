import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Loader2, Copy, Check } from 'lucide-react'
import { Button } from '../ui/Button'
import { Progress } from '../ui/Progress'
import { useAppStore } from '../../stores/appStore'

const installSteps = [
  { id: 'check', name: '检查环境' },
  { id: 'clone', name: '克隆仓库' },
  { id: 'deps', name: '安装依赖' },
  { id: 'config', name: '初始化配置' },
  { id: 'service', name: '安装服务' },
  { id: 'start', name: '启动服务' },
]

export function Install() {
  const { setPage, installProgress, setInstallProgress, installError, setInstallError } = useAppStore()
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
  
  // 模拟安装过程
  useEffect(() => {
    const installLogs = [
      '> 检查环境...',
      '✓ Node.js v24.0.0',
      '✓ npm v11.8.0',
      '✓ Git v2.40.0',
      '✓ 网络正常',
      '',
      '> 开始安装 OpenClaw...',
      '',
      '> 克隆仓库到 ~/.openclaw...',
      'Cloning into \'openclaw\'...',
      'remote: Enumerating objects: 1234, done.',
      'Receiving objects: 100% (1234/1234), 2.5 MiB | 1.2 MiB/s, done.',
      'Resolving deltas: 100% (890/890), done.',
      '',
      '> 安装依赖 (npm install)...',
      'added 1234 packages in 45s',
      '',
      '> 初始化配置...',
      '✓ 配置已保存',
      '',
      '> 安装系统服务...',
      '✓ 服务已安装',
      '',
      '> 启动服务...',
      '✓ OpenClaw Gateway 已启动',
      '',
      '🎉 安装完成！',
    ]
    
    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex < installLogs.length) {
        setLogs(prev => [...prev, installLogs[currentIndex]])
        
        // 根据日志更新进度
        if (installLogs[currentIndex].includes('克隆仓库')) {
          setInstallProgress({ step: 'clone', message: '正在克隆仓库...', progress: 30 })
        } else if (installLogs[currentIndex].includes('安装依赖')) {
          setInstallProgress({ step: 'deps', message: '正在安装依赖...', progress: 50 })
        } else if (installLogs[currentIndex].includes('初始化配置')) {
          setInstallProgress({ step: 'config', message: '正在初始化配置...', progress: 70 })
        } else if (installLogs[currentIndex].includes('安装系统服务')) {
          setInstallProgress({ step: 'service', message: '正在安装服务...', progress: 85 })
        } else if (installLogs[currentIndex].includes('启动服务')) {
          setInstallProgress({ step: 'start', message: '正在启动服务...', progress: 95 })
        } else if (installLogs[currentIndex].includes('安装完成')) {
          setInstallProgress({ step: 'done', message: '安装完成！', progress: 100 })
        }
        
        currentIndex++
      } else {
        clearInterval(interval)
        setIsInstalling(false)
        // 安装完成后自动跳转到成功页面
        setTimeout(() => {
          setPage('success')
        }, 500)
      }
    }, 200)
    
    return () => clearInterval(interval)
  }, [setInstallProgress, setPage])
  
  const progressValue = installProgress?.progress || 0
  
  // 根据进度计算当前步骤
  const getStepStatus = (stepIndex: number) => {
    if (!isInstalling && progressValue === 100) {
      return { done: true, active: false }
    }
    // 0-16: check, 17-33: clone, 34-50: deps, 51-66: config, 67-83: service, 84-100: start
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
      
      {/* 步骤列表 - 简化版，仅显示当前状态 */}
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
        {/* 复制按钮 */}
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
