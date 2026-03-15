import { motion } from 'framer-motion'
import { Button } from '../ui/Button'
import { useAppStore } from '../../stores/appStore'

export function Success() {
  const { reset } = useAppStore()
  
  const handleOpenDashboard = () => {
    // TODO: 打开控制台
    window.open('http://127.0.0.1:18789', '_blank')
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-6">
      {/* 庆祝动画 */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="text-6xl mb-6"
      >
        🎉
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
          <div className="text-2xl">🌐</div>
          <div className="flex-1">
            <div className="text-sm text-text-secondary">控制台地址</div>
            <div className="font-mono text-brand-start">http://127.0.0.1:18789</div>
          </div>
        </div>
        
        <div className="card p-4 flex items-center gap-4">
          <div className="text-2xl">📖</div>
          <div className="flex-1">
            <div className="text-sm text-text-secondary">使用方式</div>
            <div className="text-sm">在控制台发送消息即可开始对话</div>
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
          🌐 打开控制台
        </Button>
        <Button variant="secondary" onClick={reset}>
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
          className="text-brand-start hover:underline"
        >
          OpenClaw 文档 →
        </a>
      </motion.div>
    </div>
  )
}
