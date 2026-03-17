import { motion } from 'framer-motion'
import { Sparkles, Globe, BookOpen, ExternalLink, RefreshCw, Copy, Check, MessageCircle } from 'lucide-react'
import { Button } from '../ui/Button'
import { useAppStore } from '../../stores/appStore'
import { useState } from 'react'

export function Success() {
  const { reset } = useAppStore()
  const [copied, setCopied] = useState(false)
  const consoleUrl = 'http://127.0.0.1:18789'
  
  const handleOpenDashboard = () => {
    window.open(consoleUrl, '_blank')
  }

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(consoleUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-6">
      {/* 庆祝动画 */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-start to-brand-end flex items-center justify-center mb-8 shadow-2xl shadow-brand-start/30"
      >
        <Sparkles size={40} className="text-white" />
      </motion.div>
      
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-bold text-center mb-4"
      >
        安装成功!
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-xl text-text-secondary text-center mb-8"
      >
        OpenClaw 已经装好了，随时可以使用
      </motion.p>
      
      {/* 信息卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-md space-y-4 mb-8"
      >
        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-start/20 flex items-center justify-center">
            <Globe size={20} className="text-brand-start" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-text-secondary">控制台地址</div>
            <button 
              onClick={handleCopyUrl}
              className="font-mono text-brand-start hover:underline flex items-center gap-1 group"
            >
              {consoleUrl}
              {copied ? (
                <Check size={14} className="text-status-success" />
              ) : (
                <Copy size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          </div>
        </div>
        
        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-status-success/20 flex items-center justify-center">
            <MessageCircle size={20} className="text-status-success" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-text-secondary">下一步</div>
            <div className="text-sm">在控制台发送 <code className="px-1.5 py-0.5 bg-white/10 rounded text-brand-start">/start</code> 开始对话</div>
          </div>
        </div>
      </motion.div>
      
      {/* 操作按钮 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex gap-4"
      >
        <Button onClick={handleOpenDashboard}>
          <Globe size={16} />
          打开控制台
        </Button>
        <Button variant="secondary" onClick={reset}>
          <RefreshCw size={16} />
          重新安装
        </Button>
      </motion.div>
      
      {/* 底部提示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 text-sm text-text-secondary text-center"
      >
        <p>如有问题，请查看</p>
        <a 
          href="https://docs.openclaw.ai" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-start hover:underline inline-flex items-center gap-1"
        >
          OpenClaw 文档
          <ExternalLink size={12} />
        </a>
      </motion.div>
    </div>
  )
}
