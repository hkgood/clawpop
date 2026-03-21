import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bot, Key, MessageSquare, ArrowRight, ArrowLeft, ExternalLink, Check, X } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { useAppStore } from '../../stores/appStore'
import { useTranslation } from '../../i18n/useTranslation'

const modelIds = [
  { id: 'minimax-m2.5', nameKey: 'minimaxM25', descKey: 'free' },
  { id: 'claude-haiku', nameKey: 'claudeHaiku', descKey: 'fast' },
  { id: 'claude-sonnet', nameKey: 'claudeSonnet', descKey: 'balanced' },
  { id: 'claude-opus', nameKey: 'claudeOpus', descKey: 'powerful' },
]

const channels = [
  { id: 'telegram', name: 'Telegram', icon: '✈️', color: 'text-[#26A5E4]' },
  { id: 'discord', name: 'Discord', icon: '🎮', color: 'text-[#5865F2]' },
  { id: 'feishu', name: '飞书', icon: '📮', color: 'text-[#4285F4]' },
  { id: 'whatsapp', name: 'WhatsApp', icon: '💬', color: 'text-[#25D366]' },
]

// 模型名称翻译
const modelNames: Record<string, Record<string, string>> = {
  zh: {
    minimaxM25: 'MiniMax-M2.5',
    claudeHaiku: 'Claude Haiku',
    claudeSonnet: 'Claude Sonnet',
    claudeOpus: 'Claude Opus',
  },
  en: {
    minimaxM25: 'MiniMax-M2.5',
    claudeHaiku: 'Claude Haiku',
    claudeSonnet: 'Claude Sonnet',
    claudeOpus: 'Claude Opus',
  }
}

// 模型描述翻译
const modelDescs: Record<string, Record<string, string>> = {
  zh: {
    free: '免费额度大',
    fast: '快速响应',
    balanced: '平衡体验',
    powerful: '最强能力',
  },
  en: {
    free: 'Large free quota',
    fast: 'Fast response',
    balanced: 'Balanced',
    powerful: 'Most powerful',
  }
}

// 推荐标签翻译
const recommendText = {
  zh: '推荐',
  en: 'Recommended',
}

export function Config() {
  const { installConfig, setInstallConfig, setPage } = useAppStore()
  const { t, language } = useTranslation()
  const [apiKeyValid, setApiKeyValid] = useState<boolean | null>(null)
  
  // 验证 API Key 格式
  useEffect(() => {
    if (!installConfig.apiKey) {
      setApiKeyValid(null)
      return
    }
    // 简单验证：长度 > 10，不包含空格
    const isValid = installConfig.apiKey.length > 10 && !installConfig.apiKey.includes(' ')
    setApiKeyValid(isValid)
  }, [installConfig.apiKey])
  
  const toggleChannel = (channelId: string) => {
    const current = installConfig.channels
    if (current.includes(channelId)) {
      setInstallConfig({ channels: current.filter(c => c !== channelId) })
    } else {
      setInstallConfig({ channels: [...current, channelId] })
    }
  }
  
  const canProceed = installConfig.model && installConfig.apiKey

  return (
    <div className="flex-1 flex flex-col px-8 py-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold mb-2">{t.config.title}</h2>
        <p className="text-text-secondary mb-8">{t.config.subtitle}</p>
      </motion.div>
      
      {/* 模型选择 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Bot size={18} />
          {t.config.modelSelect}
        </h3>
        <div className="space-y-2">
          {modelIds.map((model) => (
            <motion.button
              key={model.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setInstallConfig({ model: model.id })}
              className={`w-full p-4 rounded-xl text-left transition-all ${
                installConfig.model === model.id 
                  ? 'bg-brand-start/20 border-2 border-brand-start' 
                  : 'bg-white/5 border-2 border-transparent hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {modelNames[language][model.nameKey]}
                    {model.id === 'minimax-m2.5' && (
                      <span className="px-2 py-0.5 text-xs bg-status-success/20 text-status-success rounded-full">
                        {recommendText[language]}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-text-secondary">{modelDescs[language][model.descKey]}</div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  installConfig.model === model.id 
                    ? 'border-brand-start bg-brand-start' 
                    : 'border-white/30'
                }`}>
                  {installConfig.model === model.id && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <Check size={12} className="text-white" />
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
      
      {/* API Key */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Key size={18} />
          {t.config.apiKey}
          {apiKeyValid === true && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-2 px-2 py-0.5 text-xs bg-status-success/20 text-status-success rounded-full flex items-center gap-1"
            >
              <Check size={10} /> {t.config.apiKeyValid}
            </motion.span>
          )}
          {apiKeyValid === false && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-2 px-2 py-0.5 text-xs bg-status-error/20 text-status-error rounded-full flex items-center gap-1"
            >
              <X size={10} /> {t.config.apiKeyInvalid}
            </motion.span>
          )}
        </h3>
        <Input
          type="password"
          placeholder={t.config.apiKeyPlaceholder}
          value={installConfig.apiKey}
          onChange={(e) => setInstallConfig({ apiKey: e.target.value })}
        />
        <div className="mt-2 text-sm text-text-secondary flex items-center justify-between">
          <a 
            href="#" 
            className="text-brand-start hover:underline inline-flex items-center gap-1"
            onClick={(e) => {
              e.preventDefault()
            }}
          >
            {t.config.getApiKey}
            <ExternalLink size={12} />
          </a>
          {apiKeyValid === false && (
            <span className="text-status-error text-xs">Key 长度需大于 10 位</span>
          )}
        </div>
      </motion.div>
      
      {/* 消息通道 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <MessageSquare size={18} />
          {t.config.channels}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {channels.map((channel) => (
            <motion.button
              key={channel.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleChannel(channel.id)}
              className={`p-4 rounded-xl text-left transition-all ${
                installConfig.channels.includes(channel.id)
                  ? 'bg-brand-start/20 border-2 border-brand-start'
                  : 'bg-white/5 border-2 border-transparent hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{channel.icon}</span>
                <span className="font-medium">{channel.name}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
      
      <div className="flex justify-between mt-auto pt-4 border-t border-white/10">
        <Button variant="ghost" onClick={() => setPage('env')}>
          <ArrowLeft size={16} />
          {t.config.back}
        </Button>
        <Button disabled={!canProceed} onClick={() => setPage('install')}>
          {t.config.next}
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  )
}
