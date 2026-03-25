import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Bot, Key, MessageSquare, ArrowRight, ArrowLeft, ExternalLink, Check, X, Loader2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { useAppStore } from '../../stores/appStore'
import { useTranslation } from '../../i18n/useTranslation'
import { invoke } from '@tauri-apps/api/core'

const modelIds = [
  // MiniMax - 免费额度大
  { id: 'minimax-portal/MiniMax-M2.5', nameKey: 'minimaxM25', descKey: 'free', provider: 'MiniMax' },
  { id: 'minimax-portal/MiniMax-M2.7', nameKey: 'minimaxM27', descKey: 'latest', provider: 'MiniMax' },
  { id: 'minimax-portal/MiniMax-M2.5-highspeed', nameKey: 'minimaxHS', descKey: 'fast', provider: 'MiniMax' },
  { id: 'minimax-portal/MiniMax-M2.5-Lightning', nameKey: 'minimaxLT', descKey: 'fastest', provider: 'MiniMax' },
  
  // 阿里云 Qwen - 国内稳定
  { id: 'aliyun-bailian/qwen-max', nameKey: 'qwenMax', descKey: 'best', provider: '阿里云' },
  { id: 'aliyun-bailian/qwen-plus', nameKey: 'qwenPlus', descKey: 'balanced', provider: '阿里云' },
  { id: 'aliyun-bailian/qwen-turbo', nameKey: 'qwenTurbo', descKey: 'fast', provider: '阿里云' },
  { id: 'aliyun-bailian/qwen-long', nameKey: 'qwenLong', descKey: 'long', provider: '阿里云' },
  { id: 'aliyun-bailian/qwen3.5-flash', nameKey: 'qwen35Flash', descKey: 'fast', provider: '阿里云' },
  { id: 'aliyun-bailian/qwen3.5-plus', nameKey: 'qwen35Plus', descKey: 'smart', provider: '阿里云' },
  { id: 'aliyun-bailian/qwen3-max', nameKey: 'qwen3Max', descKey: 'best', provider: '阿里云' },
  { id: 'aliyun-bailian/coder-model', nameKey: 'qwenCoder', descKey: 'coder', provider: '阿里云' },
  
  // Anthropic Claude - 最强能力
  { id: 'anthropic/claude-haiku-4', nameKey: 'claudeHaiku', descKey: 'fast', provider: 'Anthropic' },
  { id: 'anthropic/claude-sonnet-4-20250514', nameKey: 'claudeSonnet', descKey: 'balanced', provider: 'Anthropic' },
  { id: 'anthropic/claude-opus-4-20250514', nameKey: 'claudeOpus', descKey: 'powerful', provider: 'Anthropic' },
  
  // DeepSeek - 免费/便宜
  { id: 'deepseek/deepseek-chat', nameKey: 'deepseekV3', descKey: 'latest', provider: 'DeepSeek' },
  { id: 'deepseek/deepseek-reasoner', nameKey: 'deepseekR1', descKey: 'reasoning', provider: 'DeepSeek' },
  
  // Google Gemini - 能力强
  { id: 'google/gemini-2.0-flash-exp-02-05', nameKey: 'gemini20', descKey: 'latest', provider: 'Google' },
  { id: 'google/gemini-2.5-pro-preview-0506', nameKey: 'gemini25', descKey: 'powerful', provider: 'Google' },
  
  // OpenAI
  { id: 'openai/gpt-4o', nameKey: 'gpt4o', descKey: 'powerful', provider: 'OpenAI' },
  { id: 'openai/gpt-4o-mini', nameKey: 'gpt4oMini', descKey: 'fast', provider: 'OpenAI' },
  { id: 'openai/gpt-4-turbo', nameKey: 'gpt4turbo', descKey: 'balanced', provider: 'OpenAI' },
  
  // 小米 MIMO
  { id: 'xiaomi/mimo-v2-pro', nameKey: 'mimoPro', descKey: 'powerful', provider: '小米' },
  { id: 'xiaomi/mimo-v2-flash', nameKey: 'mimoFlash', descKey: 'fast', provider: '小米' },
  { id: 'xiaomi/mimo-v2-omni', nameKey: 'mimoOmni', descKey: 'multimodal', provider: '小米' },
  
  // Mistral
  { id: 'mistralai/mistral-7b-instruct', nameKey: 'mistral7b', descKey: 'fast', provider: 'Mistral' },
  { id: 'mistralai/mistral-small-2409', nameKey: 'mistralSmall', descKey: 'balanced', provider: 'Mistral' },
  
  // OpenRouter - 开源模型
  { id: 'openrouter/meta-llama/llama-3.1-8b-instruct', nameKey: 'llama31', descKey: 'open', provider: 'Meta' },
  { id: 'openrouter/google/gemini-2.0-flash-exp', nameKey: 'geminiFlash', descKey: 'fast', provider: 'Google' },
  { id: 'openrouter/ai/chatgpt-4o-latest', nameKey: 'gpt4oLatest', descKey: 'latest', provider: 'OpenAI' },
  
  // 免费模型
  { id: 'nvidia/nemotron-3-super-120b-a12b:free', nameKey: 'nemotron', descKey: 'free', provider: 'NVIDIA' },
  { id: 'minimax/minimax-m2.5:free', nameKey: 'minimaxFree', descKey: 'free', provider: 'MiniMax' },
  { id: 'stepfun/step-3.5-flash:free', nameKey: 'stepfun', descKey: 'free', provider: 'StepFun' },
  { id: 'openrouter/hunter-alpha', nameKey: 'hunter', descKey: 'free', provider: 'Hunter' },
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

// 模型名称翻译
const modelNames: Record<string, Record<string, string>> = {
  zh: {
    minimaxM25: 'MiniMax M2.5',
    minimaxM27: 'MiniMax M2.7',
    minimaxHS: 'M2.5 高速版',
    minimaxLT: 'M2.5 闪电版',
    qwenMax: 'Qwen Max',
    qwenPlus: 'Qwen Plus',
    qwenTurbo: 'Qwen Turbo',
    qwenLong: 'Qwen Long',
    qwen35Flash: 'Qwen3.5 Flash',
    qwen35Plus: 'Qwen3.5 Plus',
    qwen3Max: 'Qwen3 Max',
    qwenCoder: 'Qwen Coder',
    claudeHaiku: 'Claude Haiku',
    claudeSonnet: 'Claude Sonnet',
    claudeOpus: 'Claude Opus',
    deepseekV3: 'DeepSeek V3',
    deepseekR1: 'DeepSeek R1',
    gemini20: 'Gemini 2.0 Flash',
    gemini25: 'Gemini 2.5 Pro',
    gpt4o: 'GPT-4o',
    gpt4oMini: 'GPT-4o Mini',
    gpt4turbo: 'GPT-4 Turbo',
    mimoPro: 'MIMO v2 Pro',
    mimoFlash: 'MIMO v2 Flash',
    mimoOmni: 'MIMO v2 Omni',
    mistral7b: 'Mistral 7B',
    mistralSmall: 'Mistral Small',
    llama31: 'Llama 3.1 8B',
    geminiFlash: 'Gemini Flash',
    gpt4oLatest: 'GPT-4o 最新版',
    nemotron: 'Nemotron 3 Super',
    minimaxFree: 'M2.5 免费版',
    stepfun: 'StepFun 3.5',
    hunter: 'Hunter Alpha',
  },
  en: {
    minimaxM25: 'MiniMax M2.5',
    minimaxM27: 'MiniMax M2.7',
    minimaxHS: 'M2.5 High Speed',
    minimaxLT: 'M2.5 Lightning',
    qwenMax: 'Qwen Max',
    qwenPlus: 'Qwen Plus',
    qwenTurbo: 'Qwen Turbo',
    qwenLong: 'Qwen Long',
    qwen35Flash: 'Qwen3.5 Flash',
    qwen35Plus: 'Qwen3.5 Plus',
    qwen3Max: 'Qwen3 Max',
    qwenCoder: 'Qwen Coder',
    claudeHaiku: 'Claude Haiku',
    claudeSonnet: 'Claude Sonnet',
    claudeOpus: 'Claude Opus',
    deepseekV3: 'DeepSeek V3',
    deepseekR1: 'DeepSeek R1',
    gemini20: 'Gemini 2.0 Flash',
    gemini25: 'Gemini 2.5 Pro',
    gpt4o: 'GPT-4o',
    gpt4oMini: 'GPT-4o Mini',
    gpt4turbo: 'GPT-4 Turbo',
    mimoPro: 'MIMO v2 Pro',
    mimoFlash: 'MIMO v2 Flash',
    mimoOmni: 'MIMO v2 Omni',
    mistral7b: 'Mistral 7B',
    mistralSmall: 'Mistral Small',
    llama31: 'Llama 3.1 8B',
    geminiFlash: 'Gemini Flash',
    gpt4oLatest: 'GPT-4o Latest',
    nemotron: 'Nemotron 3 Super',
    minimaxFree: 'M2.5 Free',
    stepfun: 'StepFun 3.5',
    hunter: 'Hunter Alpha',
  }
}

// 模型描述翻译
const modelDescs: Record<string, Record<string, string>> = {
  zh: {
    free: '免费额度',
    latest: '最新模型',
    best: '最强能力',
    balanced: '平衡体验',
    fast: '快速响应',
    fastest: '最快响应',
    smart: '智能升级',
    powerful: '最强能力',
    reasoning: '推理模型',
    long: '长文本',
    coder: '编程专用',
    multimodal: '多模态',
    open: '开源模型',
  },
  en: {
    free: 'Free quota',
    latest: 'Latest model',
    best: 'Most powerful',
    balanced: 'Balanced',
    fast: 'Fast response',
    fastest: 'Fastest',
    smart: 'Smarter',
    powerful: 'Most powerful',
    reasoning: 'Reasoning',
    long: 'Long context',
    coder: 'Coding',
    multimodal: 'Multimodal',
    open: 'Open source',
  }
}

export function Config() {
  const { installConfig, setInstallConfig, setPage } = useAppStore()
  const { t, language } = useTranslation()
  const [apiKeyValid, setApiKeyValid] = useState<boolean | null>(null)
  const [validating, setValidating] = useState(false)
  
  // 验证 API Key - 调用后端真实 API 验证
  const validateApiKey = useCallback(async () => {
    if (!installConfig.apiKey || !installConfig.model) {
      setApiKeyValid(null)
      return
    }
    
    // 先做基本格式检查
    if (installConfig.apiKey.length < 10 || installConfig.apiKey.includes(' ')) {
      setApiKeyValid(false)
      return
    }
    
    setValidating(true)
    try {
      const isValid = await invoke<boolean>('validate_api_key', {
        model: installConfig.model,
        apiKey: installConfig.apiKey
      })
      setApiKeyValid(isValid)
    } catch (err) {
      console.error('API Key validation failed:', err)
      // 验证失败时回退到格式验证
      setApiKeyValid(installConfig.apiKey.length > 10)
    } finally {
      setValidating(false)
    }
  }, [installConfig.apiKey, installConfig.model])
  
  // 输入变化后延迟验证（避免频繁调用 API）
  useEffect(() => {
    const timer = setTimeout(() => {
      validateApiKey()
    }, 1000) // 1秒延迟
    
    return () => clearTimeout(timer)
  }, [validateApiKey])
  
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
    <div className="flex-1 flex flex-col px-8 py-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-h1 mb-2 text-primary">{t.config.title}</h2>
        <p className="text-secondary">{t.config.subtitle}</p>
      </motion.div>
      
      {/* 内容区域 - 可滚动 */}
      <div className="flex-1 overflow-y-auto pr-2">
      
      {/* 模型选择 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <h3 className="text-h2 mb-4 flex items-center gap-2 text-primary">
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
              className={`w-full p-4 rounded text-left transition-all ${
                installConfig.model === model.id 
                  ? 'bg-brand/40 border-2 border-brand' 
                  : 'bg-brand/10 border-2 border-transparent hover:border-default'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {modelNames[language][model.nameKey]}
                    <span className="px-2 py-0.5 text-xs bg-default text-secondary rounded-full">
                      {model.provider}
                    </span>
                  </div>
                  <div className="text-caption text-secondary text-primary">{modelDescs[language][model.descKey]}</div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  installConfig.model === model.id 
                    ? 'border-brand bg-brand' 
                    : 'border-default'
                }`}>
                  {installConfig.model === model.id && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <Check size={12} className="text-primary" />
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
        <h3 className="text-h2 mb-4 flex items-center gap-2 text-primary">
          <Key size={18} />
          {t.config.apiKey}
          {apiKeyValid === true && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-2 px-2 py-0.5 text-xs bg-success text-success rounded-full flex items-center gap-1"
            >
              <Check size={10} /> {t.config.apiKeyValid}
            </motion.span>
          )}
          {apiKeyValid === false && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-2 px-2 py-0.5 text-xs bg-error text-error rounded-full flex items-center gap-1"
            >
              <X size={10} /> {t.config.apiKeyInvalid}
            </motion.span>
          )}
          {validating && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-2 px-2 py-0.5 text-xs bg-default text-secondary rounded-full flex items-center gap-1"
            >
              <Loader2 size={10} className="animate-spin" /> 验证中...
            </motion.span>
          )}
        </h3>
        <Input
          type="password"
          placeholder={t.config.apiKeyPlaceholder}
          value={installConfig.apiKey}
          onChange={(e) => setInstallConfig({ apiKey: e.target.value })}
        />
        <div className="mt-2 text-caption text-secondary flex items-center justify-between">
          <a 
            href="#" 
            className="text-brand hover:underline inline-flex items-center gap-1"
            onClick={(e) => {
              e.preventDefault()
            }}
          >
            {t.config.getApiKey}
            <ExternalLink size={12} />
          </a>
          {apiKeyValid === false && (
            <span className="text-error text-xs">{t.config.invalidKey}</span>
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
        <h3 className="text-h2 mb-4 flex items-center gap-2 text-primary">
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
              className={`p-4 rounded text-left transition-all ${
                installConfig.channels.includes(channel.id)
                  ? 'bg-brand/40 border-2 border-brand'
                  : 'bg-brand/10 border-2 border-transparent hover:border-default'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl text-primary">{channel.icon}</span>
                <span className="font-medium">{channelNames[language][channel.nameKey]}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
      </div>{/* end scrollable area */}
      
      <div className="flex justify-between pt-4 border-t border-light">
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
