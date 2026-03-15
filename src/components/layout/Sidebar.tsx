import { motion } from 'framer-motion'
import { Page, useAppStore } from '../../stores/appStore'

const navItems: { id: Page; icon: string; label: string }[] = [
  { id: 'welcome', icon: '🏠', label: '开始' },
  { id: 'env', icon: '⚙️', label: '环境' },
  { id: 'config', icon: '⚡', label: '配置' },
  { id: 'install', icon: '📦', label: '安装' },
  { id: 'success', icon: '✨', label: '完成' },
]

export function Sidebar() {
  const { currentPage, setPage } = useAppStore()

  return (
    <div className="w-20 h-full bg-bg-secondary flex flex-col items-center py-6 border-r border-white/5">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-3xl mb-8"
      >
        🦾
      </motion.div>
      
      <nav className="flex-1 flex flex-col gap-4">
        {navItems.map((item, index) => {
          const isActive = currentPage === item.id
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setPage(item.id)}
              className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center transition-all ${
                isActive 
                  ? 'bg-brand-start/20 text-brand-start' 
                  : 'text-text-secondary hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] mt-1">{item.label}</span>
            </motion.button>
          )
        })}
      </nav>
    </div>
  )
}
