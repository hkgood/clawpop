import { motion } from 'framer-motion'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { useAppStore } from '../../stores/appStore'

const models = [
  { id: 'minimax-m2.5', name: 'MiniMax-M2.5', desc: '推荐 · 免费额度大', recommended: true },
  { id: 'claude-haiku', name: 'Claude Haiku', desc: '快速响应' },
  { id: 'claude-sonnet', name: 'Claude Sonnet', desc: '平衡体验' },
  { id: 'claude-opus', name: 'Claude Opus', desc: '最强能力' },
]

const channels = [
  { id: 'telegram', name: 'Telegram', icon: '✈️' },
  { id: 'discord', name: 'Discord', icon: '🎮' },
  { id: 'feishu', name: '飞书', icon: '📱' },
  { id: 'whatsapp', name: 'WhatsApp', icon: '💬' },
]

export function Config() {
  const { installConfig, setInstallConfig, setPage } = useAppStore()
  
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
        <h2 className="text-2xl font-bold mb-2">配置向导</h2>
        <p className="text-text-secondary mb-8">选择你的 AI 模型和消息通道</p>
      </motion.div>
      
      {/* 模型选择 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          🤖 选择模型
        </h3>
        <div className="space-y-2">
          {models.map((model) => (
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
                    {model.name}
                    {model.recommended && (
                      <span className="px-2 py-0.5 text-xs bg-status-success/20 text-status-success rounded-full">
                        推荐
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-text-secondary">{model.desc}</div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 ${
                  installConfig.model === model.id 
                    ? 'border-brand-start bg-brand-start' 
                    : 'border-white/30'
                }`}>
                  {installConfig.model === model.id && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-full h-full flex items-center justify-center text-xs"
                    >
                      ✓
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
          🔑 API Key
        </h3>
        <Input
          type="password"
          placeholder="输入你的 API Key"
          value={installConfig.apiKey}
          onChange={(e) => setInstallConfig({ apiKey: e.target.value })}
        />
        <div className="mt-2 text-sm text-text-secondary">
          <a 
            href="#" 
            className="text-brand-start hover:underline"
            onClick={(e) => {
              e.preventDefault()
              // TODO: 打开获取 API Key 的链接
            }}
          >
            获取 API Key →
          </a>
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
          💬 消息通道
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
                <span className="text-2xl">{channel.icon}</span>
                <span className="font-medium">{channel.name}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
      
      <div className="flex justify-between mt-auto pt-4 border-t border-white/10">
        <Button variant="ghost" onClick={() => setPage('env')}>
          ← 上一步
        </Button>
        <Button disabled={!canProceed} onClick={() => setPage('install')}>
          下一步 →
        </Button>
      </div>
    </div>
  )
}
