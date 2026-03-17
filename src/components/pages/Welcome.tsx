import { motion } from 'framer-motion'
import { ArrowRight, Globe } from 'lucide-react'
import { Button } from '../ui/Button'
import { useAppStore } from '../../stores/appStore'
import { useState } from 'react'

export function Welcome() {
  const { setPage } = useAppStore()
  const [language, setLanguage] = useState<'zh' | 'en'>('zh')
  
  const t = {
    zh: {
      title: 'clawpop',
      subtitle: '让安装 OpenClaw 变得像打开 App 一样简单',
      slogan: '「啪嗒一下，装好了」',
      button: '开始使用',
    },
    en: {
      title: 'clawpop',
      subtitle: 'Install OpenClaw as easily as opening an App',
      slogan: '"Snap! It\'s installed"',
      button: 'Get Started',
    }
  }
  
  const text = t[language]

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
        {text.title}
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-lg text-text-secondary text-center mb-3"
      >
        {text.subtitle}
      </motion.p>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-base text-brand-start font-medium mb-10"
      >
        {text.slogan}
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
          {text.button}
          <ArrowRight size={18} />
        </Button>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-10 flex gap-2"
      >
        <button 
          onClick={() => setLanguage('zh')}
          className={`px-3 py-1 rounded-full text-sm transition-all ${
            language === 'zh' 
              ? 'bg-brand-start text-white' 
              : 'text-text-secondary hover:text-white hover:bg-white/10'
          }`}
        >
          中文
        </button>
        <button 
          onClick={() => setLanguage('en')}
          className={`px-3 py-1 rounded-full text-sm transition-all ${
            language === 'en' 
              ? 'bg-brand-start text-white' 
              : 'text-text-secondary hover:text-white hover:bg-white/10'
          }`}
        >
          English
        </button>
      </motion.div>
    </div>
  )
}
