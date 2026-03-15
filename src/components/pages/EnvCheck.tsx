import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, AlertCircle, Loader2, Hexagon, Box, Cloud, GitBranch, Globe, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '../ui/Button'
import { useAppStore } from '../../stores/appStore'

interface EnvItemProps {
  name: string
  Icon: typeof Hexagon
  status: 'checking' | 'success' | 'warning' | 'error'
  version?: string | null
  message?: string
  action?: string
  onAction?: () => void
}

function EnvItem({ name, Icon, status, version, message, action, onAction }: EnvItemProps) {
  const statusConfig = {
    checking: { color: 'text-text-secondary', IconComponent: Loader2, animate: true },
    success: { color: 'text-status-success', IconComponent: CheckCircle2, animate: false },
    warning: { color: 'text-status-warning', IconComponent: AlertCircle, animate: false },
    error: { color: 'text-status-error', IconComponent: XCircle, animate: false },
  }
  
  const config = statusConfig[status]
  const StatusIcon = config.IconComponent
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
          <Icon size={20} className="text-text-secondary" />
        </div>
        <div>
          <div className="font-medium">{name}</div>
          {version && <div className="text-sm text-text-secondary">v{version}</div>}
          {message && <div className="text-sm text-status-warning">{message}</div>}
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {status === 'checking' ? (
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <StatusIcon size={20} className="text-text-secondary" />
          </motion.div>
        ) : (
          <StatusIcon size={20} className={config.color} />
        )}
        
        {action && status !== 'checking' && status !== 'success' && (
          <Button size="sm" variant="secondary" onClick={onAction}>
            {action}
          </Button>
        )}
      </div>
    </motion.div>
  )
}

export function EnvCheck() {
  const { envCheck, setEnvCheck, setPage } = useAppStore()
  const [checking, setChecking] = useState(true)
  
  // 模拟环境检测
  useEffect(() => {
    const checkEnv = async () => {
      setChecking(true)
      await new Promise(r => setTimeout(r, 1500))
      
      setEnvCheck({
        node: '24.0.0',
        npm: '11.8.0',
        docker: null,
        git: '2.40.0',
        network: true,
      })
      setChecking(false)
    }
    
    checkEnv()
  }, [setEnvCheck])
  
  const envItems: EnvItemProps[] = [
    { 
      name: 'Node.js', 
      Icon: Hexagon, 
      status: (envCheck?.node ? 'success' : checking ? 'checking' : 'error') as EnvItemProps['status'],
      version: envCheck?.node 
    },
    { 
      name: 'npm', 
      Icon: Box, 
      status: (envCheck?.npm ? 'success' : checking ? 'checking' : 'error') as EnvItemProps['status'],
      version: envCheck?.npm 
    },
    { 
      name: 'Docker', 
      Icon: Cloud, 
      status: (envCheck?.docker ? 'success' : checking ? 'checking' : 'warning') as EnvItemProps['status'],
      message: envCheck?.docker ? undefined : '未安装',
      action: '安装',
      onAction: () => {}
    },
    { 
      name: 'Git', 
      Icon: GitBranch, 
      status: (envCheck?.git ? 'success' : checking ? 'checking' : 'error') as EnvItemProps['status'],
      version: envCheck?.git 
    },
    { 
      name: '网络', 
      Icon: Globe, 
      status: (envCheck?.network ? 'success' : checking ? 'checking' : 'error') as EnvItemProps['status'],
      message: envCheck?.network ? '正常' : '无法连接'
    },
  ]
  
  const canProceed = !checking && envCheck?.node && envCheck?.git && envCheck?.network

  return (
    <div className="flex-1 flex flex-col px-8 py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold mb-2">环境检测</h2>
        <p className="text-text-secondary mb-8">让我们检查一下你的电脑环境</p>
      </motion.div>
      
      <div className="flex-1 space-y-3 overflow-y-auto">
        {envItems.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <EnvItem {...item} />
          </motion.div>
        ))}
      </div>
      
      <div className="flex justify-between mt-8 pt-4 border-t border-white/10">
        <Button variant="ghost" onClick={() => setPage('welcome')}>
          <ArrowLeft size={16} />
          上一步
        </Button>
        <Button 
          disabled={!canProceed}
          onClick={() => setPage('config')}
        >
          下一步
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  )
}
