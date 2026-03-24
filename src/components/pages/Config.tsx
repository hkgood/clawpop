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
  { id: 'telegram', nameKey: 'telegram', icon: '✈️' },
  { id: 'discord', nameKey: 'discord', icon: '🎮' },
  { id: 'feishu', nameKey: 'feishu', icon: '📮' },
  { id: 'whatsapp', nameKey: 'whatsapp', icon: '💬' },
]

const channelNames: Record<string, Record<string, string>> = {
  zh: {
    telegram: 'Telegram',
    discord: 'Discord',
    feishu: '飞书',
    whatsapp: 'WhatsApp',
  },
  en: {
    telegram: 'Telegram',
    discord: 'Discord',
    feishu: 'Feishu',
    whatsapp: 'WhatsApp',
  },
}

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

const recommendText = {
  zh: '推荐',
  en: 'Recommended',
}

export function Config() {
  const { installConfig, setInstallConfig, setPage } = useAppStore()
  const { t, language } = useTranslation()
  const [apiKeyValid, setApiKeyValid] = useState<boolean | null>(null)
  
  useEffect(() => {
    if (!installConfig.apiKey) {
      setApiKeyValid(null)
      return
    }
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
    <div className="flex-1 flex flex-col px-4 py-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <h2 className="text-base font-semibold text-primary">{t.config.title}</h2>
        <p className="text-xs text-secondary">{t.config.subtitle}</p>
      </motion.div>
      
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
      
      {/* 模型选择 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-sm font-medium mb-2 flex items-center gap-2 text-primary">
          <Bot size={14} />
          {t.config.modelSelect}
        </h3>
        <div className="space-y-2">
          {modelIds.map((model) => (
            <motion.button
              key={model.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setInstallConfig({ model: model.id })}
              className={`w-full px-4 py-3 rounded-lg text-left transition-all text-sm ${
                installConfig.model === model.id 
                  ? 'bg-accent border-2 border-accent' 
                  : 'bg-secondary border-2 border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium flex items-center gap-2 text-primary">
                    {modelNames[language][model.nameKey]}
                    {model.id === 'minimax-m2.5' && (
                      <span className="px-1.5 py-0.5 text-xs bg-accent text-btn-primary rounded">
                        {recommendText[language]}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-secondary">{modelDescs[language][model.descKey]}</div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  installConfig.model === model.id 
                    ? 'border-accent bg-accent' 
                    : 'border-default'
                }`}>
                  {installConfig.model === model.id && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Check size={10} className="text-btn-primary" />
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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-sm font-medium mb-2 flex items-center gap-2 text-primary">
          <Key size={14} />
          {t.config.apiKey}
          {apiKeyValid === true && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-1 px-1.5 py-0.5 text-xs bg-accent text-btn-primary rounded">
              <Check size={10} />
            </motion.span>
          )}
          {apiKeyValid === false && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-1 px-1.5 py-0.5 text-xs bg-error text-btn-primary rounded">
              <X size={10} />
            </motion.span>
          )}
        </h3>
        <Input
          type="password"
          placeholder={t.config.apiKeyPlaceholder}
          value={installConfig.apiKey}
          onChange={(e) => setInstallConfig({ apiKey: e.target.value })}
        />
        <div className="mt-1.5 text-xs text-secondary flex items-center justify-between">
          <a href="#" className="text-accent hover:underline inline-flex items-center gap-1" onClick={(e) => e.preventDefault()}>
            {t.config.getApiKey}
            <ExternalLink size={10} />
          </a>
          {apiKeyValid === false && (
            <span className="text-error text-xs">{t.config.invalidKey}</span>
          )}
        </div>
      </motion.div>
      
      {/* 消息通道 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-sm font-medium mb-2 flex items-center gap-2 text-primary">
          <MessageSquare size={14} />
          {t.config.channels}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {channels.map((channel) => (
            <motion.button
              key={channel.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleChannel(channel.id)}
              className={`px-3 py-2.5 rounded-lg text-left transition-all ${
                installConfig.channels.includes(channel.id)
                  ? 'bg-accent border-2 border-accent'
                  : 'bg-secondary border-2 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{channel.icon}</span>
                <span className="text-sm font-medium text-primary">{channelNames[language][channel.nameKey]}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
      </div>
      
      <div className="flex justify-between mt-4 pt-3 border-t border-light">
        <Button variant="ghost" onClick={() => setPage('env')}>
          <ArrowLeft size={14} />
          {t.common.back}
        </Button>
        <Button disabled={!canProceed} onClick={() => setPage('install')}>
          {t.common.next}
          <ArrowRight size={14} />
        </Button>
      </div>
    </div>
  )
}
