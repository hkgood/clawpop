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
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-4">
      {/* 庆祝动画 */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="w-16 h-16 rounded-lg bg-btn-primary flex items-center justify-center mb-4"
      >
        <Sparkles size={32} className="text-btn-primary" />
      </motion.div>
      
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-base font-semibold text-center mb-2 text-primary"
      >
        {t.success.title}
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-sm text-center mb-4 text-secondary"
      >
        {t.success.subtitle}
      </motion.p>
      
      {/* 信息卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-sm space-y-2 mb-4"
      >
        <div className="bg-secondary rounded-lg p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-accent flex items-center justify-center">
            <Globe size={14} className="text-btn-primary" />
          </div>
          <div className="flex-1">
            <div className="text-xs text-secondary">{t.success.consoleUrl}</div>
            <button 
              onClick={handleCopyUrl}
              className="text-xs font-mono text-accent hover:underline flex items-center gap-1 group"
            >
              {consoleUrl}
              {copied ? (
                <Check size={10} className="text-primary" />
              ) : (
                <Copy size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          </div>
        </div>
        
        <div className="bg-secondary rounded-lg p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-accent flex items-center justify-center">
            <MessageCircle size={14} className="text-btn-primary" />
          </div>
          <div className="flex-1">
            <div className="text-xs text-secondary">{t.success.nextStep}</div>
            <div className="text-xs text-primary">
              {t.success.sendCmd} <code className="px-1 py-0.5 bg-hover rounded text-xs text-primary">{t.success.startCmd}</code> {t.success.toStart}
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* 操作按钮 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex gap-2"
      >
        <Button onClick={handleOpenDashboard}>
          <Globe size={14} />
          {t.success.openConsole}
        </Button>
        <Button variant="secondary" onClick={reset}>
          <RefreshCw size={14} />
          {t.success.reinstall}
        </Button>
      </motion.div>
      
      {/* 底部提示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-xs text-center text-secondary"
      >
        <p>{language === 'zh' ? '如有问题，请查看' : 'For help, check'}</p>
        <a 
          href="https://docs.openclaw.ai" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline inline-flex items-center gap-1"
        >
          {t.success.docs}
          <ExternalLink size={10} />
        </a>
      </motion.div>
    </div>
  )
}
