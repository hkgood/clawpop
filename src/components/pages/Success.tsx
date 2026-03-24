import { motion } from 'framer-motion'
import { Sparkles, Globe, ExternalLink, RefreshCw, Copy, Check, MessageCircle } from 'lucide-react'
import { Button } from '../ui/Button'
import { useAppStore } from '../../stores/appStore'
import { useTranslation } from '../../i18n/useTranslation'
import { useState } from 'react'

export function Success() {
  const { reset } = useAppStore()
  const { t, language } = useTranslation()
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
        className="w-20 h-20 rounded-sm bg-btn-primary flex items-center justify-center mb-6"
      >
        <Sparkles size={40} className="text-btn-primary" />
      </motion.div>
      
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-h1 text-center mb-4 text-primary"
      >
        {t.success.title}
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-body text-center mb-8 text-secondary"
      >
        {t.success.subtitle}
      </motion.p>
      
      {/* 信息卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-md space-y-4 mb-8"
      >
        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-accent flex items-center justify-center">
            <Globe size={20} className="text-secondary" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-secondary">{t.success.consoleUrl}</div>
            <button 
              onClick={handleCopyUrl}
              className="font-mono text-secondary hover:text-primary hover:underline flex items-center gap-1 group"
            >
              {consoleUrl}
              {copied ? (
                <Check size={14} className="text-success" />
              ) : (
                <Copy size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          </div>
        </div>
        
        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-success flex items-center justify-center">
            <MessageCircle size={20} className="text-success" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-secondary">{t.success.nextStep}</div>
            <div className="text-sm text-primary">
              {t.success.sendCmd} <code className="px-1.5 py-0.5 bg-hover rounded text-brand">{t.success.startCmd}</code> {t.success.toStart}
            </div>
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
          {t.success.openConsole}
        </Button>
        <Button variant="secondary" onClick={reset}>
          <RefreshCw size={16} />
          {t.success.reinstall}
        </Button>
      </motion.div>
      
      {/* 底部提示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 text-sm text-center text-secondary"
      >
        <p>{language === 'zh' ? '如有问题，请查看' : 'For help, check'}</p>
        <a 
          href="https://docs.openclaw.ai" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-secondary hover:text-primary hover:underline inline-flex items-center gap-1"
        >
          {t.success.docs}
          <ExternalLink size={12} />
        </a>
      </motion.div>
    </div>
  )
}
