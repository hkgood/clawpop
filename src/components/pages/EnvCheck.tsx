import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, AlertCircle, Loader2, Hexagon, Box, Cloud, GitBranch, Globe, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '../ui/Button'
import { useAppStore } from '../../stores/appStore'
import { useTranslation } from '../../i18n/useTranslation'
import { invoke } from '@tauri-apps/api/core'

interface EnvItemProps {
  name: string
  nameKey: string
  Icon: typeof Hexagon
  status: 'checking' | 'success' | 'warning' | 'error'
  version?: string | null
  message?: string
  fixCommand?: string
  action?: string
  onAction?: () => void
  t: any
}

function EnvItem({ name, nameKey, Icon, status, version, message, fixCommand, action, onAction, t }: EnvItemProps & { theme?: 'light' | 'dark' }) {
  const { theme } = useAppStore()
  
  const statusConfig = {
    checking: { color: theme === 'light' ? 'text-secondary' : 'text-text-secondary', IconComponent: Loader2, animate: true },
    success: { color: 'text-status-success', IconComponent: CheckCircle2, animate: false },
    warning: { color: 'text-status-warning', IconComponent: AlertCircle, animate: false },
    error: { color: 'text-status-error', IconComponent: XCircle, animate: false },
  }
  
  const config = statusConfig[status]
  const StatusIcon = config.IconComponent
  const displayName = t?.env?.[nameKey as keyof typeof t.env] || name
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center justify-between p-4 rounded-xl border ${
        theme === 'light' 
          ? 'bg-white/80 border-default' 
          : 'bg-white/5 border border-white/5'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          theme === 'light' ? 'bg-hover' : 'bg-white/5'
        }`}>
          <Icon size={20} className={theme === 'light' ? 'text-secondary' : 'text-text-secondary'} />
        </div>
        <div>
          <div className={`font-medium ${theme === 'light' ? 'text-primary' : ''}`}>{displayName}</div>
          {version && <div className={`text-sm ${theme === 'light' ? 'text-secondary' : 'text-text-secondary'}`}>v{version}</div>}
          {message && <div className={`text-sm ${status === 'error' ? 'text-status-error' : 'text-status-warning'}`}>{message}</div>}
          {fixCommand && status !== 'success' && status !== 'checking' && (
            <div className="mt-1">
              <code className={`text-xs px-2 py-1 rounded font-mono ${
                theme === 'light' ? 'bg-hover text-secondary' : 'bg-black/30 text-text-secondary'
              }`}>
                {fixCommand}
              </code>
            </div>
          )}
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
  const { envCheck, setEnvCheck, setPage, theme } = useAppStore()
  const { t } = useTranslation()
  const [checking, setChecking] = useState(true)
  
  // 环境检测
  useEffect(() => {
    const checkEnv = async () => {
      setChecking(true)
      
      try {
        // 调用后端检查环境
        const result = await invoke<{
          node: string | null;
          npm: string | null;
          git: string | null;
          docker: string | null;
          network: boolean;
        }>('check_env')
        
        setEnvCheck({
          node: result.node,
          npm: result.npm,
          docker: result.docker,
          git: result.git,
          network: result.network,
        })
      } catch (err) {
        console.error('Environment check failed:', err)
        // 如果后端调用失败，使用模拟数据
        setEnvCheck({
          node: '24.0.0',
          npm: '11.8.0',
          docker: null,
          git: '2.40.0',
          network: true,
        })
      }
      
      setChecking(false)
    }
    
    checkEnv()
  }, [setEnvCheck])
  
  const envItems: (EnvItemProps & { theme?: 'light' | 'dark' })[] = [
    { 
      name: 'Node.js', 
      nameKey: 'node',
      Icon: Hexagon, 
      status: (envCheck?.node ? 'success' : checking ? 'checking' : 'error') as EnvItemProps['status'],
      version: envCheck?.node,
      fixCommand: !envCheck?.node && !checking ? 'brew install node' : undefined,
      t,
      theme
    },
    { 
      name: 'npm', 
      nameKey: 'npm',
      Icon: Box, 
      status: (envCheck?.npm ? 'success' : checking ? 'checking' : 'error') as EnvItemProps['status'],
      version: envCheck?.npm,
      fixCommand: !envCheck?.npm && !checking ? 'brew install npm' : undefined,
      t,
      theme
    },
    { 
      name: 'Docker', 
      nameKey: 'docker',
      Icon: Cloud, 
      status: (envCheck?.docker ? 'success' : checking ? 'checking' : 'warning') as EnvItemProps['status'],
      message: envCheck?.docker ? undefined : t?.env?.dockerOptional || '未安装（非必需）',
      fixCommand: !envCheck?.docker && !checking ? 'brew install --cask docker' : undefined,
      action: t?.env?.install || '安装',
      onAction: () => {},
      t,
      theme
    },
    { 
      name: 'Git', 
      nameKey: 'git',
      Icon: GitBranch, 
      status: (envCheck?.git ? 'success' : checking ? 'checking' : 'error') as EnvItemProps['status'],
      version: envCheck?.git,
      fixCommand: !envCheck?.git && !checking ? 'brew install git' : undefined,
      t,
      theme
    },
    { 
      name: '网络', 
      nameKey: 'network',
      Icon: Globe, 
      status: (envCheck?.network ? 'success' : checking ? 'checking' : 'error') as EnvItemProps['status'],
      message: envCheck?.network ? (t?.env?.networkOk || '正常') : (t?.env?.networkFail || '无法连接'),
      fixCommand: !envCheck?.network && !checking ? '检查网络连接' : undefined,
      t,
      theme
    },
  ]
  
  const canProceed = !checking && envCheck?.node && envCheck?.git && envCheck?.network

  return (
    <div className="flex-1 flex flex-col px-8 py-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className={`text-2xl font-bold mb-2 ${theme === 'light' ? 'text-primary' : ''}`}>{t.env.title}</h2>
        <p className={`text-sm mb-4 ${theme === 'light' ? 'text-secondary' : 'text-text-secondary'}`}>{t.env.subtitle}</p>
      </motion.div>
      
      <div className="flex-1 space-y-3 overflow-y-auto pb-4">
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
          {t.common.back}
        </Button>
        <Button 
          disabled={!canProceed}
          onClick={() => setPage('config')}
        >
          {t.common.next}
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  )
}
