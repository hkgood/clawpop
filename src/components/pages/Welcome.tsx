import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '../ui/Button'
import { useAppStore } from '../../stores/appStore'

export function Welcome() {
  const { setPage } = useAppStore()

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
        className="w-32 h-32 rounded-3xl bg-gradient-to-br from-brand-start via-brand-end to-orange-300 flex items-center justify-center mb-10 shadow-2xl shadow-brand-start/30"
      >
        <span className="text-white font-bold text-4xl">CP</span>
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-bold text-center mb-4 tracking-tight"
      >
        clawpop
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-lg text-text-secondary text-center mb-3"
      >
        让安装 OpenClaw 变得像打开 App 一样简单
      </motion.p>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-base text-brand-start font-medium mb-10"
      >
        「啪嗒一下，装好了」
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button 
          size="lg"
          onClick={() => setPage('env')}
          className="px-12"
        >
          开始使用
          <ArrowRight size={18} />
        </Button>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-10 flex gap-4 text-sm text-text-secondary"
      >
        <button className="hover:text-white transition-colors">中文</button>
        <span className="opacity-30">|</span>
        <button className="hover:text-white transition-colors">English</button>
      </motion.div>
    </div>
  )
}
