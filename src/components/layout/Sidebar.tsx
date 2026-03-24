import { motion } from 'framer-motion'
import { Home, Settings, Zap, Package, Sparkles } from 'lucide-react'
import { Page, useAppStore } from '../../stores/appStore'

const navItems: { id: Page; Icon: typeof Home; label: string }[] = [
  { id: 'welcome', Icon: Home, label: '开始' },
  { id: 'env', Icon: Settings, label: '环境' },
  { id: 'config', Icon: Zap, label: '配置' },
  { id: 'install', Icon: Package, label: '安装' },
  { id: 'success', Icon: Sparkles, label: '完成' },
]

export function Sidebar() {
  const { currentPage, setPage } = useAppStore()

  return (
    <div className="w-20 h-full bg-bg-secondary/80 backdrop-blur-xl flex flex-col items-center py-6 border-r border-light">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-10 h-10 rounded-xl bg-btn-primary flex items-center justify-center mb-8"
      >
        <span className="text-btn-primary font-bold text-sm">CP</span>
      </motion.div>
      
      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item, index) => {
          const isActive = currentPage === item.id
          const Icon = item.Icon
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setPage(item.id)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                isActive 
                  ? 'bg-brand-20 text-brand' 
                  : 'text-secondary hover:bg-hover hover:text-primary'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
            </motion.button>
          )
        })}
      </nav>
    </div>
  )
}
